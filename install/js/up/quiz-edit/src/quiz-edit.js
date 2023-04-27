import {Type, Tag, Loc, Text} from 'main.core';
//${Text.encode(taskData.NAME)}
export class QuizEdit
{
	DISPLAY_TYPES = {
		0 : Loc.getMessage('UP_QUIZ_EDIT_PIE_CHART'),
		1 : Loc.getMessage('UP_QUIZ_EDIT_TAG_CLOUD'),
		2 : Loc.getMessage('UP_QUIZ_EDIT_BAR_CHART'),
		3 : Loc.getMessage('UP_QUIZ_EDIT_RAW_OUT'),
	};

	notify = new BX.UI.Notification.Balloon({
		stack : new BX.UI.Notification.Stack({position: 'top-center'}),
		content: 'привет',
		autoHide: true,
		autoHideDelay: 1000,
	});

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

		this.loadQuiz().then(quiz => { // Очевидно это костыль!
			this.quiz = quiz;
			this.rootNode.parentNode.insertBefore(this.getQuizTitleNode(), this.rootNode); // Добавление редактирования опроса
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
		return new Promise((resolve, reject) => {
			BX.ajax.runAction(
					'up:quiz.question.setQuestion',
					{
						data:{
							question : this.question
						}
					}
				)
				.then((response) => {
					const curr = this.questions.find(item => item.ID == this.currentQuestionId);
					if (curr) {
						curr.QUESTION_TEXT = this.question.QUESTION_TEXT;
					}
					this.render();
					resolve(true);
				})
				.catch((error) => {
					console.error(error);
					reject(error);
				})
			;
		});
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
				this.currentQuestionId = response.data.newQuestion.ID;
				this.questions.push(response.data.newQuestion);
				this.getQuestion(this.currentQuestionId);
				this.render();
			})
			.catch((error) => {
				console.error(error);
			});
	}

	deleteQuestion(id)
	{
		BX.ajax.runAction(
				'up:quiz.question.deleteQuestion', {
					data: {
						id: id,
						quizId: this.quizId
					}
				}
			)
			.then((response) => {
				if (response.data != null)
				{
					console.error('errors:', response.data);
				}
				else
				{
					this.reload();
					this.notify.content = Loc.getMessage('UP_QUIZ_EDIT_DELETE_QUESTION_NOTIFY');
					this.notify.show();
				}
			})
			.catch((error) => {
				console.error(error);
			});
	}

	updateQuizTitle(title)
	{
		return new Promise((resolve, reject) => {
			BX.ajax.runAction(
				'up:quiz.quiz.updateTitle', {
					data: {
						quizId : this.quiz.ID,
						title: title,
					}
				})
				.then((response) => {
					resolve(response);
				})
				.catch((error) => {
					reject(error);
				})
			}
		);
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
		document.getElementById('questions').replaceWith(this.getQuestionListNode());
	}

	getQuizTitleNode()
	{
		let quizTitleInput = Tag.render`<input type="text" class="input" value="${Text.encode(this.quiz.TITLE)}">`;
		let quizTitleSaveButton = Tag.render`<button class="button is-success">${Loc.getMessage('UP_QUIZ_EDIT_SAVE')}</button>`;
		let quizTitleHelper = Tag.render`<p class="help is-danger"></p>`;

		quizTitleSaveButton.onclick = () => {
			quizTitleSaveButton.classList.add('is-loading');
			this.updateQuizTitle(quizTitleInput.value).then(success => {
				quizTitleHelper.textContent = '';
				quizTitleSaveButton.classList.remove('is-loading');
				this.notify.content = Loc.getMessage('UP_QUIZ_EDIT_SAVE_QUIZ_TITLE_NOTIFY');
				this.notify.show();
			}, error => {
				this.notify.content = 'Исправьте все представленные ошибки и попробуйте заново';
				this.notify.show();
				if (error.errors[0].code === 'invalid_quiz_title')
				{
					quizTitleHelper.textContent = error.errors[0].message;
				}
				quizTitleSaveButton.classList.remove('is-loading');
			});
		}

		quizTitleInput.oninput = () => {
			quizTitleHelper.textContent = '';
		}

		const quizTitleNode = Tag.render`
			<div class="box quiz-title-setting">
				<div>
					<p class="title mb-2 is-5">
						${Loc.getMessage('UP_QUIZ_EDIT_QUIZ_TITLE')}:
					</p>
					<div class="hero__quiz-settings">
						${quizTitleInput}
						${quizTitleSaveButton}
					</div>
					${quizTitleHelper}
				</div>
			</div>`;

		return quizTitleNode;
	}

	getQuestionListNode()
	{
		const QuestionsContainer = Tag.render`
			<div class="question-list__questions" id="questions">
			</div>
		`;

		this.questions.forEach(questionData => {
			let shortQuestionTitle = this.truncateText(questionData.QUESTION_TEXT, 17);

			const questionButton = Tag.render`
				<div class="button question-button" data-id="${Text.encode(questionData.ID)}">
					${Text.encode(shortQuestionTitle)}
					${(questionData.QUESTION_TEXT.length > 17) ? `<div class="quiz-card__title-show-more">${Text.encode(questionData.QUESTION_TEXT)}</div>` : ''}
				</div>
			`;
			const questionDeleteButton = Tag.render`
				<a class="button delete-button">
					<i class="fa-solid fa-trash"></i>
				</a>
			`;
			questionButton.onclick = () => {
				this.getQuestion(+questionData.ID);
				this.currentQuestionId = +questionData.ID;
			};
			questionDeleteButton.onclick = () => {
				this.deleteQuestion(+questionData.ID);
			};

			const questionCard = Tag.render`
				<div class="field has-addons question-container">
					<p class="control question-button">
						${questionButton}
				  	</p>
					<p class="control">
						${questionDeleteButton}
				  	</p>
				</div>
			`;

			if (questionData.ID === this.question.ID)
			{
				questionCard.classList.add('is-active-question-button');
			}

			QuestionsContainer.appendChild(questionCard);
		});

		const AddNewQuestionButton = Tag.render`<a class="button question_list__add-btn">+</a>`;
		AddNewQuestionButton.onclick = () => {
			this.createQuestion();
		}
		QuestionsContainer.appendChild(AddNewQuestionButton);

		return Tag.render`
			<div class="column is-one-quarter question-list">
				<div class="question-list__title has-text-weight-semibold has-text-centered is-uppercase">${Loc.getMessage('UP_QUIZ_EDIT_QUESTIONS')}</div>
				${QuestionsContainer}
			</div>
		`;
	}

	getQuestionPreviewNode()
	{
		const PreviewContainerNode =  Tag.render`
			<div class="column is-three-fifths is-two-fifths question-preview" id="preview">
				<div class="question-preview__title has-text-weight-semibold has-text-centered is-uppercase">${Loc.getMessage('UP_QUIZ_EDIT_PREVIEW')}</div>
				<div class="box">
					<div class="question-preview__question-text mb-2" id="questionTextPreview">${Text.encode(this.question.QUESTION_TEXT)}</div>
						<div id="questionPreviewContainer" class="mb-2"></div>
					<a class="button is-success send-preview-button">${Loc.getMessage('UP_QUIZ_EDIT_SEND')}</a>
				</div>
				<div class="box" id="displayTypePreview">
					<h3 class="title">${Loc.getMessage('UP_QUIZ_EDIT_QUIZ_RESULT')}:</h3>
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
					<label class="radio"><input type="radio" name="previewRadio">
						${Text.encode(options[i])}
					</label>
				`;
				AnswerPreviewContainer.appendChild(AnswerPreview);
			}
		}
		else
		{
			AnswerPreviewContainer.appendChild(Tag.render`
				<input type="text" class="input" placeholder="${Loc.getMessage('UP_QUIZ_EDIT_ENTER_ANSWER')}" id="freePreview">
			`);
		}

		let DisplayPreviewContainer = PreviewContainerNode.querySelector('#chartPreviewContainer');
		let question_display_id = this.question.QUESTION_DISPLAY_ID;
		let DisplayPreviewNode = Tag.render`
			<div id="">
				${Text.encode(this.DISPLAY_TYPES[question_display_id])}
			</div>
		`;

		DisplayPreviewContainer.appendChild(DisplayPreviewNode);

		return PreviewContainerNode;
	}

	getQuestionSettingsNode()
	{
		const SettingsContainerNode =  Tag.render`
			<div class="column question-settings" id="settings">
				<div class="question-settings__title has-text-weight-semibold has-text-centered is-uppercase">${Loc.getMessage('UP_QUIZ_EDIT_SETTINGS')}</div>
				
				<div class="question-settings__input-title">${Loc.getMessage('UP_QUIZ_EDIT_QUESTION_TEXT')}:</div>
				<input value="${Text.encode(this.question.QUESTION_TEXT)}" class="input" type="text" placeholder="${Loc.getMessage('UP_QUIZ_EDIT_ENTER_QUESTION')}" name="questionText" id="questionText">
				<p class="help is-danger mb-3" id="question-text-helper"></p>
				
				<div class="question-settings__input-title">${Loc.getMessage('UP_QUIZ_EDIT_ANSWER_TYPE')}:</div>
				<select class="select" name="questionType" id="questionType">
					<option value="0" ${+this.question.QUESTION_TYPE_ID === 0 ? 'selected' : ''}>${Loc.getMessage('UP_QUIZ_EDIT_OPEN_ANSWER')}</option>
					<option value="1" ${+this.question.QUESTION_TYPE_ID === 1 ? 'selected' : ''}>${Loc.getMessage('UP_QUIZ_EDIT_SELECT_OPTION')}</option>
				</select>
				<p class="help is-danger mb-3" id="question-type-helper"></p>
				
				<div class="question-settings__selectable-answers mb-3 ${+this.question.QUESTION_TYPE_ID !== 1 ? 'hidden' : ''}" id="selectableAnswers">
					<div class="question-settings__input-title">${Loc.getMessage('UP_QUIZ_EDIT_ANSWER_OPTIONS')}:</div>
					<p class="help is-danger" id="question-options-helper"></p>
					<div class="question-settings__answers-container" id="answersContainer">
					</div>
					<a class="button" id="addAnswerButton">
						<i class="fa-solid fa-plus "></i>
					</a>
				</div>
				
				
				<div class="question-settings__input-title">${Loc.getMessage('UP_QUIZ_EDIT_TYPE_OF_VIEW_TYPE')}:</div>
				<select name="displayType" id="displayType" class="select">
					<option value="0" ${this.question.QUESTION_DISPLAY_ID == 0 ? 'selected' : ''}>${Text.encode(this.DISPLAY_TYPES[0])}</option>
					<option value="1" ${this.question.QUESTION_DISPLAY_ID == 1 ? 'selected' : ''}>${Text.encode(this.DISPLAY_TYPES[1])}</option>
					<option value="2" ${this.question.QUESTION_DISPLAY_ID == 2 ? 'selected' : ''}>${Text.encode(this.DISPLAY_TYPES[2])}</option>
					<option value="3" ${this.question.QUESTION_DISPLAY_ID == 3 ? 'selected' : ''}>${Text.encode(this.DISPLAY_TYPES[3])}</option>
				</select>
				<p class="help is-danger mb-3" id="question-display-type-helper"></p>
				<button type="submit" class="button is-success" id="save-question-button">${Loc.getMessage('UP_QUIZ_EDIT_SAVE')}</button>
			</div>
		`;


		if ( (this.question.OPTIONS != null) && (this.question.OPTIONS != 'undefinded') && (this.question.OPTIONS != '')){
			let options = JSON.parse(this.question.OPTIONS);
			for (let i = 0; i < options.length; i++)
			{
				let answerInputsContainer = SettingsContainerNode.querySelector('#answersContainer');
				const AnswerInput = Tag.render`<input type="text" class="question-settings__answer input" name="selectableAnswer" value="${Text.encode(options[i])}">`;
				const AnswerDelete = Tag.render`<a class="button delete-button"><i class="fa-solid fa-trash"></i></a>`;
				AnswerDelete.onclick = () => { this.deleteAnswer(i) };
				const AnswerInputNode = Tag.render`
					<div class="question-settings__answer-inputs field has-addons">
  						<div class="control answer-input">
    						${AnswerInput}
  						</div>
  						<div class="control">
    						${AnswerDelete}
  						</div>
					</div>`;

				answerInputsContainer.appendChild(AnswerInputNode);
			}
		}

		SettingsContainerNode.querySelector('#addAnswerButton').onclick = () => {
			let answerInputsContainer = SettingsContainerNode.querySelector('#answersContainer');
			let currentAnswerCount = answerInputsContainer.childElementCount;

			const AnswerInput = Tag.render`
				<input type="text" class="question-settings__answer input" name="selectableAnswer" value="${Loc.getMessage('UP_QUIZ_EDIT_OPTION')} ${currentAnswerCount+1}">
			`;

			const AnswerDelete = Tag.render`<a class="button delete-button"><i class="fa-solid fa-trash"></i></a>`;
			let options = JSON.parse(this.question.OPTIONS);
			AnswerDelete.onclick = () => { this.deleteAnswer(options.length) };

			const newAnswerInput = Tag.render`
				<div class="question-settings__answer-inputs field has-addons">
					<div class="control answer-input">
						${AnswerInput}
					</div>
					<div class="control">
						${AnswerDelete}
					</div>
				</div>
			`;
			answerInputsContainer.appendChild(newAnswerInput);
			this.changeQuestion();
		}
		SettingsContainerNode.oninput = () => { this.changeQuestion() };

		SettingsContainerNode.querySelector('#save-question-button').onclick = () => {
			SettingsContainerNode.querySelector('#save-question-button').classList.add('is-loading');
			this.resetHelpers();
			this.saveQuestion().then(() => {
				this.notify.content = 'Данные о вопросе успешно сохранены';
				this.notify.show();
				SettingsContainerNode.querySelector('#save-question-button').classList.remove('is-loading');
			}, reject => {
				reject.errors.forEach(error => {
					let errorCode = error.code;
					let errorMessage = error.message;

					if (errorCode === 'invalid_text')
					{
						SettingsContainerNode.querySelector('#question-text-helper').textContent = errorMessage;
					}
					if (errorCode === 'invalid_question_type_id') {
						SettingsContainerNode.querySelector('#question-type-helper').textContent = errorMessage;
					}
					if (errorCode === 'invalid_display_type_id') {
						SettingsContainerNode.querySelector('#question-display-type-helper').textContent = errorMessage;
					}
					if (errorCode === 'invalid_options') {
						SettingsContainerNode.querySelector('#question-options-helper').textContent = errorMessage;
					}
				})
				SettingsContainerNode.querySelector('#save-question-button').classList.remove('is-loading');
			});
		};

		return SettingsContainerNode;
	}

	resetHelpers()
	{
		if (document.querySelector('#question-text-helper'))
			document.querySelector('#question-text-helper').textContent = '';

		if (document.querySelector('#question-type-helper'))
			document.querySelector('#question-text-helper').textContent = '';

		if (document.querySelector('#question-display-type-helper'))
			document.querySelector('#question-text-helper').textContent = '';

		if (document.querySelector('#question-options-helper'))
			document.querySelector('#question-text-helper').textContent = '';
	}

	changeQuestion()
	{
		const questionTextInput = document.getElementById('questionText');
		this.question.QUESTION_TEXT = questionTextInput.value;

		const questionTypeInput = document.getElementById('questionType');
		this.question.QUESTION_TYPE_ID = questionTypeInput.value;

		const selectableAnswers = document.getElementById('selectableAnswers');
		if (+this.question.QUESTION_TYPE_ID === 1)
		{
			selectableAnswers.classList.remove("hidden");
			let answerInputs = document.querySelectorAll('.question-settings__answer');
			let answerValues = Array.from(answerInputs, input => input.value);
			if (answerValues.length === 0)
			{
				this.question.OPTIONS = null;
			}
			else
			{
				this.question.OPTIONS = JSON.stringify(answerValues);
			}
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

	deleteAnswer(AnswerPosition)
	{
		let options = JSON.parse(this.question.OPTIONS);
		options.splice(AnswerPosition, 1);

		if (options.length === 0)
		{
			console.log('yes');
			this.question.OPTIONS = null;
		}
		else
		{
			this.question.OPTIONS = JSON.stringify(options);
		}

		this.renderSettings();
		this.renderPreview();
	}

	truncateText(text, length)
	{
		if (text.length < length)
		{
			return text;
		}
		return text.slice(0, length - 3) + '...';
	}
}