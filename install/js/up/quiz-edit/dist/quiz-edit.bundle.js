this.Up = this.Up || {};
(function (exports,main_core) {
	'use strict';

	var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject10, _templateObject11;
	var QuizEdit = /*#__PURE__*/function () {
	  function QuizEdit() {
	    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    babelHelpers.classCallCheck(this, QuizEdit);
	    babelHelpers.defineProperty(this, "QUESTION_TYPES", {
	      free: 'Свободный ответ',
	      selectable: 'Выбираемый ответ'
	    });
	    babelHelpers.defineProperty(this, "DISPLAY_TYPES", {
	      pieChart: 'Круговая диаграмма',
	      barChart: 'Столбчатая диаграмма',
	      tagCloud: 'Облако тэгов',
	      rawOutput: 'Сырой вывод'
	    });
	    if (main_core.Type.isStringFilled(options.questionsNodeId)) {
	      this.questionsNodeId = options.questionsNodeId;
	    } else {
	      throw new Error('QuizEdit: options.questionsNodeId required');
	    }
	    if (main_core.Type.isStringFilled(options.previewNodeId)) {
	      this.previewNodeId = options.previewNodeId;
	    } else {
	      throw new Error('QuizEdit: options.previewNodeId required');
	    }
	    if (main_core.Type.isStringFilled(options.settingsNodeId)) {
	      this.settingsNodeId = options.settingsNodeId;
	    } else {
	      throw new Error('QuizEdit: options.settingsNodeId required');
	    }
	    this.questionsNode = document.getElementById(this.questionsNodeId);
	    this.previewNode = document.getElementById(this.previewNodeId);
	    this.settingsNode = document.getElementById(this.settingsNodeId);
	    if (!this.questionsNode) {
	      throw new Error("QuizList: element with id \"".concat(this.questionsNodeId, "\" not found"));
	    }
	    if (!this.previewNode) {
	      throw new Error("QuizList: element with id \"".concat(this.previewNodeId, "\" not found"));
	    }
	    if (!this.settingsNode) {
	      throw new Error("QuizList: element with id \"".concat(this.settingsNodeId, "\" not found"));
	    }
	    this.reload();
	  }
	  babelHelpers.createClass(QuizEdit, [{
	    key: "reload",
	    value: function reload() {
	      var _this = this;
	      this.loadQuestion().then(function (question) {
	        _this.question = question;
	        _this.render();
	      });
	    }
	  }, {
	    key: "loadQuestions",
	    value: function loadQuestions() {
	      return new Promise(function (resolve, reject) {
	        BX.ajax.runAction('up:quiz.quiz.getQuestions', {
	          data: {
	            quizId: 1
	          }
	        }).then(function (response) {
	          var question = response.data.question;
	          resolve(question);
	        })["catch"](function (error) {
	          console.error(error);
	          reject(error);
	        });
	      });
	    }
	  }, {
	    key: "loadQuestion",
	    value: function loadQuestion() {
	      return new Promise(function (resolve, reject) {
	        BX.ajax.runAction('up:quiz.quiz.getQuestion', {
	          data: {
	            id: 1
	          }
	        }).then(function (response) {
	          var question = response.data.question;
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
	      this.renderPreview();
	      this.renderSettings();
	    }
	  }, {
	    key: "getQuestionTypePreview",
	    value: function getQuestionTypePreview() {
	      var result;
	      var selectableAnswers = this.question.selectableAnswers;
	      if (this.question.questionType === 'selectable') {
	        result = main_core.Tag.render(_templateObject || (_templateObject = babelHelpers.taggedTemplateLiteral(["<div class=\"control\" id=\"selectablePreview\"></div>"])));
	        selectableAnswers.forEach(function (answer) {
	          var answerOption = main_core.Tag.render(_templateObject2 || (_templateObject2 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t\t\t<label class=\"radio\" id=\"selectableAnswer__1\">\n\t\t\t\t\t\t<input type=\"radio\">\n\t\t\t\t\t\t", "\n\t\t\t\t\t</label>"])), answer);
	          result.appendChild(answerOption);
	        });
	      } else {
	        result = main_core.Tag.render(_templateObject3 || (_templateObject3 = babelHelpers.taggedTemplateLiteral(["<input type=\"text\" class=\"input\" placeholder=\"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043E\u0442\u0432\u0435\u0442\" id=\"freePreview\">"])));
	      }
	      return result;
	    }
	  }, {
	    key: "renderPreview",
	    value: function renderPreview() {
	      this.previewNode.innerHTML = '';
	      var QuestionTypeNode = this.getQuestionTypePreview();
	      var QuestionPreview = main_core.Tag.render(_templateObject4 || (_templateObject4 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<div class=\"box\">\n\t\t\t\t<h3 class=\"title question-preview__question-text\" id=\"questionTextPreview\">", "</h3>\n\t\t\t\t", "\n\t\t\t\t<a class=\"button is-success\" disabled>\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C</a>\n\t\t\t</div>\n\t\t"])), this.question.title, QuestionTypeNode);
	      var ResultPreview = main_core.Tag.render(_templateObject5 || (_templateObject5 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<div class=\"box\" id=\"displayTypePreview\">\n\t\t\t\t<h3 class=\"title\">\u0420\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u044B \u043E\u043F\u0440\u043E\u0441\u0430:</h3>\n\t\t\t\t<div id=\"pieChartPreview\">\n\t\t\t\t\t\u0422\u0443\u0442 \u0442\u0438\u043F\u043E \u043F\u0440\u0435\u0432\u044C\u044E \u043A\u0440\u0443\u0433\u043E\u0432\u043E\u0439\n\t\t\t\t</div>\n\t\t\t\t<div id=\"barChartPreview\" class=\"hidden\">\n\t\t\t\t\t\u0422\u0443\u0442 \u0442\u0438\u043F\u043E \u043F\u0440\u0435\u0432\u044C\u044E \u0421\u0442\u043E\u043B\u0431\u0447\u0430\u0442\u043E\u0439\n\t\t\t\t</div>\n\t\t\t\t<div id=\"tagCloudPreview\" class=\"hidden\">\n\t\t\t\t\t\u0422\u0443\u0442 \u0442\u0438\u043F\u043E \u043F\u0440\u0435\u0432\u044C\u044E \u041E\u0431\u043B\u0430\u043A\u043E \u0442\u044D\u0433\u043E\u0432\n\t\t\t\t</div>\n\t\t\t\t<div id=\"rawOutputPreview\" class=\"hidden\">\n\t\t\t\t\t\u0422\u0443\u0442 \u0442\u0438\u043F\u043E \u043F\u0440\u0435\u0432\u044C\u044E \u0421\u044B\u0440\u043E\u0432\u043E\u0433\u043E \u0432\u044B\u0432\u043E\u0434\u0430\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t"])));
	      this.previewNode.appendChild(QuestionPreview);
	      this.previewNode.appendChild(ResultPreview);
	    }
	  }, {
	    key: "renderSettings",
	    value: function renderSettings() {
	      this.settingsNode.innerHTML = '';
	      var QuestionTextInput = this.getQuestionTextInput();
	      var QuestionTypeSelect = this.getQuestionTypeSelect();
	      var DisplayTypeSelect = this.getDisplayTypeSelect();
	    }
	  }, {
	    key: "getQuestionTextInput",
	    value: function getQuestionTextInput() {
	      var result = main_core.Tag.render(_templateObject6 || (_templateObject6 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<div class=\"question-settings__input-title\">\u0422\u0435\u043A\u0441\u0442 \u0432\u043E\u043F\u0440\u043E\u0441\u0430:</div>\n\t\t\t<input value=\"", "\" class=\"input\" type=\"text\" placeholder=\"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0432\u043E\u043F\u0440\u043E\u0441\" name=\"questionText\" id=\"questionText\">\n\t\t"])), this.question.title);
	      return result;
	    }
	  }, {
	    key: "getQuestionTypeSelect",
	    value: function getQuestionTypeSelect() {
	      var test = main_core.Tag.render(_templateObject7 || (_templateObject7 = babelHelpers.taggedTemplateLiteral(["\n\t\n\t\t\t<div class=\"question-settings__selectable-answers hidden\" id=\"selectableAnswers\">\n\t\t\t\t<div class=\"question-settings__input-title\">\u0412\u0430\u0440\u0438\u0430\u0442\u044B \u043E\u0442\u0432\u0435\u0442\u0430:</div>\n\t\t\t\t<div class=\"question-settings__answers-container\" id=\"answersContainer\">\n\t\t\t\t\t<input type=\"text\" class=\"question-settings__answer input\" name=\"selectableAnswer__1\">\n\t\t\t\t</div>\n\t\t\t\t<a class=\"button\" id=\"addAnswerButton\">\n\t\t\t\t\t<i class=\"fa-solid fa-plus \"></i>\n\t\t\t\t</a>\n\t\t\t</div>\n\t\t"])));
	      var result = main_core.Tag.render(_templateObject8 || (_templateObject8 = babelHelpers.taggedTemplateLiteral(["<div></div>"])));
	      var QuestionTypeTitle = main_core.Tag.render(_templateObject9 || (_templateObject9 = babelHelpers.taggedTemplateLiteral(["<div class=\"question-settings__input-title\">\u0422\u0438\u043F \u043E\u0442\u0432\u0435\u0442\u0430:</div>"])));
	      var QuestionTypeSelect = main_core.Tag.render(_templateObject10 || (_templateObject10 = babelHelpers.taggedTemplateLiteral(["<select class=\"select\" name=\"questionType\" id=\"questionType\"></select>"])));
	      for (var questionType in this.QUESTION_TYPES) {
	        var isSelected = this.question.questionType === questionType ? 'selected' : '';
	        var questionTypeOption = main_core.Tag.render(_templateObject11 || (_templateObject11 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t\t<option value=\"", "\" ", ">", "</option>\n\t\t\t"])), questionType, isSelected, this.QUESTION_TYPES.questionType);
	        QuestionTypeSelect.appendChild(questionTypeOption);
	      }
	      result.append(QuestionTypeTitle, QuestionTypeSelect);
	      return result;
	    }
	  }, {
	    key: "getDisplayTypeSelect",
	    value: function getDisplayTypeSelect() {}
	  }]);
	  return QuizEdit;
	}();

	exports.QuizEdit = QuizEdit;

}((this.Up.Quiz = this.Up.Quiz || {}),BX));
