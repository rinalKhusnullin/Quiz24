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
					console.log(question);
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
		//рендер превью
		//Название вопроса, тип ответа (выбираемый -> варианты ответа),
		const PreviewContainerNode =  Tag.render`
			<div class="column is-three-fifths question-preview">
				<div class="question-preview__title">Превью</div>
				<div class="box">
					<h3 class="title question-preview__question-text" id="questionTextPreview">${this.question.title}</h3>
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
				<input value="${this.question.title}" class="input" type="text" placeholder="Введите вопрос" name="questionText" id="questionText">
				
				<div class="question-settings__input-title">Тип ответа:</div>
				<select class="select" name="questionType" id="questionType">
					<option value="free" selected>${this.QUESTION_TYPES.free}</option>
					<option value="selectable">${this.QUESTION_TYPES.selectable}</option>
				</select>
				
				<div class="question-settings__selectable-answers hidden" id="selectableAnswers">
				<div class="question-settings__input-title">Вариаты ответа:</div>
				<div class="question-settings__answers-container" id="answersContainer">
					<input type="text" class="question-settings__answer input" name="selectableAnswer">
				</div>
				<a class="button" id="addAnswerButton">
					<i class="fa-solid fa-plus "></i>
				</a>
			</div>
				
			<div class="question-settings__input-title">Тип отображения результатов:</div>
				<select name="displayType" id="displayType">
					<option value="pieChart" selected>Круговая диаграмма</option>
					<option value="tagCloud">Облако тэгов</option>
					<option value="barChart">Столбчатая диаграмма</option>
					<option value="rawOutput">Текстовый формат</option>
				</select>
				<button type="submit" class="button is-success">Сохранить</button>
			</div>
		`;
		SettingsContainerNode.oninput = this.renderPreview;
		this.rootNode.appendChild(SettingsContainerNode);
	}

	renderPreview()
	{
		//получаем настройки
		let QuestionSettings = {};
		const questionTextInput = document.getElementById('questionText');
		QuestionSettings.questionText = questionTextInput.value;

		const questionTypeInput = document.getElementById('questionType');
		QuestionSettings.questionType = questionTypeInput.value;

		const displayTypeInput = document.getElementById('displayType');
		QuestionSettings.displayType = displayTypeInput.value;

		//рендерим текст
		const questionTextPreview = document.getElementById('questionTextPreview');
		questionTextPreview.innerHTML = QuestionSettings.questionText;

		//рендерим ввод ответов
		const questionPreviewContainer = document.getElementById('questionPreviewContainer');
		let questionPreview;
		if (QuestionSettings.questionType === 'free'){
			questionPreview = Tag.render`
				<input type="text" class="input" placeholder="Введите ответ" id="freePreview">
			`;
		}
		if (QuestionSettings.questionType === 'selectable'){
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
		if (QuestionSettings.displayType === 'pieChart'){
			ChartPreview = Tag.render`
				<div id="pieChartPreview">
					Тут типо превью круговой
				</div>
			`;
		}
		if (QuestionSettings.displayType === 'tagCloud'){
			ChartPreview = Tag.render`
				<div id="tagCloudPreview">
					Облако тегов
				</div>
			`;
		}
		if (QuestionSettings.displayType === 'barChart'){
			ChartPreview = Tag.render`
				<div id="barChartPreview">
					Столбчатая диаграмма
				</div>
			`;
		}
		if (QuestionSettings.displayType === 'rawOutput'){
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