import {Type, Tag} from 'main.core';

export class QuizEdit
{
	QUESTION_TYPES = {
		free : 'Свободный ответ',
		selectable : 'Выбираемый ответ'
	};

	DISPLAY_TYPES = {
		pieChart : 'Круговая диаграмма',
		barChart : 'Столбчатая диаграмма',
		tagCloud : 'Облако тэгов',
		rawOutput : 'Сырой вывод'
	};

	constructor(options = {})
	{
		if (Type.isStringFilled(options.questionsNodeId))
		{
			this.questionsNodeId = options.questionsNodeId;
		}
		else
		{
			throw new Error('QuizEdit: options.questionsNodeId required');
		}

		if (Type.isStringFilled(options.previewNodeId))
		{
			this.previewNodeId = options.previewNodeId;
		}
		else
		{
			throw new Error('QuizEdit: options.previewNodeId required');
		}

		if (Type.isStringFilled(options.settingsNodeId))
		{
			this.settingsNodeId = options.settingsNodeId;
		}
		else
		{
			throw new Error('QuizEdit: options.settingsNodeId required');
		}

		this.questionsNode = document.getElementById(this.questionsNodeId);
		this.previewNode = document.getElementById(this.previewNodeId);
		this.settingsNode = document.getElementById(this.settingsNodeId);

		if (!this.questionsNode)
		{
			throw new Error(`QuizList: element with id "${this.questionsNodeId}" not found`);
		}
		if (!this.previewNode)
		{
			throw new Error(`QuizList: element with id "${this.previewNodeId}" not found`);
		}
		if (!this.settingsNode)
		{
			throw new Error(`QuizList: element with id "${this.settingsNodeId}" not found`);
		}

		this.reload();
	}

	reload()
	{
		this.loadQuestion()
			.then(question => {
				this.question = question;
				this.render();
			});
	}

	loadQuestions()
	{
		return new Promise((resolve, reject) => {
			BX.ajax.runAction(
					'up:quiz.quiz.getQuestions',
					{
						data:{
							quizId:1,
						}
					}
				)
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

	loadQuestion()
	{
		return new Promise((resolve, reject) => {
			BX.ajax.runAction(
					'up:quiz.quiz.getQuestion',
					{
						data:{
							id:1,
						}
					}
				)
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
		this.renderPreview();
		this.renderSettings();

	}

	getQuestionTypePreview()
	{
		let result;
		let selectableAnswers = this.question.selectableAnswers;

		if (this.question.questionType === 'selectable')
		{
			result = Tag.render`<div class="control" id="selectablePreview"></div>`;
			selectableAnswers.forEach(answer => {
				const answerOption = Tag.render`
					<label class="radio" id="selectableAnswer__1">
						<input type="radio">
						${answer}
					</label>`;
				result.appendChild(answerOption);
			});
		}
		else
		{
			result = Tag.render`<input type="text" class="input" placeholder="Введите ответ" id="freePreview">`;
		}
		return result;
	}

	renderPreview()
	{
		this.previewNode.innerHTML = '';

		const QuestionTypeNode = this.getQuestionTypePreview();

		const QuestionPreview = Tag.render`
			<div class="box">
				<h3 class="title question-preview__question-text" id="questionTextPreview">${this.question.title}</h3>
				${QuestionTypeNode}
				<a class="button is-success" disabled>Отправить</a>
			</div>
		`;

		const ResultPreview = Tag.render`
			<div class="box" id="displayTypePreview">
				<h3 class="title">Результаты опроса:</h3>
				<div id="pieChartPreview">
					Тут типо превью круговой
				</div>
				<div id="barChartPreview" class="hidden">
					Тут типо превью Столбчатой
				</div>
				<div id="tagCloudPreview" class="hidden">
					Тут типо превью Облако тэгов
				</div>
				<div id="rawOutputPreview" class="hidden">
					Тут типо превью Сырового вывода
				</div>
			</div>
		`;

		this.previewNode.appendChild(QuestionPreview);
		this.previewNode.appendChild(ResultPreview);


	}

	renderSettings()
	{
		this.settingsNode.innerHTML = '';

		const QuestionTextInput = this.getQuestionTextInput();
		const QuestionTypeSelect = this.getQuestionTypeSettings();
		const DisplayTypeSelect = this.getDisplayTypeSelect();

		const SettingsNode = Tag.render``;
	}

	getQuestionTextInput()
	{
		let result = Tag.render`
			<div class="question-settings__input-title">Текст вопроса:</div>
			<input value="${this.question.title}" class="input" type="text" placeholder="Введите вопрос" name="questionText" id="questionText">
		`;
		return result;
	}

	getQuestionTypeSettings()
	{
		let result = Tag.render`<div></div>`;

		let QuestionTypeTitle = Tag.render`<div class="question-settings__input-title">Тип ответа:</div>`;

		let QuestionTypeSelect = Tag.render`<select class="select" name="questionType" id="questionType"></select>`;

		for (let questionType in this.QUESTION_TYPES)
		{
			let isSelected = (this.question.questionType === questionType) ? 'selected' : '';
			let questionTypeOption = Tag.render`
				<option value="${questionType}" ${isSelected}>${this.QUESTION_TYPES.questionType}</option>
			`;
			QuestionTypeSelect.appendChild(questionTypeOption);
		}

		let SelectableAnswers = Tag.render`
			<div class="question-settings__selectable-answers hidden" id="selectableAnswers">
				<div class="question-settings__input-title">Вариаты ответа:</div>
				<div class="question-settings__answers-container" id="answersContainer">
					<input type="text" class="question-settings__answer input" name="selectableAnswer__1">
				</div>
				<a class="button" id="addAnswerButton">
					<i class="fa-solid fa-plus "></i>
				</a>
			</div>
		`;

		result.append(QuestionTypeTitle, QuestionTypeSelect);

		return result;
	}

	getDisplayTypeSelect()
	{

	}
}