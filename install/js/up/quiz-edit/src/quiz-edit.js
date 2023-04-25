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
		console.log(this.question);
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
				}
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
				<div class="question-list__question-container"></div>
			`;
			const questionButton = Tag.render`
				<div class="question-list__question button" data-id="${Text.encode(questionData.ID)}">
					${Text.encode(questionData.QUESTION_TEXT)}
				</div>
			`;
			const questionDeleteButton = Tag.render`
				<a class="question-list__question-delete button">
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
			questionCard.appendChild(questionButton);
			questionCard.appendChild(questionDeleteButton);
			QuestionsContainer.appendChild(questionCard);
		});

		const AddNewQuestionButton = Tag.render`<a class="button question_list__add-btn">+</a>`;
		AddNewQuestionButton.onclick = () => {
			this.createQuestion();
		}
		QuestionsContainer.appendChild(AddNewQuestionButton);

		return Tag.render`
			<div class="column is-one-fifth question-list">
				<div class="question-list__title">${Loc.getMessage('UP_QUIZ_EDIT_QUESTIONS')}</div>
				${QuestionsContainer}
			</div>
		`;
	}

	getQuestionPreviewNode()
	{
		const PreviewContainerNode =  Tag.render`
			<div class="column is-three-fifths question-preview" id="preview">
				<div class="question-preview__title">${Loc.getMessage('UP_QUIZ_EDIT_PREVIEW')}</div>
				<div class="box">
					<h3 class="title question-preview__question-text" id="questionTextPreview">${Text.encode(this.question.QUESTION_TEXT)}</h3>
						<div id="questionPreviewContainer"></div>
					<a class="button is-success">${Loc.getMessage('UP_QUIZ_EDIT_SEND')}</a>
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
					<label class="radio"><input type="radio">
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
		console.log(this.question);
		const SettingsContainerNode =  Tag.render`
			<div class="column question-settings" id="settings">
				<div class="question-settings__title">${Loc.getMessage('UP_QUIZ_EDIT_SETTINGS')}</div>
				
				<div class="question-settings__input-title">${Loc.getMessage('UP_QUIZ_EDIT_QUESTION_TEXT')}:</div>
				<input value="${Text.encode(this.question.QUESTION_TEXT)}" class="input" type="text" placeholder="${Loc.getMessage('UP_QUIZ_EDIT_ENTER_QUESTION')}" name="questionText" id="questionText">
				
				<div class="question-settings__input-title">${Loc.getMessage('UP_QUIZ_EDIT_ANSWER_TYPE')}:</div>
				<select class="select" name="questionType" id="questionType">
					<option value="0" ${+this.question.QUESTION_TYPE_ID === 0 ? 'selected' : ''}>${Loc.getMessage('UP_QUIZ_EDIT_OPEN_ANSWER')}</option>
					<option value="1" ${+this.question.QUESTION_TYPE_ID === 1 ? 'selected' : ''}>${Loc.getMessage('UP_QUIZ_EDIT_SELECT_OPTION')}</option>
				</select>
				
				<div class="question-settings__selectable-answers ${+this.question.QUESTION_TYPE_ID !== 1 ? 'hidden' : ''}" id="selectableAnswers">
					<div class="question-settings__input-title">${Loc.getMessage('UP_QUIZ_EDIT_ANSWER_OPTIONS')}:</div>
					<div class="question-settings__answers-container" id="answersContainer">
					</div>
					<a class="button" id="addAnswerButton">
						<i class="fa-solid fa-plus "></i>
					</a>
				</div>
				
				<div class="question-settings__input-title">${Loc.getMessage('UP_QUIZ_EDIT_TYPE_OF_VIEW_TYPE')}:</div>
				<select name="displayType" id="displayType">
					<option value="0" ${this.question.QUESTION_DISPLAY_ID == 0 ? 'selected' : ''}>${Text.encode(this.DISPLAY_TYPES[0])}</option>
					<option value="1" ${this.question.QUESTION_DISPLAY_ID == 1 ? 'selected' : ''}>${Text.encode(this.DISPLAY_TYPES[1])}</option>
					<option value="2" ${this.question.QUESTION_DISPLAY_ID == 2 ? 'selected' : ''}>${Text.encode(this.DISPLAY_TYPES[2])}</option>
					<option value="3" ${this.question.QUESTION_DISPLAY_ID == 3 ? 'selected' : ''}>${Text.encode(this.DISPLAY_TYPES[3])}</option>
				</select>
				<button type="submit" class="button is-success" id="save-question-button">${Loc.getMessage('UP_QUIZ_EDIT_SAVE')}</button>
			</div>
		`;


		if ( (this.question.OPTIONS != null) && (this.question.OPTIONS != 'undefinded') && (this.question.OPTIONS != '')){
			let options = JSON.parse(this.question.OPTIONS);
			for (let i = 0; i < options.length; i++)
			{
				let answerInputsContainer = SettingsContainerNode.querySelector('#answersContainer');
				const AnswerInput = Tag.render`<input type="text" class="question-settings__answer input" name="selectableAnswer" value="${Text.encode(options[i])}">`;
				const AnswerDelete = Tag.render`<a class="button is-danger"><i class="fa-solid fa-trash"></i></a>`;
				AnswerDelete.onclick = () => { this.deleteAnswer(i) };
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
				<input type="text" class="question-settings__answer input" name="selectableAnswer" value="${Loc.getMessage('UP_QUIZ_EDIT_OPTION')} ${currentAnswerCount+1}">
			`;

			const AnswerDelete = Tag.render`<a class="button is-danger"><i class="fa-solid fa-trash"></i></a>`;
			let options = JSON.parse(this.question.OPTIONS);
			AnswerDelete.onclick = () => { this.deleteAnswer(options.length) };

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
		if (+this.question.QUESTION_TYPE_ID === 1)
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

	deleteAnswer(AnswerPosition)
	{
		let options = JSON.parse(this.question.OPTIONS);
		options.splice(AnswerPosition, 1);
		this.question.OPTIONS = JSON.stringify(options);
		this.renderSettings();
		this.renderPreview();
	}
}