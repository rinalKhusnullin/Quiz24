import {Type, Tag, } from 'main.core';
window.am4core.useTheme(am4themes_animated);
// import Chart from 'chart.js/auto';

export class QuizShow
{
	DISPLAY_TYPES = {
		0 : 'PieChart3D',
		1 : 'WordCloud',
		2 : 'BarChart',
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
		this.currentQuestionId = 1; // Текущий id вопроса
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
		return Tag.render`
			<div class=" column is-three-quarters statistics" id="questionResult">
				<div class="statistics__title has-text-weight-semibold has-text-centered is-uppercase">Статистика</div>
				<div class="statistics__question-title">
					<strong>Вопрос : </strong>
					${this.question.QUESTION_TEXT}
					<button id="updateButton"><i class="fa-solid fa-rotate-right"></i></button>
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
		let chartType = (this.DISPLAY_TYPES[this.question.QUESTION_DISPLAY_ID]) ?? 'PieChart';

		let data = this.getAnswersData();


		if (chartType === 'PieChart3D')
		{
			let chart = am4core.create('chart', 'PieChart')
			let series = chart.series.push(new am4charts.PieSeries3D());
			series.dataFields.value = "count";
			series.dataFields.category = "answer";
			chart.data = data;
		}

		// здесь ошибка, чтобы ее увидеть надо убрать if
		let chart = am4core.create('chart', am4plugins_wordCloud.WordCloud)
		let series = chart.series.push(new am4plugins_wordCloud.WordCloudSeries());
		series.text = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta nihil quae quas voluptas. Amet beatae consequatur corporis delectus doloribus illo numquam optio porro provident quos reiciendis sit unde veniam, voluptate?';




	// And, for a good measure, let's add a legend
		chart.legend = new am4charts.Legend();


		// const chartNode = document.getElementById('chart');
		//
		// let answersData = this.getAnswersData();
		//
		// this.chart = new Chart(chartNode, {
		// 	type: this.DISPLAY_TYPES[this.question.QUESTION_DISPLAY_ID] ?? 'bar',
		// 	data: {
		// 		labels: answersData.labels,
		// 		datasets: [{
		// 			label: this.question.QUESTION_TEXT,
		// 			data: answersData.counts,
		// 			borderWidth: 1,
		// 		}]
		// 	},
		// 	options: {
		// 		scales: {
		// 			y: {
		// 				beginAtZero: true
		// 			}
		// 		}
		// 	}
		// });
		//
		// document.getElementById('updateButton').onclick = () => {
		// 	this.updateChart(this.chart);
		// };
	}

	updateChart()
	{
		this.loadAnswers().then(answers => {
			this.answers = answers;
			let answersData = this.getAnswersData();
			this.chart.data.labels = answersData.labels;
			this.chart.data.datasets[0].data = answersData.counts;
			this.chart.update();
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

		console.log(result);
		return result;
	}
}