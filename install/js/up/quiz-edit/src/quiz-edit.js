import {Type, Tag, Loc, Text} from 'main.core';
am4core.useTheme(am4themes_animated);

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
		content: '',
		autoHide: true,
		autoHideDelay: 1000,
	});

	constructor(options = {})
	{

		am4core.options.autoDispose = true;
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

		this.loadQuiz().then(quiz => {
			this.quiz = quiz;
			this.rootNode.parentNode.insertBefore(this.getQuizTitleNode(), this.rootNode); // Добавление редактирования опроса
			this.renderLoading();
			this.reload();
		}, error => {
			this.renderErrorPage();
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
		return new Promise((resolve, reject) => {
			BX.ajax.runAction(
					'up:quiz.question.createQuestion', {
						data: {
							quizId: this.quizId,
						}
					}
				)
				.then((response) => {
					resolve(response);
				})
				.catch((error) => {
					console.error(error);
					reject(error);
				});
		})
	}

	deleteQuestion(id)
	{
		return new Promise((resolve, reject) => {
			BX.ajax.runAction(
					'up:quiz.question.deleteQuestion', {
						data: {
							id: id,
							quizId: this.quizId
						}
					}
				)
				.then((response) => {
					resolve(response);
				})
				.catch((error) => {
					console.error(error);
					reject(error);
				});
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
				}, error => {
					this.renderErrorPage();
				});
		});
	}

	render()
	{
		this.rootNode.innerHTML = ``;
		this.rootNode.appendChild(this.getQuestionListNode());
		this.rootNode.appendChild(this.getQuestionPreviewNode());
		if (!this.chart) this.renderChart();
		this.rootNode.appendChild(this.getQuestionSettingsNode());
	}

	renderPreview()
	{
		document.getElementById('preview').replaceWith(this.getQuestionPreviewNode());
		if (this.chart) this.chart.dispose();
		this.renderChart();
	}

	renderSettings()
	{
		document.getElementById('settings').replaceWith(this.getQuestionSettingsNode());
	}

	renderQuestionList()
	{
		document.getElementById('questions-column').replaceWith(this.getQuestionListNode());
	}

	renderLoading()
	{
		if (!(this.rootNode.innerHTML === '<div class="donut"></div>'))
			this.rootNode.innerHTML = `<div class="donut"></div>`;
	}

	renderLoadingPreview()
	{
		if (this.rootNode.querySelector('#preview'))
			this.rootNode.querySelector('#preview').innerHTML = `<div class="donut"></div>`;
	}

	renderLoadingSettings()
	{
		if (this.rootNode.querySelector('#settings'))
			this.rootNode.querySelector('#settings').innerHTML = `<div class="donut"></div>`;
	}

	renderChart()
	{
		let data = [];
		if (this.question.QUESTION_TYPE_ID === '1' && this.question.OPTIONS != null )
		{
			let options = JSON.parse(this.question.OPTIONS);
			options.forEach(option => {
				data.push({
					"option" : `${Text.encode(option)}`,
					"weight" : Math.floor(Math.random() * 100),
				});
			})
		}
		else
		{
			data = [{
				"option": "Lithuania",
				"weight": 501.9
			}, {
				"option": "Czech Republic",
				"weight": 301.9
			}, {
				"option": "Ireland",
				"weight": 201.1
			}, {
				"option": "Germany",
				"weight": 165.8
			}, {
				"option": "Australia",
				"weight": 139.9
			}, {
				"option": "Austria",
				"weight": 128.3
			}, {
				"option": "UK",
				"weight": 99
			}, {
				"option": "Belgium",
				"weight": 60
			}, {
				"option": "The Netherlands",
				"weight": 50
			}];
		}


		let chart;
		if (this.question.QUESTION_DISPLAY_ID === '0')
		{
			chart = am4core.create("resultPreview", am4charts.PieChart);
			chart.data = data;
			let pieSeries = chart.series.push(new am4charts.PieSeries());
			pieSeries.dataFields.value = "weight";
			pieSeries.dataFields.category = "option";
		}
		else if (this.question.QUESTION_DISPLAY_ID === '1')
		{
			chart = am4core.create("resultPreview", am4plugins_wordCloud.WordCloud);
			chart.fontFamily = "Courier New";
			let series = chart.series.push(new am4plugins_wordCloud.WordCloudSeries());
			series.randomness = 0.1;
			series.rotationThreshold = 0.5;
			series.data = data;

			series.dataFields.word = "option";
			series.dataFields.value = "weight";

			series.heatRules.push({
				"target": series.labels.template,
				"property": "fill",
				"min": am4core.color("#0000CC"),
				"max": am4core.color("#CC00CC"),
				"dataField": "value"
			});

			series.labels.template.tooltipText = "{option}:\n[bold]{weight}[/]";
		}
		else if (this.question.QUESTION_DISPLAY_ID === '2')
		{
			chart = am4core.create("resultPreview", am4charts.XYChart);
			chart.data = data;
			let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
			categoryAxis.dataFields.category = "option";
			categoryAxis.title.text = "Answer";

			let  valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
			valueAxis.title.text = "Answer Count";

			let series = chart.series.push(new am4charts.ColumnSeries());
			series.dataFields.valueY = "weight";
			series.dataFields.categoryX = "option";
			series.columns.template.tooltipText = "Answer: {categoryX}\nCount: {valueY}";
		}
		else if (this.question.QUESTION_DISPLAY_ID === '3')
		{
			document.getElementById('resultPreview').textContent = Loc.getMessage('UP_QUIZ_EDIT_RAW_OUTPUT_PREVIEW_TITLE');
		}

		this.chart = chart;
	}

	renderErrorPage()
	{
		this.rootNode.classList.remove('columns');
		this.rootNode.innerHTML = ``;
		this.rootNode.appendChild(Up.Quiz.QuizErrorManager.getQuizNotFoundError());
	}

	getQuizTitleNode()
	{
		let quizTitleInput = Tag.render`<input type="text" class="input" value="${Text.encode(this.quiz.TITLE)}">`;
		let quizTitleSaveButton = Tag.render`<button class="button is-success">${Loc.getMessage('UP_QUIZ_EDIT_SAVE')}</button>`;
		let quizTitleHelper = Tag.render`<p class="help is-danger"></p>`;

		quizTitleSaveButton.onclick = () => {
			quizTitleSaveButton.classList.add('is-loading');
			this.updateQuizTitle(quizTitleInput.value).then(() => {
				quizTitleHelper.textContent = '';
				quizTitleSaveButton.classList.remove('is-loading');
				this.notify.content = Loc.getMessage('UP_QUIZ_EDIT_SAVE_QUIZ_TITLE_NOTIFY');
				this.notify.show();
			}, error => {
				let errorCode = error.errors[0].code;
				quizTitleHelper.textContent = Up.Quiz.QuizErrorManager.getMessage(errorCode);
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
			let shortQuestionTitle = this.truncateText(questionData.QUESTION_TEXT, 16);

			const questionButton = Tag.render`
				<div class="button question-button" data-id="${Text.encode(questionData.ID)}"
					${(questionData.QUESTION_TEXT.length > 16) ? `title="${Text.encode(questionData.QUESTION_TEXT)}"` : ''}>
					${Text.encode(shortQuestionTitle)}
				</div>
			`;

			const questionDeleteButton = Tag.render`
				<a class="button delete-button">
					<i class="fa-solid fa-trash"></i>
				</a>
			`;

			questionButton.onclick = () => {
				this.renderLoadingPreview();
				this.renderLoadingSettings();
				this.loadQuestion(+questionData.ID).then((question) => {
					this.question = question;
					this.currentQuestionId = questionData.ID;
					this.chart = null;
					this.renderPreview();
					this.renderSettings();
				});
			};

			questionDeleteButton.onclick = () => {
				questionDeleteButton.classList.add('is-loading');
				this.deleteQuestion(+questionData.ID)
					.then(() =>
					{
						this.showNotify(this.notify, 1000, Loc.getMessage('UP_QUIZ_EDIT_DELETE_QUESTION_NOTIFY'))
						if (this.currentQuestionId === questionData.ID)
						{
							if (this.chart) this.chart.dispose();
							this.chart = null;
							this.reload();
						}
						else
						{
							this.loadQuestions().then(questions => {
								this.questions = questions;
								this.renderQuestionList();
							});
						}
					}, (error) => {
						questionDeleteButton.classList.remove('is-loading');
						this.showNotify(this.notify, 3000, Loc.getMessage('UP_QUIZ_EDIT_WHATS_WRONG_NOTIFY'));
					});
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
			AddNewQuestionButton.classList.add('is-loading');
			this.createQuestion()
				.then(() => {
					this.loadQuestions().then(questions => {
						this.questions = questions;
						this.renderQuestionList();
					})
				}, (error) => {
					let errorCode = error.errors[0].code;
					AddNewQuestionButton.classList.remove('is-loading');
					if (errorCode === 'max_count_questions')
					{
						this.showNotify(this.notify, 2000, Up.Quiz.QuizErrorManager.getMessage(errorCode));
						return;
					}
					this.showNotify(this.notify, 3000, Loc.getMessage('UP_QUIZ_EDIT_WHATS_WRONG_NOTIFY'));
				});
		}

		let questionButtons = QuestionsContainer.querySelectorAll('p.question-button');
		questionButtons.forEach(question => {
			question.onclick = () => {
				if (!question.parentNode.classList.contains('is-active-question-button'))
				{
					questionButtons.forEach(otherQuestion => {
						otherQuestion.parentNode.classList.remove('is-active-question-button');
					});
					question.parentNode.classList.add('is-active-question-button');
				}
			}
		});


		QuestionsContainer.appendChild(AddNewQuestionButton);


		return Tag.render`
			<div class="column is-one-quarter question-list" id="questions-column">
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
					<label class="radio"><input class="option-input radio" type="radio" name="previewRadio">
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
			<div id="resultPreview"></div>
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
			AnswerDelete.onclick = () => {
				if (options === null)
				{
					this.deleteAnswer(0);
				}
				else
				{
					this.deleteAnswer(options.length)
				}
			};

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

		SettingsContainerNode.oninput = () => {
			this.changeQuestion();
		};

		SettingsContainerNode.querySelector('#save-question-button').onclick = () => {
			SettingsContainerNode.querySelector('#save-question-button').classList.add('is-loading');
			this.resetHelpers();
			this.saveQuestion().then(() => {
				this.showNotify(this.notify, 1000, Loc.getMessage('UP_QUIZ_EDIT_SAVE_QUIZ_DATA_NOTIFY'));
				SettingsContainerNode.querySelector('#save-question-button').classList.remove('is-loading');
				this.renderQuestionList();
			}, reject => {
				reject.errors.forEach(error => {
					let errorCode = error.code;
					let errorMessage = Up.Quiz.QuizErrorManager.getMessage(errorCode);

					if (errorCode === 'empty_question_text')
					{
						SettingsContainerNode.querySelector('#question-text-helper').textContent = errorMessage;
					}
					else if (errorCode === 'invalid_question_type_id') {
						SettingsContainerNode.querySelector('#question-type-helper').textContent = errorMessage;
					}
					else if (errorCode === 'invalid_display_type_id') {
						SettingsContainerNode.querySelector('#question-display-type-helper').textContent = errorMessage;
					}
					else if (errorCode === 'max_count_options') {
						SettingsContainerNode.querySelector('#question-options-helper').textContent = errorMessage;
					}
					else if (errorCode === 'empty_options') {
						SettingsContainerNode.querySelector('#question-options-helper').textContent = errorMessage;
					}
					else if (errorCode === 'empty_option')
					{
						SettingsContainerNode.querySelectorAll('.question-settings__answer-inputs').forEach(answerInput => {
							if (answerInput.querySelector('input').value === ''){
								answerInput.after(Tag.render`<p class="help is-danger answer-helper">${errorMessage}</p>`)
							}
						});
					}
					else if (errorCode === 'exceeding_option')
					{
						SettingsContainerNode.querySelectorAll('.question-settings__answer-inputs').forEach(answerInput => {
							if (answerInput.querySelector('input').value.length > 40){
								answerInput.after(Tag.render`<p class="help is-danger answer-helper">${errorMessage}</p>`)
							}
						});
					}
					else
					{
						this.showNotify(this.notify, 2000, errorMessage);
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
			document.querySelector('#question-type-helper').textContent = '';

		if (document.querySelector('#question-display-type-helper'))
			document.querySelector('#question-display-type-helper').textContent = '';

		if (document.querySelector('#question-options-helper'))
			document.querySelector('#question-options-helper').textContent = '';

		let answerHelpers = document.querySelectorAll('.answer-helper');
		let answerContainer = document.querySelector('#answersContainer');
		if (answerHelpers){
			if (answerContainer){
				answerHelpers.forEach(answerHelper => {
					answerContainer.removeChild(answerHelper);
				});
			}
		}
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

	showNotify(notify, time = 3000, message = 'ЙОУ')
	{
		notify.content = message;
		notify.autoHideDelay = time;
		notify.show();
	}
}