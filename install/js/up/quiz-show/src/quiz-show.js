import {Type, Tag, } from 'main.core';
window.am4core.useTheme(am4themes_animated);
window.am4core.useTheme(am4themes_material);
// import Chart from 'chart.js/auto';

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
						alert("todo вопросов нет");
						//this.reload();
					}
					else
					{
						this.currentQuestionId = this.questions[0].ID;
						this.loadQuestion(this.currentQuestionId).then(question =>{
							this.question = question;
							this.loadAnswers().then(answers =>{
								this.answers = answers;
								this.render();
							});
						});
					}

				});
			});
	}


	render()
	{
		this.rootNode.innerHTML = ``;

		const QuizHeroSection = Tag.render`
			<section class="hero is-small is-primary">
				<div class="hero-body">
					<p class="title mb-0">
						${this.quiz.TITLE}#${this.quiz.CODE}
					</p>
					<button class="button">
						<i class="fa-solid fa-qrcode"></i>
					</button>
					<div class="modal">
						<div class="modal-background"></div>
					    <div class="modal-content">
							<p class="image is-4by3">
							  <img src="https://bulma.io/images/placeholders/1280x960.png" alt="">
							</p>
					    </div>
						<button class="modal-close is-large" aria-label="close"></button>
					</div>
				</div>
			</section>
		`;
		this.rootNode.appendChild(QuizHeroSection);

		const QuizResultContent = Tag.render`
			<div class="box">
				<div class="columns">
					<div class="column is-one-quarter question-list">
						<div class="question-list__title has-text-weight-semibold has-text-centered is-uppercase">Вопрос</div>
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
			const QuestionNode = Tag.render`<a class="question-list__question button">${question.QUESTION_TEXT}</a>`;
			QuestionNode.onclick = () => {
				this.renderQuestionResult(+question.ID);
			}
			QuestionListNode.appendChild(QuestionNode);
		})
		return QuestionListNode;
	}

	getQuestionResultNode()
	{
		let updateButton = Tag.render`<button id="updateButton"><i class="fa-solid fa-rotate-right"></i></button>`;

		updateButton.onclick = () => {
			this.updateChart();
		};

		return Tag.render`
			<div class=" column is-three-quarters statistics" id="questionResult">
				<div class="statistics__title has-text-weight-semibold has-text-centered is-uppercase">Статистика</div>
				<div class="statistics__question-title">
					<strong>Вопрос : </strong>
					${this.question.QUESTION_TEXT}
					${updateButton}
				</div>
				<div>
					<div id="chart" style="width: 900px; height: 800px;"></div>
				</div>
			</div>
		`;
	}

	renderChart()
	{
		// Create chart instance
		let chartType = (this.DISPLAY_TYPES[this.question.QUESTION_DISPLAY_ID]) ?? 'PieChart'; //PieChart - Default chart series

		let data = this.getAnswersData();

		let chart;
		let series;


		if (chartType === 'PieChart')
		{
			chart = am4core.create('chart', 'PieChart')

			series = chart.series.push(new am4charts.PieSeries());

			series.dataFields.value = "count";
			series.dataFields.category = "answer";
			chart.data = data;
		}
		else if (chartType === 'WordCloud')
		{
			chart = am4core.create('chart', am4plugins_wordCloud.WordCloud);

			series = chart.series.push(new am4plugins_wordCloud.WordCloudSeries());
			//series.text = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim ex neque repellendus tempore? Architecto atque beatae, eius excepturi, incidunt laudantium maiores neque nesciunt nisi reiciendis reprehenderit vel. At, possimus voluptatum.';
			series.data = data;
			series.dataFields.word = "answer";
			series.dataFields.value = "count";

			series.colors = new am4core.ColorSet();
			series.colors.passOptions = {};

		}
		else if (chartType === 'BarChart' || 1)
		{
			chart = am4core.create('chart', am4charts.XYChart);

			let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
			categoryAxis.dataFields.category = "answer";
			let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

			series = chart.series.push(new am4charts.ColumnSeries());

			series.columns.template.tooltipText = "Вариант ответа: {categoryX}\nКоличество ответов: {valueY}";
			series.dataFields.valueY = "count";
			series.dataFields.categoryX = "answer";

			chart.data = data;
		}

		series.interpolationDuration = 1500;
		series.defaultState.transitionDuration = 1500;

		chart.animated = true;

		chart.legend = new am4charts.Legend();
		this.chart = chart;
	}

	updateChart()
	{
		this.loadAnswers().then(answers => {
			this.answers = answers;
			this.chart.data = this.getAnswersData();
		})
	}


	//update ResultNode
	renderQuestionResult(questionId)
	{
		this.loadQuestion(questionId).then(question =>{
			this.question = question;
			this.loadAnswers().then(answers => {
				this.answers = answers;
				document.getElementById('questionResult').replaceWith(this.getQuestionResultNode());
				this.renderChart();
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
}