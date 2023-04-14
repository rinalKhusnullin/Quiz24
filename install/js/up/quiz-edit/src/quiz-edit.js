import {Type, Tag} from 'main.core';

export class QuizEdit
{
	QUESTION_TYPES = {
		free : 'Свободный ответ',//0
		selectable : 'Выбираемый ответ'//1
	};

	DISPLAY_TYPES = {
		pieChart : 'Круговая диаграмма',//0
		barChart : 'Столбчатая диаграмма',//1
		tagCloud : 'Облако тэгов',//2
		rawOutput : 'Сырой вывод'//3
	};

	question = {};

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

		this.reload();
	}

	reload()
	{
		this.loadQuestions(1)
			.then(questions => {
				this.questions = questions;
				console.log(questions);
				this.loadQuestion(1)
					.then(question => {
						this.question = question;
						console.log(question)
						this.render();
					});
			});

	}

	loadQuestions(quizId)
	{
		return new Promise((resolve, reject) => {
			BX.ajax.runAction(
					'up:quiz.question.getQuestions',
					{
						data:{
							quizId: quizId,
						}
					}
				)
				.then((response) => {
					const questions = response.data.questions;
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
					'up:quiz.question.getQuestion',
					{
						data:{
							id: id,
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
				console.log(response);
			})
			.catch((error) => {
				console.error(error);
			})
		;
	}

	render()
	{
		this.rootNode.innerHTML = ``;
		const QuestionsContainerNode = Tag.render`
			<div class="column is-one-fifth question-list">
				<div class="question-list__title">Вопросы</div>
				<div class="question-list__questions" id="questions">
					
				</div>
				<div class="question-list__append-button mt-2">
					+
				</div>
			</div>
		`;
		this.rootNode.appendChild(QuestionsContainerNode);
		this.renderQuestionsList();
		this.renderQuestion();
	}
	renderQuestionsList(){
		const QuestionsNode = Tag.render`<div></div>`;
		this.questions.forEach(questionData => {
			const questionCard = Tag.render`
				<div class="question-list__question" data-id="${questionData.ID}">
					${questionData.QUESTION_TEXT}
				</div>
			`;
			QuestionsNode.appendChild(questionCard);
		});
		let questionsContainer = document.getElementById('questions');
		questionsContainer.innerHTML = ``;
		questionsContainer.appendChild(QuestionsNode);
	}
	renderQuestion()
	{
		console.log(this.question);
		//рендер превью
		const PreviewContainerNode =  Tag.render`
			<div class="column is-three-fifths question-preview">
				<div class="question-preview__title">Превью</div>
				<div class="box">
					<h3 class="title question-preview__question-text" id="questionTextPreview">${this.question.QUESTION_TEXT}</h3>
					<div id="questionPreviewContainer">
						<input type="text" class="input" placeholder="Введите ответ" id="freePreview">
					</div>
					<a class="button is-success">Отправить</a>
					
				</div>
				<div class="box" id="displayTypePreview">
					<h3 class="title">Результаты опроса:</h3>
					<div id="chartPreviewContainer">
						<div id="pieChartPreview">
							Круговая диаграмма
						</div>
					</div>
				</div>
			</div>
		`;
		this.rootNode.appendChild(PreviewContainerNode);

		//рендер настроек
		const SettingsContainerNode =  Tag.render`
			<div class="column question-settings">
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
					<option value="0" ${this.question.QUESTION_TYPE_ID == 0 ? 'selected' : ''}>Круговая диаграмма</option>
					<option value="1" ${this.question.QUESTION_TYPE_ID == 1 ? 'selected' : ''}>Облако тэгов</option>
					<option value="2" ${this.question.QUESTION_TYPE_ID == 2 ? 'selected' : ''}>Столбчатая диаграмма</option>
					<option value="3" ${this.question.QUESTION_TYPE_ID == 3 ? 'selected' : ''}>Текстовый формат</option>
				</select>
				<button type="submit" class="button is-success" id="save-question-button">Сохранить</button>
			</div>
		`;

		if ( (this.question.OPTIONS != null) && (this.question.OPTIONS != 'undefinded') && (this.question.OPTIONS != '')){
			let options = JSON.parse(this.question.OPTIONS);
			for (let i = 0; i < options.length; i++)
			{
				let answerInputsContainer = SettingsContainerNode.querySelector('#answersContainer');
				const AnswerInput = Tag.render`
				<input type="text" class="question-settings__answer input" name="selectableAnswer" value="${options[i]}">
			`;
				answerInputsContainer.appendChild(AnswerInput);
			}
		}

		SettingsContainerNode.querySelector('#addAnswerButton').onclick = () => {
			let answerInputsContainer = SettingsContainerNode.querySelector('#answersContainer');
			let currentAnswerCount = answerInputsContainer.childElementCount;
			const newAnswerInput = Tag.render`
				<input type="text" class="question-settings__answer input" name="selectableAnswer" value="Вариант ${currentAnswerCount+1}">
			`;
			answerInputsContainer.appendChild(newAnswerInput);
			this.changeQuestion();
		}
		SettingsContainerNode.oninput = () => { this.changeQuestion() };

		SettingsContainerNode.querySelector('#save-question-button').onclick = () => {this.saveQuestion()};

		this.rootNode.appendChild(SettingsContainerNode);
		this.renderPreview();
	}

	changeQuestion(){
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
			console.log(this.question.OPTIONS);
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

	renderPreview()
	{
		//рендерим текст
		const questionTextPreview = document.getElementById('questionTextPreview');
		questionTextPreview.innerHTML = this.question.QUESTION_TEXT;

		//рендерим ввод ответов
		const questionPreviewContainer = document.getElementById('questionPreviewContainer');
		let questionPreview;
		if (this.question.QUESTION_TYPE_ID  == 0){
			questionPreview = Tag.render`
				<input type="text" class="input" placeholder="Введите ответ" id="freePreview">
			`;
		}
		if (this.question.QUESTION_TYPE_ID == 1){
			questionPreview = Tag.render`
				<div class="control" id="selectablePreview">
					<label class="radio">
						<input type="radio">
						Тут захардкожено пока что
					</label>
					<label class="radio">
						<input type="radio">
						Тут захардкожено пока что
					</label>
				</div>
			`;
		}
		questionPreviewContainer.innerHTML = '';
		questionPreviewContainer.appendChild(questionPreview);

		//рендерим превью диаграммы
		const chartPreviewContainer = document.getElementById('chartPreviewContainer');
		let ChartPreview;
		if (this.question.QUESTION_DISPLAY_ID === '0'){
			ChartPreview = Tag.render`
				<div id="pieChartPreview">
					Тут типо превью круговой
				</div>
			`;
		}
		if (this.question.QUESTION_DISPLAY_ID === '1'){
			ChartPreview = Tag.render`
				<div id="tagCloudPreview">
					Облако тегов
				</div>
			`;
		}
		if (this.question.QUESTION_DISPLAY_ID === '2'){
			ChartPreview = Tag.render`
				<div id="barChartPreview">
					Столбчатая диаграмма
				</div>
			`;
		}
		if (this.question.QUESTION_DISPLAY_ID === '3'){
			ChartPreview = Tag.render`
				<div id="rawOutputPreview">
					Сырой вывод
				</div>
			`;
		}
		chartPreviewContainer.innerHTML = '';
		chartPreviewContainer.appendChild(ChartPreview);
	}
}