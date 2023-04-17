import {Type, Tag} from 'main.core';
import Chart from 'chart.js/auto';

export class QuizShow
{
	quiz; // Текущий quiz
	question; // Текущий question
	chart; // Диаграмма

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
							this.render();
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
		this.connectChart();
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
		const testButton = Tag.render`<button id="testButton">ТЕСТОВАЯ КНОПКА ПОКА ЧТО!</button>>`;
		QuestionListNode.appendChild(testButton);
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
				</div>
				<div>
					<canvas id="chart"></canvas>
				</div>
			</div>
		`;
	}

	connectChart()
	{
		const chartNode = document.getElementById('chart');

		let chart = new Chart(chartNode, {
			type: 'bar',
			data: {
				labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
				datasets: [{
					label: this.question.QUESTION_TEXT,
					data: [12, 19, 3, 5, 2, 3],
					borderWidth: 1
				}]
			},
			options: {
				scales: {
					y: {
						beginAtZero: true
					}
				}
			}
		});
		document.getElementById('testButton').onclick = () => {
			this.testFunc(chart);
		};
	}

	//update ResultNode
	renderQuestionResult(questionId)
	{
		this.loadQuestion(questionId).then(question =>{
			this.question = question;
			document.getElementById('questionResult').replaceWith(this.getQuestionResultNode());
			this.connectChart();
		});
	}

	testFunc(chart)
	{
		chart.data.datasets[0].data[0]++;
		chart.update();
	}
}