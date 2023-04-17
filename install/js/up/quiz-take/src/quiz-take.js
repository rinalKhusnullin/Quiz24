import {Type, Tag} from 'main.core';

export class QuizTake
{
	constructor(options = {})
	{

		//VALIDATE QUIZ_ID !
		this.quizId = options.quizId;

		if (Type.isStringFilled(options.rootNodeId))
		{
			this.rootNodeId = options.rootNodeId;
		}
		else
		{
			throw new Error('QuizTake: options.rootNodeId required');
		}

		this.rootNode = document.getElementById(this.rootNodeId);
		if (!this.rootNode)
		{
			throw new Error(`QuizTake: element with id "${this.rootNodeId}" not found`);
		}

		this.questions = []; // Все вопросы : title, id
		this.reload();
	}

	reload()
	{
		this.loadQuiz().then(quiz => {
			console.log(quiz);
			if (quiz == null)
			{
				alert ('TODO : ЕСЛИ QUIZ НЕ НАЙДЕН');
			}
			else if (+quiz.IS_ACTIVE === 0)
			{
				alert('TODO : ЕСЛИ QUIZ ЗАКРЫТ ДЛЯ ПРОХОЖДЕНИЯ');
			}
			else {
				this.quiz = quiz;
				this.loadQuestions().then(questions =>{
					if (questions.length === 0)
					{
						alert('TODO: ЕСЛИ ВОПРОСОВ НЕТ');
					}
					else
					{
						this.questions = questions;
						this.currentQuestionId = questions[0].ID;
						this.loadQuestion(this.currentQuestionId).then(question =>{
							this.question = question;
							this.render()
						});
					}
				});
			}

		});
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

	render()
	{
		this.rootNode.innerHTML = ``;

		const QuizHeroSection = Tag.render`
			<section class="hero is-small is-primary">
				<div class="hero-body">
					<p class="title mb-0">
						${this.quiz.TITLE}#${this.quiz.CODE}
					</p>
				</div>
			</section>
		`;
		this.rootNode.appendChild(QuizHeroSection);

		let QuestionForm = this.getQuestionForm();
		this.rootNode.appendChild(QuestionForm);
	}

	getQuestionForm()
	{
		const QuestionFormNode = Tag.render`
			<div class="question-form__container box" id="question-form">
				<h1 class="subtitle is-4">${this.question.QUESTION_TEXT}</h1>
			</div>`;

		if (+this.question.QUESTION_TYPE_ID === 0)
		{
			const QuestionTypeInput = Tag.render`<input type="text" class="input question-form__input" placeholder="Тут типо свободный ответ">`;
			QuestionFormNode.appendChild(QuestionTypeInput);
		}
		else if (+this.question.QUESTION_TYPE_ID === 1)
		{
			const AnswerContainer = Tag.render`<div class="control"></div>`;
			if ( (this.question.OPTIONS != null) && (this.question.OPTIONS !== 'undefined') && (this.question.OPTIONS !== '')){
				let options = JSON.parse(this.question.OPTIONS);
				for (let i = 0; i < options.length; i++)
				{
					const Answer = Tag.render`
					<label class="radio">
						<input type="radio" name="questionAnswer">
						${options[i]}
					</label>
				`;
					AnswerContainer.appendChild(Answer);
				}
			}
			QuestionFormNode.appendChild(Tag.render`<div class="field">${AnswerContainer}</div>`);
		}

		const SendButton = Tag.render`<button class="button question-form__button">Отправить</button>`;

		SendButton.onclick = () => {
			this.sendAnswer(this.question.ID);
		};

		QuestionFormNode.appendChild(SendButton);
		return QuestionFormNode;
	}

	sendAnswer(questionId)
	{
		this.questions.shift();

		// TODO : Отправить answer в БД

		if (+this.questions.length === 0)
		{
			this.renderCompletely();
		}
		else
		{
			this.currentQuestionId = this.questions[0].ID;
			this.loadQuestion(this.currentQuestionId).then(question => {
				this.question = question;
				this.renderQuestion();
			})
		}
	}

	renderQuestion(){
		document.getElementById('question-form').replaceWith(this.getQuestionForm());
	}

	renderCompletely(){
		this.rootNode.innerHTML = ``;
		this.rootNode.textContent = "Вы ответили на все вопросы!";
	}
}