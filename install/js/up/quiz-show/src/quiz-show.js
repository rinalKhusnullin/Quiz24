import {Type, Tag, Text, Loc} from 'main.core';
window.am4core.useTheme(am4themes_animated);
window.am4core.useTheme(am4themes_material);


export class QuizShow
{
	DISPLAY_TYPES = {
		0 : 'PieChart',
		1 : 'WordCloud',
		2 : 'BarChart',
		3 : 'RawOutput',
	};


	quiz; // Текущий quiz
	question; // Текущий question
	chart; // Диаграмма
	answers;

	constructor(options = {})
	{
		this.quizId = options.quizId;

		if (Type.isStringFilled(options.rootNodeId))
		{
			this.rootNodeId = options.rootNodeId;
		}
		else
		{
			throw new Error('QuizShow: options.rootNodeId required');
		}

		this.rootNode = document.getElementById(this.rootNodeId);
		if (!this.rootNode)
		{
			throw new Error(`QuizShow: element with id "${this.rootNodeId}" not found`);
		}

		this.questions = []; // Все вопросы : title, id

		BX.addCustomEvent("onPullEvent-up.quiz", (command, params) => {
			console.log(params);
			if (command === "update_answers") {
				// Обработка Push-уведомления
				console.log(params.message);
				console.log(params.answer);
				console.log(params.questionId);

				this.updateChart(params.answer, params.questionId);
			}
		});

		this.reload();
	}

	loadQuiz()
	{
		return new Promise((resolve, reject) => {
			BX.ajax.runAction(
					'up:quiz.quiz.getQuiz',{
						data : {
							id : this.quizId,
						}
					})
				.then((response) => {
					const quiz = response.data.quiz;
					resolve(quiz);
				})
				.catch((error) => {
					console.error(error);
					reject(error);
				})
			;
		});
	}

	loadQuestion(id)
	{
		return new Promise((resolve, reject) => {
			BX.ajax.runAction(
					'up:quiz.question.getQuestion',{
						data : {
							id : id,
						}
					})
				.then((response) => {
					const question = response.data.question;
					resolve(question);
				})
				.catch((error) => {
					console.error(error);
					reject(error);
				})
			;
		});
	}

	loadQuestions()
	{
		return new Promise((resolve, reject) => {
			BX.ajax.runAction(
				'up:quiz.question.getQuestions',{
					data : {
						quizId : this.quizId,
					}
				})
				.then((response) => {
					const questions = response.data.questions
					resolve(questions);
				})
				.catch((error) => {
					console.error(error);
					reject(error);
				})
			;
		});
	}

	loadAnswers()
	{
		return new Promise((resolve, reject) => {
			BX.ajax.runAction(
					'up:quiz.answer.getAnswers', {
						data: {
							questionId: this.question.ID,
						}
					}
				)
				.then((response) => {
					const answers = response.data;
					resolve(answers);
				})
				.catch((error) => {
					console.error(error);
				});
		});
	}

	reload()
	{
		this.loadQuiz().then(quiz => {
			this.quiz = quiz;
			this.loadQuestions()
				.then(questions => {
					this.questions = questions;
					if (this.questions.length === 0)
					{
						this.rootNode.innerHTML = '';
						this.rootNode.appendChild(Up.Quiz.QuizErrorManager.getNotQuestionsError());
					}
					else
					{
						this.currentQuestionId = +this.questions[0].ID;
						this.loadQuestion(this.currentQuestionId).then(question =>{
							this.question = question;
							this.loadAnswers().then(answers =>{
								this.answers = answers;
								this.render();
							});
						});
					}

				});
			}, error => {
			this.rootNode.innerHTML = '';
			this.rootNode.appendChild(Up.Quiz.QuizErrorManager.getQuizNotFoundError());
		});
	}


	render()
	{
		this.rootNode.innerHTML = ``;

		const QuizHeroSection = Tag.render`
			<section class="hero is-small is-primary">
				<div class="hero-body">
					<p class="title mb-0">
						${Text.encode(this.quiz.TITLE)}#${Text.encode(this.quiz.CODE)}
					</p>
					${this.getShareNode(this.quiz)}
				</div>
			</section>
		`;
		this.rootNode.appendChild(QuizHeroSection);

		const QuizResultContent = Tag.render`
			<div class="box">
				<div class="columns">
					<div class="column is-one-quarter question-list">
						<div class="question-list__title has-text-weight-semibold has-text-centered is-uppercase">${Loc.getMessage('UP_QUIZ_SHOW_QUESTION')}</div>
						${this.getQuestionsListNode()}
					</div>
						${this.getQuestionResultNode()}
				</div>
			</div>
		`;

		this.rootNode.appendChild(QuizResultContent);
		this.renderChart();
	}

	getQuestionsListNode()
	{
		const QuestionListNode = Tag.render`<div class="question-list__questions"></div>`;
		this.questions.forEach(question => {
			const QuestionNode = Tag.render`<a class="question-list__question button">${Text.encode(question.QUESTION_TEXT)}</a>`;
			QuestionNode.onclick = () => {
				this.renderQuestionResult(+Text.encode(question.ID));
				this.currentQuestionId = +question.ID;
			}
			if (this.currentQuestionId === +question.ID)
			{
				QuestionNode.classList.add('is-link', 'is-selected');
			}
			QuestionListNode.appendChild(QuestionNode);
		});
		QuestionListNode.onclick = (e) => {
			let target = e.target;
			let questions = QuestionListNode.querySelectorAll('.question-list__question');

			if (!target.closest('.question-list__question')) return;

			questions.forEach(question => {
				if (target === question)
				{
					if (!question.classList.contains('is-link'))
						question.classList.add('is-link', 'is-selected');
				}
				else
				{
					question.classList.remove('is-link', 'is-selected');
				}
			})
		};
		return QuestionListNode;
	}

	getQuestionResultNode()
	{
		return Tag.render`
			<div class=" column is-three-quarters statistics" id="questionResult">
				<div class="statistics__title has-text-weight-semibold has-text-centered is-uppercase">${Loc.getMessage('UP_QUIZ_SHOW_STATISTIC')}</div>
				<div id="statistics__content">
					<div class="statistics__question-title">
						<strong>${Loc.getMessage('UP_QUIZ_SHOW_QUESTION')} : </strong>
						${Text.encode(this.question.QUESTION_TEXT)}
					</div>
					<div>
						<div id="chart" style="width: 900px; height: 600px;"></div>
					</div>
				</div>
			</div>
		`;
	}

	renderChart()
	{
		// Create chart instance
		let chartType = (this.DISPLAY_TYPES[this.question.QUESTION_DISPLAY_ID]) ?? 'BarChart'; //BarChart - Default chart series
		let data = this.getAnswersData();

		if (chartType === 'PieChart')
		{
			let chart = am4core.create('chart', 'PieChart')
			let series = chart.series.push(new am4charts.PieSeries());
			series.dataFields.value = "count";
			series.dataFields.category = "answer";
			chart.data = data;

			chart.animated = true;
			chart.legend = new am4charts.Legend();
			if (this.chart) this.chart.dispose();
			this.chart = chart;
		}
		else if (chartType === 'WordCloud')
		{
			// установка данных для диаграммы
			let chart = am4core.create('chart', am4plugins_wordCloud.WordCloud);
			chart.data = data;

			// настройка серии Word Cloud
			let series = chart.series.push(new am4plugins_wordCloud.WordCloudSeries());
			series.dataFields.word = "answer";
			series.dataFields.value = "count";
			series.colors = new am4core.ColorSet();

			// настройка свойств серии
			series.minFontSize = 18;
			series.maxFontSize = 60;
			series.labels.template.tooltipText = `${Loc.getMessage('UP_QUIZ_SHOW_ANSWER_OPTION')}: {answer}\n${Loc.getMessage('UP_QUIZ_SHOW_ANSWERS_COUNT')}: {count}`;
			series.labels.template.fillOpacity = 0.9;
			series.angles = [0, -90];

			// настройка свойств диаграммы
			//chart.fontSize = 20;
			//chart.fontFamily = 'Courier New';
			//chart.background.fill = am4core.color('#F5F5F5');
			//chart.background.stroke = am4core.color('#D3D3D3');
			//chart.background.strokeWidth = 2;
			//chart.background.cornerRadius = 10;
			//chart.padding(40, 40, 40, 40);
			chart.legend = null;
			if (this.chart) this.chart.dispose();
			this.chart = chart;
		}
		else if (chartType === 'BarChart' || 1)
		{
			// установка данных для диаграммы
			let chart = am4core.create('chart', am4charts.XYChart);
			chart.data = data;
			let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
			categoryAxis.dataFields.category = 'answer';
			categoryAxis.renderer.grid.template.location = 0;

			// создание оси Y
			let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
			valueAxis.renderer.grid.template.location = 0;

			valueAxis.renderer.labels.template.step = 2;
			valueAxis.min = 0;
			valueAxis.renderer.minGridDistance = 50;

			let label = valueAxis.renderer.labels.template;
			label.numberFormatter = new am4core.NumberFormatter();
			label.numberFormatter.numberFormat = "#";

			// создание серии колонок
			let series = chart.series.push(new am4charts.ColumnSeries());
			series.dataFields.categoryX = 'answer';
			series.dataFields.valueY = 'count';
			series.columns.template.tooltipText = `${Loc.getMessage('UP_QUIZ_SHOW_ANSWER_OPTION')}: {categoryX}\n${Loc.getMessage('UP_QUIZ_SHOW_ANSWERS_COUNT')}: {valueY}`;
			let colorSet = new am4core.ColorSet();
			colorSet.colors = [
				am4core.color("#FFC300"),
				am4core.color("#FF5733"),
				am4core.color("#C70039"),
				am4core.color("#900C3F"),
				am4core.color("#581845"),
				am4core.color("#0074D9"),
				am4core.color("#7FDBFF"),
				am4core.color("#39CCCC"),
				am4core.color("#3D9970"),
				am4core.color("#2ECC40"),
				am4core.color("#01FF70"),
				am4core.color("#FFDC00"),
				am4core.color("#FF851B"),
				am4core.color("#FF4136"),
				am4core.color("#B10DC9")
			];
			series.columns.template.adapter.add("fill", function(fill, target) {
				return colorSet.next();
			});
			// убрать границу у колонок
			series.columns.template.strokeOpacity = 0;


			// настройка свойств диаграммы
			chart.padding(40, 40, 40, 40);
			//chart.background.fill = am4core.color('#F5F5F5');
			//chart.background.stroke = am4core.color('#D3D3D3');
			//chart.background.strokeWidth = 2;
			//chart.background.cornerRadius = 10;
			if (this.chart) this.chart.dispose();
			this.chart = chart;
		}
		this.chart.animationDuration = 5000; // продолжительность анимации в миллисекундах
		this.chart.animationEasing = am4core.ease.sinOut;

	}

	updateChart(answerValue, questionID)
	{
		if (questionID !== this.currentQuestionId)
		{
			return;
		}

		for (let i = 0; i < this.chart.data.length; i++)
		{
			if (answerValue === this.chart.data[i].answer)
			{
				this.chart.data[i].count++;
				this.chart.invalidateRawData();
				return;
			}
		}
		this.chart.addData({ answer : answerValue, count : 1});
		this.chart.invalidateData();
	}


	//update ResultNode
	renderQuestionResult(questionId)
	{
		BX.showWait("statistics__content", "", "big", { useIcon: true, icon: "spinner" });
		this.loadQuestion(questionId).then(question =>{
			this.question = question;
			this.loadAnswers().then(answers => {
				this.answers = answers;
				document.getElementById('questionResult').replaceWith(this.getQuestionResultNode());
				this.renderChart();
				BX.closeWait();
			});
		});
	}

	getAnswersData(){
		let result = [];
		for (let i = 0; i < this.answers.length; i++)
		{
			result.push({
				'answer' : this.answers[i].ANSWER,
				'count' : this.answers[i].COUNT,
			});
		}
		return result;
	}

	getShareNode(quiz)
	{
		let quizTakeLink = `${location.host}/quiz/${Text.encode(quiz.CODE)}/take`;

		const shareButton = Tag.render`
			<button class="button">
				<i class="fa-solid fa-qrcode"></i>
			</button>
		`;
		const shareModal = Tag.render`
			<div class="modal">
				<div class="modal-background to-close"></div>
				<div class="modal-content box qr-modal">
					<h1 style=" font-size: 40px; text-align: center; margin-bottom: 10px; ">
						${Text.encode(quiz.CODE)}
    				</h1>
					<div class="qr mb-4"></div>
					<div>
						<input type="text" class="input mb-2" value="${Text.encode(quizTakeLink)}" readonly>
						<button class="button is-dark copy">${Loc.getMessage('UP_QUIZ_SHOW_COPY')}</button>
					</div>
				</div>
				<button class="modal-close is-large to-close" aria-label="close"></button>
			</div>
		`;

		shareButton.onclick = () => {
			shareModal.classList.add('is-active');
		};

		let elemsToCloseModal = shareModal.querySelectorAll('.to-close');
		elemsToCloseModal.forEach(elem => {
			elem.onclick = () => {
				shareModal.classList.remove('is-active');
			};
		});

		let copyButton = shareModal.querySelector('.copy');
		let CopyLinkIsSuccess = new BX.UI.Notification.Balloon({
			stack : new BX.UI.Notification.Stack({position: 'bottom-center'}),
			content : Loc.getMessage('UP_QUIZ_SHOW_LINK_COPY_SUCCESS'),
			autoHide: true,
			autoHideDelay: 1000,
			blinkOnUpdate: true,
		});
		copyButton.onclick = () => {
			shareModal.querySelector('.input').select();
			document.execCommand("copy");
			CopyLinkIsSuccess.show();
		};

		new QRCode(shareModal.querySelector(`.qr`), {
			text: quizTakeLink,
			width: 600,
			height: 600,
			colorDark : "#000000",
			colorLight : "#ffffff",
			correctLevel : QRCode.CorrectLevel.H
		});

		return Tag.render`
			${shareButton}
			${shareModal}
		`;
	}
}