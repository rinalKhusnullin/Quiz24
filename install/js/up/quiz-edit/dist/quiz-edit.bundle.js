this.Up = this.Up || {};
(function (exports,main_core) {
	'use strict';

	var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject10, _templateObject11, _templateObject12;
	var QuizEdit = /*#__PURE__*/function () {
	  function QuizEdit() {
	    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    babelHelpers.classCallCheck(this, QuizEdit);
	    babelHelpers.defineProperty(this, "QUESTION_TYPES", {
	      free: 'Свободный ответ',
	      //0
	      selectable: 'Выбираемый ответ' //1
	    });
	    babelHelpers.defineProperty(this, "DISPLAY_TYPES", {
	      pieChart: 'Круговая диаграмма',
	      //0
	      barChart: 'Столбчатая диаграмма',
	      //1
	      tagCloud: 'Облако тэгов',
	      //2
	      rawOutput: 'Сырой вывод' //3
	    });
	    babelHelpers.defineProperty(this, "question", {});
	    if (main_core.Type.isStringFilled(options.rootNodeId)) {
	      this.rootNodeId = options.rootNodeId;
	    } else {
	      throw new Error('QuizEdit: options.rootNodeId required');
	    }
	    this.rootNode = document.getElementById(this.rootNodeId);
	    if (!this.rootNode) {
	      throw new Error("QuizEdit: element with id \"".concat(this.rootNodeId, "\" not found"));
	    }
	    this.reload();
	  }
	  babelHelpers.createClass(QuizEdit, [{
	    key: "reload",
	    value: function reload() {
	      var _this = this;
	      this.loadQuestions(1).then(function (questions) {
	        _this.questions = questions;
	        console.log(questions);
	        _this.loadQuestion(1).then(function (question) {
	          _this.question = question;
	          _this.render();
	        });
	      });
	    }
	  }, {
	    key: "loadQuestions",
	    value: function loadQuestions(quizId) {
	      return new Promise(function (resolve, reject) {
	        BX.ajax.runAction('up:quiz.question.getQuestions', {
	          data: {
	            quizId: quizId
	          }
	        }).then(function (response) {
	          var questions = response.data.questions;
	          resolve(questions);
	        })["catch"](function (error) {
	          console.error(error);
	          reject(error);
	        });
	      });
	    }
	  }, {
	    key: "loadQuestion",
	    value: function loadQuestion(id) {
	      return new Promise(function (resolve, reject) {
	        BX.ajax.runAction('up:quiz.question.getQuestion', {
	          data: {
	            id: id
	          }
	        }).then(function (response) {
	          var question = response.data.question[0];
	          console.log(question);
	          resolve(question);
	        })["catch"](function (error) {
	          console.error(error);
	          reject(error);
	        });
	      });
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      this.rootNode.innerHTML = "";
	      var QuestionsContainerNode = main_core.Tag.render(_templateObject || (_templateObject = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<div class=\"column is-one-fifth question-list\">\n\t\t\t\t<div class=\"question-list__title\">\u0412\u043E\u043F\u0440\u043E\u0441\u044B</div>\n\t\t\t\t<div class=\"question-list__questions\" id=\"questions\">\n\t\t\t\t\t\n\t\t\t\t</div>\n\t\t\t\t<div class=\"question-list__append-button mt-2\">\n\t\t\t\t\t+\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t"])));
	      this.rootNode.appendChild(QuestionsContainerNode);
	      this.renderQuestionsList();
	      this.renderQuestion();
	    }
	  }, {
	    key: "renderQuestionsList",
	    value: function renderQuestionsList() {
	      var QuestionsNode = main_core.Tag.render(_templateObject2 || (_templateObject2 = babelHelpers.taggedTemplateLiteral(["<div></div>"])));
	      this.questions.forEach(function (questionData) {
	        var questionCard = main_core.Tag.render(_templateObject3 || (_templateObject3 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t\t<div class=\"question-list__question\" data-id=\"", "\">\n\t\t\t\t\t", "\n\t\t\t\t</div>\n\t\t\t"])), questionData.ID, questionData.QUESTION_TEXT);
	        QuestionsNode.appendChild(questionCard);
	      });
	      var questionsContainer = document.getElementById('questions');
	      questionsContainer.innerHTML = "";
	      questionsContainer.appendChild(QuestionsNode);
	    }
	  }, {
	    key: "renderQuestion",
	    value: function renderQuestion() {
	      var _this2 = this;
	      //рендер превью
	      var PreviewContainerNode = main_core.Tag.render(_templateObject4 || (_templateObject4 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<div class=\"column is-three-fifths question-preview\">\n\t\t\t\t<div class=\"question-preview__title\">\u041F\u0440\u0435\u0432\u044C\u044E</div>\n\t\t\t\t<div class=\"box\">\n\t\t\t\t\t<h3 class=\"title question-preview__question-text\" id=\"questionTextPreview\">", "</h3>\n\t\t\t\t\t<div id=\"questionPreviewContainer\">\n\t\t\t\t\t\t<input type=\"text\" class=\"input\" placeholder=\"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043E\u0442\u0432\u0435\u0442\" id=\"freePreview\">\n\t\t\t\t\t</div>\n\t\t\t\t\t<a class=\"button is-success\">\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C</a>\n\t\t\t\t\t\n\t\t\t\t</div>\n\t\t\t\t<div class=\"box\" id=\"displayTypePreview\">\n\t\t\t\t\t<h3 class=\"title\">\u0420\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u044B \u043E\u043F\u0440\u043E\u0441\u0430:</h3>\n\t\t\t\t\t<div id=\"chartPreviewContainer\">\n\t\t\t\t\t\t<div id=\"pieChartPreview\">\n\t\t\t\t\t\t\t\u041A\u0440\u0443\u0433\u043E\u0432\u0430\u044F \u0434\u0438\u0430\u0433\u0440\u0430\u043C\u043C\u0430\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t"])), this.question.QUESTION_TEXT);
	      this.rootNode.appendChild(PreviewContainerNode);

	      //рендер настроек
	      var SettingsContainerNode = main_core.Tag.render(_templateObject5 || (_templateObject5 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<div class=\"column question-settings\">\n\t\t\t\t<div class=\"question-settings__title\">\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438</div>\n\t\t\t\t\n\t\t\t\t<div class=\"question-settings__input-title\">\u0422\u0435\u043A\u0441\u0442 \u0432\u043E\u043F\u0440\u043E\u0441\u0430:</div>\n\t\t\t\t<input value=\"", "\" class=\"input\" type=\"text\" placeholder=\"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0432\u043E\u043F\u0440\u043E\u0441\" name=\"questionText\" id=\"questionText\">\n\t\t\t\t\n\t\t\t\t<div class=\"question-settings__input-title\">\u0422\u0438\u043F \u043E\u0442\u0432\u0435\u0442\u0430:</div>\n\t\t\t\t<select class=\"select\" name=\"questionType\" id=\"questionType\">\n\t\t\t\t\t<option value=\"0\" ", ">\u0421\u0432\u043E\u0431\u043E\u0434\u043D\u044B\u0439 \u043E\u0442\u0432\u0435\u0442</option>\n\t\t\t\t\t<option value=\"1\" ", ">\u0412\u044B\u0431\u043E\u0440 \u0432\u0430\u0440\u0438\u0430\u043D\u0442\u0430</option>\n\t\t\t\t</select>\n\t\t\t\t\n\t\t\t\t<div class=\"question-settings__selectable-answers\" id=\"selectableAnswers\">\n\t\t\t\t\t<div class=\"question-settings__input-title\">\u0412\u0430\u0440\u0438\u0430\u0442\u044B \u043E\u0442\u0432\u0435\u0442\u0430:</div>\n\t\t\t\t\t<div class=\"question-settings__answers-container\" id=\"answersContainer\">\n\t\t\t\t\t\t<input type=\"text\" class=\"question-settings__answer input\" name=\"selectableAnswer\" value=\"\u0412\u0430\u0440\u0438\u0430\u043D\u0442 1\">\n\t\t\t\t\t</div>\n\t\t\t\t\t<a class=\"button\" id=\"addAnswerButton\">\n\t\t\t\t\t\t<i class=\"fa-solid fa-plus \"></i>\n\t\t\t\t\t</a>\n\t\t\t\t</div>\n\t\t\t\t\n\t\t\t\t<div class=\"question-settings__input-title\">\u0422\u0438\u043F \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u043E\u0432:</div>\n\t\t\t\t<select name=\"displayType\" id=\"displayType\">\n\t\t\t\t\t<option value=\"0\" ", ">\u041A\u0440\u0443\u0433\u043E\u0432\u0430\u044F \u0434\u0438\u0430\u0433\u0440\u0430\u043C\u043C\u0430</option>\n\t\t\t\t\t<option value=\"1\" ", ">\u041E\u0431\u043B\u0430\u043A\u043E \u0442\u044D\u0433\u043E\u0432</option>\n\t\t\t\t\t<option value=\"2\" ", ">\u0421\u0442\u043E\u043B\u0431\u0447\u0430\u0442\u0430\u044F \u0434\u0438\u0430\u0433\u0440\u0430\u043C\u043C\u0430</option>\n\t\t\t\t\t<option value=\"3\" ", ">\u0422\u0435\u043A\u0441\u0442\u043E\u0432\u044B\u0439 \u0444\u043E\u0440\u043C\u0430\u0442</option>\n\t\t\t\t</select>\n\t\t\t\t<button type=\"submit\" class=\"button is-success\">\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C</button>\n\t\t\t</div>\n\t\t"])), this.question.QUESTION_TEXT, this.question.QUESTION_TYPE_ID == 0 ? 'selected' : '', this.question.QUESTION_TYPE_ID == 1 ? 'selected' : '', this.question.QUESTION_TYPE_ID == 0 ? 'selected' : '', this.question.QUESTION_TYPE_ID == 1 ? 'selected' : '', this.question.QUESTION_TYPE_ID == 2 ? 'selected' : '', this.question.QUESTION_TYPE_ID == 3 ? 'selected' : '');
	      SettingsContainerNode.querySelector('#addAnswerButton').onclick = function () {
	        var answerInputsContainer = SettingsContainerNode.querySelector('#answersContainer');
	        var currentAnswerCount = answerInputsContainer.childElementCount;
	        console.log(currentAnswerCount);
	        var newAnswerInput = main_core.Tag.render(_templateObject6 || (_templateObject6 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t\t<input type=\"text\" class=\"question-settings__answer input\" name=\"selectableAnswer\" value=\"\u0412\u0430\u0440\u0438\u0430\u043D\u0442 ", "\">\n\t\t\t"])), currentAnswerCount + 1);
	        answerInputsContainer.appendChild(newAnswerInput);
	      };
	      SettingsContainerNode.oninput = function () {
	        _this2.changeQuestion();
	      };
	      this.rootNode.appendChild(SettingsContainerNode);
	    }
	  }, {
	    key: "changeQuestion",
	    value: function changeQuestion() {
	      var questionTextInput = document.getElementById('questionText');
	      this.question.QUESTION_TEXT = questionTextInput.value;
	      var questionTypeInput = document.getElementById('questionType');
	      this.question.QUESTION_TYPE_ID = questionTypeInput.value;
	      var selectableAnswers = document.getElementById('selectableAnswers');
	      if (this.question.QUESTION_TYPE_ID == 1) {
	        selectableAnswers.classList.remove("hidden");
	      } else {
	        selectableAnswers.classList.add("hidden");
	      }
	      var displayTypeInput = document.getElementById('displayType');
	      this.question.QUESTION_DISPLAY_ID = displayTypeInput.value;
	      this.renderPreview();
	    }
	  }, {
	    key: "renderPreview",
	    value: function renderPreview() {
	      //рендерим текст
	      var questionTextPreview = document.getElementById('questionTextPreview');
	      questionTextPreview.innerHTML = this.question.QUESTION_TEXT;

	      //рендерим ввод ответов
	      var questionPreviewContainer = document.getElementById('questionPreviewContainer');
	      var questionPreview;
	      if (this.question.QUESTION_TYPE_ID == '0') {
	        questionPreview = main_core.Tag.render(_templateObject7 || (_templateObject7 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t\t<input type=\"text\" class=\"input\" placeholder=\"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043E\u0442\u0432\u0435\u0442\" id=\"freePreview\">\n\t\t\t"])));
	      }
	      if (this.question.QUESTION_TYPE_ID == '1') {
	        questionPreview = main_core.Tag.render(_templateObject8 || (_templateObject8 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t\t<div class=\"control\" id=\"selectablePreview\">\n\t\t\t\t\t<label class=\"radio\">\n\t\t\t\t\t\t<input type=\"radio\">\n\t\t\t\t\t\t\u0422\u0443\u0442 \u0437\u0430\u0445\u0430\u0440\u0434\u043A\u043E\u0436\u0435\u043D\u043E \u043F\u043E\u043A\u0430 \u0447\u0442\u043E\n\t\t\t\t\t</label>\n\t\t\t\t\t<label class=\"radio\">\n\t\t\t\t\t\t<input type=\"radio\">\n\t\t\t\t\t\t\u0422\u0443\u0442 \u0437\u0430\u0445\u0430\u0440\u0434\u043A\u043E\u0436\u0435\u043D\u043E \u043F\u043E\u043A\u0430 \u0447\u0442\u043E\n\t\t\t\t\t</label>\n\t\t\t\t</div>\n\t\t\t"])));
	      }
	      questionPreviewContainer.innerHTML = '';
	      questionPreviewContainer.appendChild(questionPreview);

	      //рендерим превью диаграммы
	      var chartPreviewContainer = document.getElementById('chartPreviewContainer');
	      var ChartPreview;
	      if (this.question.QUESTION_DISPLAY_ID === '0') {
	        ChartPreview = main_core.Tag.render(_templateObject9 || (_templateObject9 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t\t<div id=\"pieChartPreview\">\n\t\t\t\t\t\u0422\u0443\u0442 \u0442\u0438\u043F\u043E \u043F\u0440\u0435\u0432\u044C\u044E \u043A\u0440\u0443\u0433\u043E\u0432\u043E\u0439\n\t\t\t\t</div>\n\t\t\t"])));
	      }
	      if (this.question.QUESTION_DISPLAY_ID === '1') {
	        ChartPreview = main_core.Tag.render(_templateObject10 || (_templateObject10 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t\t<div id=\"tagCloudPreview\">\n\t\t\t\t\t\u041E\u0431\u043B\u0430\u043A\u043E \u0442\u0435\u0433\u043E\u0432\n\t\t\t\t</div>\n\t\t\t"])));
	      }
	      if (this.question.QUESTION_DISPLAY_ID === '2') {
	        ChartPreview = main_core.Tag.render(_templateObject11 || (_templateObject11 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t\t<div id=\"barChartPreview\">\n\t\t\t\t\t\u0421\u0442\u043E\u043B\u0431\u0447\u0430\u0442\u0430\u044F \u0434\u0438\u0430\u0433\u0440\u0430\u043C\u043C\u0430\n\t\t\t\t</div>\n\t\t\t"])));
	      }
	      if (this.question.QUESTION_DISPLAY_ID === '3') {
	        ChartPreview = main_core.Tag.render(_templateObject12 || (_templateObject12 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t\t<div id=\"rawOutputPreview\">\n\t\t\t\t\t\u0421\u044B\u0440\u043E\u0439 \u0432\u044B\u0432\u043E\u0434\n\t\t\t\t</div>\n\t\t\t"])));
	      }
	      chartPreviewContainer.innerHTML = '';
	      chartPreviewContainer.appendChild(ChartPreview);
	    }
	  }]);
	  return QuizEdit;
	}();

	exports.QuizEdit = QuizEdit;

}((this.Up.Quiz = this.Up.Quiz || {}),BX));
