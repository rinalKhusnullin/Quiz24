this.Up = this.Up || {};
(function (exports,main_core) {
	'use strict';

	var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject10, _templateObject11, _templateObject12, _templateObject13, _templateObject14, _templateObject15, _templateObject16, _templateObject17;
	//${Text.encode(taskData.NAME)}
	var QuizEdit = /*#__PURE__*/function () {
	  function QuizEdit() {
	    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    babelHelpers.classCallCheck(this, QuizEdit);
	    babelHelpers.defineProperty(this, "DISPLAY_TYPES", {
	      0: main_core.Loc.getMessage('UP_QUIZ_EDIT_PIE_CHART'),
	      1: main_core.Loc.getMessage('UP_QUIZ_EDIT_TAG_CLOUD'),
	      2: main_core.Loc.getMessage('UP_QUIZ_EDIT_BAR_CHART'),
	      3: main_core.Loc.getMessage('UP_QUIZ_EDIT_RAW_OUT')
	    });
	    if (main_core.Type.isStringFilled(options.rootNodeId)) {
	      this.rootNodeId = options.rootNodeId;
	    } else {
	      throw new Error('QuizEdit: options.rootNodeId required');
	    }
	    this.rootNode = document.getElementById(this.rootNodeId);
	    if (!this.rootNode) {
	      throw new Error("QuizEdit: element with id \"".concat(this.rootNodeId, "\" not found"));
	    }
	    this.quizId = options.quizId;
	    this.questions = [];
	    this.quiz = {};
	    this.question = {};
	    this.reload();
	  }
	  babelHelpers.createClass(QuizEdit, [{
	    key: "loadQuiz",
	    value: function loadQuiz() {
	      var _this = this;
	      return new Promise(function (resolve, reject) {
	        BX.ajax.runAction('up:quiz.quiz.getQuiz', {
	          data: {
	            id: _this.quizId
	          }
	        }).then(function (response) {
	          var quiz = response.data.quiz;
	          resolve(quiz);
	        })["catch"](function (error) {
	          console.error(error);
	          reject(error);
	        });
	      });
	    }
	  }, {
	    key: "loadQuestions",
	    value: function loadQuestions() {
	      var _this2 = this;
	      return new Promise(function (resolve, reject) {
	        BX.ajax.runAction('up:quiz.question.getQuestions', {
	          data: {
	            quizId: _this2.quizId
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
	          var question = response.data.question;
	          resolve(question);
	        })["catch"](function (error) {
	          console.error(error);
	          reject(error);
	        });
	      });
	    }
	  }, {
	    key: "saveQuestion",
	    value: function saveQuestion() {
	      var _this3 = this;
	      console.log(this.question);
	      BX.ajax.runAction('up:quiz.question.setQuestion', {
	        data: {
	          question: this.question
	        }
	      }).then(function (response) {
	        var curr = _this3.questions.find(function (item) {
	          return item.ID == _this3.currentQuestionId;
	        });
	        if (curr) {
	          curr.QUESTION_TEXT = _this3.question.QUESTION_TEXT;
	        }
	        _this3.render();
	        alert('Данные о вопросе успешно сохранены!');
	      })["catch"](function (error) {
	        console.error(error);
	      });
	    }
	  }, {
	    key: "createQuestion",
	    value: function createQuestion() {
	      var _this4 = this;
	      BX.ajax.runAction('up:quiz.question.createQuestion', {
	        data: {
	          quizId: this.quizId
	        }
	      }).then(function (response) {
	        _this4.currentQuestionId = response.data.newQuestion.ID;
	        _this4.questions.push(response.data.newQuestion);
	        _this4.getQuestion(_this4.currentQuestionId);
	        _this4.render();
	      })["catch"](function (error) {
	        console.error(error);
	      });
	    }
	  }, {
	    key: "deleteQuestion",
	    value: function deleteQuestion(id) {
	      var _this5 = this;
	      BX.ajax.runAction('up:quiz.question.deleteQuestion', {
	        data: {
	          id: id,
	          quizId: this.quizId
	        }
	      }).then(function (response) {
	        if (response.data != null) {
	          console.error('errors:', response.data);
	        } else {
	          _this5.reload();
	        }
	      })["catch"](function (error) {
	        console.error(error);
	      });
	    }
	  }, {
	    key: "getQuestion",
	    value: function getQuestion(id) {
	      var _this6 = this;
	      this.loadQuestion(id).then(function (question) {
	        _this6.question = question;
	        _this6.render();
	      });
	    }
	  }, {
	    key: "reload",
	    value: function reload() {
	      var _this7 = this;
	      this.loadQuiz().then(function (quiz) {
	        _this7.quiz = quiz;
	        _this7.loadQuestions().then(function (questions) {
	          _this7.questions = questions;
	          if (_this7.questions.length === 0) {
	            _this7.createQuestion();
	            _this7.reload();
	          } else {
	            _this7.currentQuestionId = _this7.questions[0].ID;
	            _this7.loadQuestion(_this7.currentQuestionId).then(function (question) {
	              _this7.question = question;
	              _this7.render();
	            });
	          }
	        });
	      });
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      this.rootNode.innerHTML = "";
	      this.rootNode.appendChild(this.getQuestionListNode());
	      this.rootNode.appendChild(this.getQuestionPreviewNode());
	      this.rootNode.appendChild(this.getQuestionSettingsNode());
	    }
	  }, {
	    key: "renderPreview",
	    value: function renderPreview() {
	      document.getElementById('preview').replaceWith(this.getQuestionPreviewNode());
	    }
	  }, {
	    key: "renderSettings",
	    value: function renderSettings() {
	      document.getElementById('settings').replaceWith(this.getQuestionSettingsNode());
	    }
	  }, {
	    key: "renderQuestionList",
	    value: function renderQuestionList() {
	      document.getElementById('questions').replaceWith(this.getQuestionSettingsNode());
	    }
	  }, {
	    key: "getQuestionListNode",
	    value: function getQuestionListNode() {
	      var _this8 = this;
	      var QuestionsContainer = main_core.Tag.render(_templateObject || (_templateObject = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<div class=\"question-list__questions\" id=\"questions\">\n\t\t\t</div>\n\t\t"])));
	      this.questions.forEach(function (questionData) {
	        var questionCard = main_core.Tag.render(_templateObject2 || (_templateObject2 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t\t<div class=\"question-list__question-container\"></div>\n\t\t\t"])));
	        var questionButton = main_core.Tag.render(_templateObject3 || (_templateObject3 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t\t<div class=\"question-list__question button\" data-id=\"", "\">\n\t\t\t\t\t", "\n\t\t\t\t</div>\n\t\t\t"])), main_core.Text.encode(questionData.ID), main_core.Text.encode(questionData.QUESTION_TEXT));
	        var questionDeleteButton = main_core.Tag.render(_templateObject4 || (_templateObject4 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t\t<a class=\"question-list__question-delete button\">\n\t\t\t\t\t<i class=\"fa-solid fa-trash\"></i>\n\t\t\t\t</a>\n\t\t\t"])));
	        questionButton.onclick = function () {
	          _this8.getQuestion(+questionData.ID);
	          _this8.currentQuestionId = +questionData.ID;
	        };
	        questionDeleteButton.onclick = function () {
	          _this8.deleteQuestion(+questionData.ID);
	        };
	        questionCard.appendChild(questionButton);
	        questionCard.appendChild(questionDeleteButton);
	        QuestionsContainer.appendChild(questionCard);
	      });
	      var AddNewQuestionButton = main_core.Tag.render(_templateObject5 || (_templateObject5 = babelHelpers.taggedTemplateLiteral(["<a class=\"button question_list__add-btn\">+</a>"])));
	      AddNewQuestionButton.onclick = function () {
	        _this8.createQuestion();
	      };
	      QuestionsContainer.appendChild(AddNewQuestionButton);
	      return main_core.Tag.render(_templateObject6 || (_templateObject6 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<div class=\"column is-one-fifth question-list\">\n\t\t\t\t<div class=\"question-list__title\">", "</div>\n\t\t\t\t", "\n\t\t\t</div>\n\t\t"])), main_core.Loc.getMessage('UP_QUIZ_EDIT_QUESTIONS'), QuestionsContainer);
	    }
	  }, {
	    key: "getQuestionPreviewNode",
	    value: function getQuestionPreviewNode() {
	      var PreviewContainerNode = main_core.Tag.render(_templateObject7 || (_templateObject7 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<div class=\"column is-three-fifths question-preview\" id=\"preview\">\n\t\t\t\t<div class=\"question-preview__title\">", "</div>\n\t\t\t\t<div class=\"box\">\n\t\t\t\t\t<h3 class=\"title question-preview__question-text\" id=\"questionTextPreview\">", "</h3>\n\t\t\t\t\t\t<div id=\"questionPreviewContainer\"></div>\n\t\t\t\t\t<a class=\"button is-success\">", "</a>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"box\" id=\"displayTypePreview\">\n\t\t\t\t\t<h3 class=\"title\">", ":</h3>\n\t\t\t\t\t<div id=\"chartPreviewContainer\">\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t"])), main_core.Loc.getMessage('UP_QUIZ_EDIT_PREVIEW'), main_core.Text.encode(this.question.QUESTION_TEXT), main_core.Loc.getMessage('UP_QUIZ_EDIT_SEND'), main_core.Loc.getMessage('UP_QUIZ_EDIT_QUIZ_RESULT'));
	      var AnswerPreviewContainer = PreviewContainerNode.querySelector('#questionPreviewContainer');
	      if (this.question.OPTIONS != null && this.question.OPTIONS != 'undefinded' && this.question.OPTIONS != '') {
	        var options = JSON.parse(this.question.OPTIONS);
	        for (var i = 0; i < options.length; i++) {
	          var AnswerPreview = main_core.Tag.render(_templateObject8 || (_templateObject8 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t\t\t<label class=\"radio\"><input type=\"radio\">\n\t\t\t\t\t\t", "\n\t\t\t\t\t</label>\n\t\t\t\t"])), main_core.Text.encode(options[i]));
	          AnswerPreviewContainer.appendChild(AnswerPreview);
	        }
	      } else {
	        AnswerPreviewContainer.appendChild(main_core.Tag.render(_templateObject9 || (_templateObject9 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t\t<input type=\"text\" class=\"input\" placeholder=\"", "\" id=\"freePreview\">\n\t\t\t"])), main_core.Loc.getMessage('UP_QUIZ_EDIT_ENTER_ANSWER')));
	      }
	      var DisplayPreviewContainer = PreviewContainerNode.querySelector('#chartPreviewContainer');
	      var question_display_id = this.question.QUESTION_DISPLAY_ID;
	      var DisplayPreviewNode = main_core.Tag.render(_templateObject10 || (_templateObject10 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<div id=\"\">\n\t\t\t\t", "\n\t\t\t</div>\n\t\t"])), main_core.Text.encode(this.DISPLAY_TYPES[question_display_id]));
	      DisplayPreviewContainer.appendChild(DisplayPreviewNode);
	      return PreviewContainerNode;
	    }
	  }, {
	    key: "getQuestionSettingsNode",
	    value: function getQuestionSettingsNode() {
	      var _this9 = this;
	      console.log(this.question);
	      var SettingsContainerNode = main_core.Tag.render(_templateObject11 || (_templateObject11 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<div class=\"column question-settings\" id=\"settings\">\n\t\t\t\t<div class=\"question-settings__title\">", "</div>\n\t\t\t\t\n\t\t\t\t<div class=\"question-settings__input-title\">", ":</div>\n\t\t\t\t<input value=\"", "\" class=\"input\" type=\"text\" placeholder=\"", "\" name=\"questionText\" id=\"questionText\">\n\t\t\t\t\n\t\t\t\t<div class=\"question-settings__input-title\">", ":</div>\n\t\t\t\t<select class=\"select\" name=\"questionType\" id=\"questionType\">\n\t\t\t\t\t<option value=\"0\" ", ">", "</option>\n\t\t\t\t\t<option value=\"1\" ", ">", "</option>\n\t\t\t\t</select>\n\t\t\t\t\n\t\t\t\t<div class=\"question-settings__selectable-answers ", "\" id=\"selectableAnswers\">\n\t\t\t\t\t<div class=\"question-settings__input-title\">", ":</div>\n\t\t\t\t\t<div class=\"question-settings__answers-container\" id=\"answersContainer\">\n\t\t\t\t\t</div>\n\t\t\t\t\t<a class=\"button\" id=\"addAnswerButton\">\n\t\t\t\t\t\t<i class=\"fa-solid fa-plus \"></i>\n\t\t\t\t\t</a>\n\t\t\t\t</div>\n\t\t\t\t\n\t\t\t\t<div class=\"question-settings__input-title\">", ":</div>\n\t\t\t\t<select name=\"displayType\" id=\"displayType\">\n\t\t\t\t\t<option value=\"0\" ", ">", "</option>\n\t\t\t\t\t<option value=\"1\" ", ">", "</option>\n\t\t\t\t\t<option value=\"2\" ", ">", "</option>\n\t\t\t\t\t<option value=\"3\" ", ">", "</option>\n\t\t\t\t</select>\n\t\t\t\t<button type=\"submit\" class=\"button is-success\" id=\"save-question-button\">", "</button>\n\t\t\t</div>\n\t\t"])), main_core.Loc.getMessage('UP_QUIZ_EDIT_SETTINGS'), main_core.Loc.getMessage('UP_QUIZ_EDIT_QUESTION_TEXT'), main_core.Text.encode(this.question.QUESTION_TEXT), main_core.Loc.getMessage('UP_QUIZ_EDIT_ENTER_QUESTION'), main_core.Loc.getMessage('UP_QUIZ_EDIT_ANSWER_TYPE'), +this.question.QUESTION_TYPE_ID === 0 ? 'selected' : '', main_core.Loc.getMessage('UP_QUIZ_EDIT_OPEN_ANSWER'), +this.question.QUESTION_TYPE_ID === 1 ? 'selected' : '', main_core.Loc.getMessage('UP_QUIZ_EDIT_SELECT_OPTION'), +this.question.QUESTION_TYPE_ID !== 1 ? 'hidden' : '', main_core.Loc.getMessage('UP_QUIZ_EDIT_ANSWER_OPTIONS'), main_core.Loc.getMessage('UP_QUIZ_EDIT_TYPE_OF_VIEW_TYPE'), this.question.QUESTION_DISPLAY_ID == 0 ? 'selected' : '', main_core.Text.encode(this.DISPLAY_TYPES[0]), this.question.QUESTION_DISPLAY_ID == 1 ? 'selected' : '', main_core.Text.encode(this.DISPLAY_TYPES[1]), this.question.QUESTION_DISPLAY_ID == 2 ? 'selected' : '', main_core.Text.encode(this.DISPLAY_TYPES[2]), this.question.QUESTION_DISPLAY_ID == 3 ? 'selected' : '', main_core.Text.encode(this.DISPLAY_TYPES[3]), main_core.Loc.getMessage('UP_QUIZ_EDIT_SAVE'));
	      if (this.question.OPTIONS != null && this.question.OPTIONS != 'undefinded' && this.question.OPTIONS != '') {
	        var options = JSON.parse(this.question.OPTIONS);
	        var _loop = function _loop(i) {
	          var answerInputsContainer = SettingsContainerNode.querySelector('#answersContainer');
	          var AnswerInput = main_core.Tag.render(_templateObject12 || (_templateObject12 = babelHelpers.taggedTemplateLiteral(["<input type=\"text\" class=\"question-settings__answer input\" name=\"selectableAnswer\" value=\"", "\">"])), main_core.Text.encode(options[i]));
	          var AnswerDelete = main_core.Tag.render(_templateObject13 || (_templateObject13 = babelHelpers.taggedTemplateLiteral(["<a class=\"button is-danger\"><i class=\"fa-solid fa-trash\"></i></a>"])));
	          AnswerDelete.onclick = function () {
	            _this9.deleteAnswer(i);
	          };
	          var AnswerInputNode = main_core.Tag.render(_templateObject14 || (_templateObject14 = babelHelpers.taggedTemplateLiteral(["<div class=\"question-settings__answer-inputs\">\n\t\t\t\t\t", "\n\t\t\t\t\t", "\n\t\t\t\t</div>"])), AnswerInput, AnswerDelete);
	          answerInputsContainer.appendChild(AnswerInputNode);
	        };
	        for (var i = 0; i < options.length; i++) {
	          _loop(i);
	        }
	      }
	      SettingsContainerNode.querySelector('#addAnswerButton').onclick = function () {
	        var answerInputsContainer = SettingsContainerNode.querySelector('#answersContainer');
	        var currentAnswerCount = answerInputsContainer.childElementCount;
	        var AnswerInput = main_core.Tag.render(_templateObject15 || (_templateObject15 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t\t<input type=\"text\" class=\"question-settings__answer input\" name=\"selectableAnswer\" value=\"", " ", "\">\n\t\t\t"])), main_core.Loc.getMessage('UP_QUIZ_EDIT_OPTION'), currentAnswerCount + 1);
	        var AnswerDelete = main_core.Tag.render(_templateObject16 || (_templateObject16 = babelHelpers.taggedTemplateLiteral(["<a class=\"button is-danger\"><i class=\"fa-solid fa-trash\"></i></a>"])));
	        var options = JSON.parse(_this9.question.OPTIONS);
	        AnswerDelete.onclick = function () {
	          _this9.deleteAnswer(options.length);
	        };
	        var newAnswerInput = main_core.Tag.render(_templateObject17 || (_templateObject17 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t\t<div class=\"question-settings__answer-inputs\">\n\t\t\t\t\t", "\n\t\t\t\t\t", "\n\t\t\t\t</div>\n\t\t\t"])), AnswerInput, AnswerDelete);
	        answerInputsContainer.appendChild(newAnswerInput);
	        _this9.changeQuestion();
	      };
	      SettingsContainerNode.oninput = function () {
	        _this9.changeQuestion();
	      };
	      SettingsContainerNode.querySelector('#save-question-button').onclick = function () {
	        _this9.saveQuestion();
	      };
	      return SettingsContainerNode;
	    }
	  }, {
	    key: "changeQuestion",
	    value: function changeQuestion() {
	      var questionTextInput = document.getElementById('questionText');
	      this.question.QUESTION_TEXT = questionTextInput.value;
	      var questionTypeInput = document.getElementById('questionType');
	      this.question.QUESTION_TYPE_ID = questionTypeInput.value;
	      var selectableAnswers = document.getElementById('selectableAnswers');
	      if (+this.question.QUESTION_TYPE_ID === 1) {
	        selectableAnswers.classList.remove("hidden");
	        var answerInputs = document.querySelectorAll('.question-settings__answer');
	        var answerValues = Array.from(answerInputs, function (input) {
	          return input.value;
	        });
	        this.question.OPTIONS = JSON.stringify(answerValues);
	      } else {
	        selectableAnswers.classList.add("hidden");
	        this.question.OPTIONS = null;
	      }
	      var displayTypeInput = document.getElementById('displayType');
	      this.question.QUESTION_DISPLAY_ID = displayTypeInput.value;
	      this.renderPreview();
	    }
	  }, {
	    key: "deleteAnswer",
	    value: function deleteAnswer(AnswerPosition) {
	      var options = JSON.parse(this.question.OPTIONS);
	      options.splice(AnswerPosition, 1);
	      this.question.OPTIONS = JSON.stringify(options);
	      this.renderSettings();
	      this.renderPreview();
	    }
	  }]);
	  return QuizEdit;
	}();

	exports.QuizEdit = QuizEdit;

}((this.Up.Quiz = this.Up.Quiz || {}),BX));
