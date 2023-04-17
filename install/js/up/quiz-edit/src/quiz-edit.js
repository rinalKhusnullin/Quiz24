import {Type, Tag} from 'main.core';

export class QuizEdit
{
	QUESTION_TYPES = {
		0 : 'Свободный ответ',//0
		1 : 'Выбираемый ответ'//1
	};

	DISPLAY_TYPES = {
		0 : 'Круговая диаграмма',//0
		1 : 'Облако тэгов',//1
		2 : 'Столбчатая диаграмма',//2
		3 : 'Сырой вывод'//3
	};

	constructor(options = {})
	{

		if (Type.isStringFilled(options.rootNodeId))
		{
			this.rootNodeId = options.rootNodeId;
		}
		else
		{
			throw new Error('QuizEdit: options.rootNodeId required');
		}

		this.rootNode = document.getElementById(this.rootNodeId);

		if (!this.rootNode)
		{
			throw new Error(`QuizEdit: element with id "${this.rootNodeId}" not found`);
		}

		this.quizId = options.quizId;
		this.questions = [];
		this.quiz = {};
		this.question = {};
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

	saveQuestion()
	{
		BX.ajax.runAction(
				'up:quiz.question.setQuestion',
				{
					data:{
						question : this.question
					}
				}
			)
			.then((response) => {
				this.render();
				alert('Данные о вопросе успешно сохранены!');
			})
			.catch((error) => {
				console.error(error);
			})
		;
	}

	createQuestion()
	{
		BX.ajax.runAction(
				'up:quiz.question.createQuestion', {
					data: {
						quizId: this.quizId,
					}
				}
			)
			.then((response) => {
				this.currentQuestionId = response.data.newQuestionId; // Тут нужно еще загрузить список вопрос и зарендерить ыы
				this.getQuestion(this.currentQuestionId);
			})
			.catch((error) => {
				console.error(error);
			});
	}

	getQuestion(id)
	{
		this.loadQuestion(id).then(question =>{
			this.question = question;
			this.render();
		})
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
						this.createQuestion();
						this.reload();
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
		this.rootNode.appendChild(this.getQuestionListNode());
		this.rootNode.appendChild(this.getQuestionPreviewNode());
		this.rootNode.appendChild(this.getQuestionSettingsNode());
	}

	renderPreview()
	{
		document.getElementById('preview').replaceWith(this.getQuestionPreviewNode());
	}

	renderSettings()
	{
		document.getElementById('settings').replaceWith(this.getQuestionSettingsNode());
	}

	renderQuestionList()
	{
		document.getElementById('questions').replaceWith(this.getQuestionSettingsNode());
	}

	getQuestionListNode()
	{
		const QuestionsContainer = Tag.render`
			<div class="question-list__questions" id="questions">
			</div>
		`;

		this.questions.forEach(questionData => {
			const questionCard = Tag.render`
				<a class="question-list__question button" data-id="${questionData.ID}">
					${questionData.QUESTION_TEXT}
				</a>
			`;
			questionCard.onclick = () => {
				this.getQuestion(+questionData.ID);
			};
			QuestionsContainer.appendChild(questionCard);
		});

		const AddNewQuestionButton = Tag.render`<a class="button question_list__add-btn">+</a>`;
		AddNewQuestionButton.onclick = () => {
			this.createQuestion();
		}
		QuestionsContainer.appendChild(AddNewQuestionButton);

		return Tag.render`
			<div class="column is-one-fifth question-list">
				<div class="question-list__title">Вопросы</div>
				${QuestionsContainer}
			</div>
		`;
	}

	getQuestionPreviewNode()
	{
		const PreviewContainerNode =  Tag.render`
			<div class="column is-three-fifths question-preview" id="preview">
				<div class="question-preview__title">Превью</div>
				<div class="box">
					<h3 class="title question-preview__question-text" id="questionTextPreview">${this.question.QUESTION_TEXT}</h3>
						<div id="questionPreviewContainer"></div>
					<a class="button is-success">Отправить</a>
				</div>
				<div class="box" id="displayTypePreview">
					<h3 class="title">Результаты опроса:</h3>
					<div id="chartPreviewContainer">
					</div>
				</div>
			</div>
		`;

		let AnswerPreviewContainer = PreviewContainerNode.querySelector('#questionPreviewContainer');
		if ( (this.question.OPTIONS != null) && (this.question.OPTIONS != 'undefinded') && (this.question.OPTIONS != '')){
			let options = JSON.parse(this.question.OPTIONS);
			for (let i = 0; i < options.length; i++)
			{
				const AnswerPreview = Tag.render`
					<label class="radio"><input type="radio">
						${options[i]}
					</label>
				`;
				AnswerPreviewContainer.appendChild(AnswerPreview);
			}
		}
		else
		{
			AnswerPreviewContainer.appendChild(Tag.render`
				<input type="text" class="input" placeholder="Введите ответ" id="freePreview">
			`);
		}

		let DisplayPreviewContainer = PreviewContainerNode.querySelector('#chartPreviewContainer');
		let question_display_id = this.question.QUESTION_DISPLAY_ID;
		let DisplayPreviewNode = Tag.render`
			<div id="tagCloudPreview">
				${this.DISPLAY_TYPES[question_display_id]}
			</div>
		`;

		DisplayPreviewContainer.appendChild(DisplayPreviewNode);

		return PreviewContainerNode;
	}

	getQuestionSettingsNode()
	{
		console.log(this.question);
		const SettingsContainerNode =  Tag.render`
			<div class="column question-settings" id="settings">
				<div class="question-settings__title">Настройки</div>
				
				<div class="question-settings__input-title">Текст вопроса:</div>
				<input value="${this.question.QUESTION_TEXT}" class="input" type="text" placeholder="Введите вопрос" name="questionText" id="questionText">
				
				<div class="question-settings__input-title">Тип ответа:</div>
				<select class="select" name="questionType" id="questionType">
					<option value="0" ${this.question.QUESTION_TYPE_ID == 0 ? 'selected' : ''}>Свободный ответ</option>
					<option value="1" ${this.question.QUESTION_TYPE_ID == 1 ? 'selected' : ''}>Выбор варианта</option>
				</select>
				
				<div class="question-settings__selectable-answers ${this.question.QUESTION_TYPE_ID != 1 ? 'hidden' : ''}" id="selectableAnswers">
					<div class="question-settings__input-title">Вариаты ответа:</div>
					<div class="question-settings__answers-container" id="answersContainer">
					</div>
					<a class="button" id="addAnswerButton">
						<i class="fa-solid fa-plus "></i>
					</a>
				</div>
				
				<div class="question-settings__input-title">Тип отображения результатов:</div>
				<select name="displayType" id="displayType">
					<option value="0" ${this.question.QUESTION_DISPLAY_ID == 0 ? 'selected' : ''}>Круговая диаграмма</option>
					<option value="1" ${this.question.QUESTION_DISPLAY_ID == 1 ? 'selected' : ''}>Облако тэгов</option>
					<option value="2" ${this.question.QUESTION_DISPLAY_ID == 2 ? 'selected' : ''}>Столбчатая диаграмма</option>
					<option value="3" ${this.question.QUESTION_DISPLAY_ID == 3 ? 'selected' : ''}>Текстовый формат</option>
				</select>
				<button type="submit" class="button is-success" id="save-question-button">Сохранить</button>
			</div>
		`;

		if ( (this.question.OPTIONS != null) && (this.question.OPTIONS != 'undefinded') && (this.question.OPTIONS != '')){
			let options = JSON.parse(this.question.OPTIONS);
			for (let i = 0; i < options.length; i++)
			{
				let answerInputsContainer = SettingsContainerNode.querySelector('#answersContainer');
				const AnswerInput = Tag.render`<input type="text" class="question-settings__answer input" name="selectableAnswer" value="${options[i]}">`;
				const AnswerDelete = Tag.render`<a class="button is-danger"><i class="fa-solid fa-trash"></i></a>`;
				AnswerDelete.onclick = () => { this.deleteAnswer(options[i]) };
				const AnswerInputNode = Tag.render`<div class="question-settings__answer-inputs">
					${AnswerInput}
					${AnswerDelete}
				</div>`;

				answerInputsContainer.appendChild(AnswerInputNode);
			}
		}

		SettingsContainerNode.querySelector('#addAnswerButton').onclick = () => {
			let answerInputsContainer = SettingsContainerNode.querySelector('#answersContainer');
			let currentAnswerCount = answerInputsContainer.childElementCount;

			const AnswerInput = Tag.render`
				<input type="text" class="question-settings__answer input" name="selectableAnswer" value="Вариант ${currentAnswerCount+1}">
			`;

			const AnswerDelete = Tag.render`<a class="button is-danger"><i class="fa-solid fa-trash"></i></a>`;

			AnswerDelete.onclick = () => { this.deleteAnswer(options[i]) };

			const newAnswerInput = Tag.render`
				<div class="question-settings__answer-inputs">
					${AnswerInput}
					${AnswerDelete}
				</div>
			`;
			answerInputsContainer.appendChild(newAnswerInput);
			this.changeQuestion();
		}
		SettingsContainerNode.oninput = () => { this.changeQuestion() };

		SettingsContainerNode.querySelector('#save-question-button').onclick = () => {this.saveQuestion()};

		return SettingsContainerNode;
	}

	changeQuestion()
	{
		const questionTextInput = document.getElementById('questionText');
		this.question.QUESTION_TEXT = questionTextInput.value;

		const questionTypeInput = document.getElementById('questionType');
		this.question.QUESTION_TYPE_ID = questionTypeInput.value;

		const selectableAnswers = document.getElementById('selectableAnswers');
		if (this.question.QUESTION_TYPE_ID == 1)
		{
			selectableAnswers.classList.remove("hidden");
			let answerInputs = document.querySelectorAll('.question-settings__answer');
			let answerValues = Array.from(answerInputs, input => input.value);
			this.question.OPTIONS = JSON.stringify(answerValues);
		}
		else
		{
			selectableAnswers.classList.add("hidden");
			this.question.OPTIONS = null;
		}

		const displayTypeInput = document.getElementById('displayType');
		this.question.QUESTION_DISPLAY_ID = displayTypeInput.value;

		this.renderPreview();
	}

	deleteAnswer(AnswerValue)
	{
		alert('TODO : Удаление варианта ответа');
	}
}