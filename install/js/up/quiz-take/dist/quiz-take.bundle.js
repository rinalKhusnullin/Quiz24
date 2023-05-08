this.Up = this.Up || {};
(function (exports,main_core) {
	'use strict';

	var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject10;
	var QuizTake = /*#__PURE__*/function () {
	  function QuizTake() {
	    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    babelHelpers.classCallCheck(this, QuizTake);
	    this.quizCode = options.quizCode;
	    if (main_core.Type.isStringFilled(options.rootNodeId)) {
	      this.rootNodeId = options.rootNodeId;
	    } else {
	      throw new Error('QuizTake: options.rootNodeId required');
	    }
	    this.rootNode = document.getElementById(this.rootNodeId);
	    if (!this.rootNode) {
	      throw new Error("QuizTake: element with id \"".concat(this.rootNodeId, "\" not found"));
	    }
	    this.questions = []; // Все вопросы : title, id
	    this.reload();
	  }
	  babelHelpers.createClass(QuizTake, [{
	    key: "reload",
	    value: function reload() {
	      var _this = this;
	      this.loadQuiz().then(function (quiz) {
	        if (quiz === false) {
	          _this.rootNode.innerHTML = "";
	          _this.rootNode.appendChild(Up.Quiz.QuizErrorManager.getQuizNotFoundError());
	          return;
	        }
	        if (+quiz.IS_ACTIVE === 0) {
	          _this.rootNode.innerHTML = "";
	          _this.rootNode.appendChild(Up.Quiz.QuizErrorManager.getQuizNotAvailableError());
	          return;
	        }
	        _this.quiz = quiz;
	        _this.loadQuestions().then(function (questions) {
	          if (questions.length === 0) {
	            _this.rootNode.innerHTML = '';
	            _this.rootNode.appendChild(Up.Quiz.QuizErrorManager.getNotQuestionsError());
	            return;
	          }
	          _this.questions = questions;
	          _this.currentQuestionId = questions[0].ID;
	          _this.loadQuestion(_this.currentQuestionId).then(function (question) {
	            _this.question = question;
	            _this.render();
	          });
	        });
	      });
	    }
	  }, {
	    key: "loadQuiz",
	    value: function loadQuiz() {
	      var _this2 = this;
	      return new Promise(function (resolve, reject) {
	        BX.ajax.runAction('up:quiz.quiz.getQuizByCode', {
	          data: {
	            code: _this2.quizCode
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
	      var _this3 = this;
	      return new Promise(function (resolve, reject) {
	        BX.ajax.runAction('up:quiz.question.getQuestions', {
	          data: {
	            quizId: _this3.quiz.ID
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
	    key: "render",
	    value: function render() {
	      this.rootNode.innerHTML = "";
	      var QuizHeroSection = main_core.Tag.render(_templateObject || (_templateObject = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<section class=\"hero is-small is-primary\">\n\t\t\t\t<div class=\"hero-body\">\n\t\t\t\t\t<p class=\"title mb-0\">\n\t\t\t\t\t\t", "#", "\n\t\t\t\t\t</p>\n\t\t\t\t</div>\n\t\t\t</section>\n\t\t"])), main_core.Text.encode(this.quiz.TITLE), main_core.Text.encode(this.quiz.CODE));
	      this.rootNode.appendChild(QuizHeroSection);
	      var QuestionForm = this.getQuestionForm();
	      this.rootNode.appendChild(QuestionForm);
	    }
	  }, {
	    key: "getQuestionForm",
	    value: function getQuestionForm() {
	      var _this4 = this;
	      var QuestionFormNode = main_core.Tag.render(_templateObject2 || (_templateObject2 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<div class=\"question-form__container box\" id=\"question-form\">\n\t\t\t\t<h1 class=\"subtitle is-4 mb-2\">", "</h1>\n\t\t\t</div>"])), main_core.Text.encode(this.question.QUESTION_TEXT));
	      if (+this.question.QUESTION_TYPE_ID === 0) {
	        var QuestionTypeInput = main_core.Tag.render(_templateObject3 || (_templateObject3 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t\t<input type=\"text\" class=\"input question-form__input\" placeholder=\"", "\">"])), main_core.Loc.getMessage('UP_QUIZ_TAKE_OPEN_ANSWER'));
	        QuestionFormNode.appendChild(QuestionTypeInput);
	      } else if (+this.question.QUESTION_TYPE_ID === 1) {
	        var AnswerContainer = main_core.Tag.render(_templateObject4 || (_templateObject4 = babelHelpers.taggedTemplateLiteral(["<div class=\"control\"></div>"])));
	        if (this.question.OPTIONS != null && this.question.OPTIONS !== 'undefined' && this.question.OPTIONS !== '') {
	          var options = JSON.parse(this.question.OPTIONS);
	          for (var i = 0; i < options.length; i++) {
	            var Answer = main_core.Tag.render(_templateObject5 || (_templateObject5 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t\t\t<label class=\"radio\">\n\t\t\t\t\t\t<input class=\"option-input radio\" type=\"radio\" name=\"questionAnswer\" value=\"", "\">\n\t\t\t\t\t\t", "\n\t\t\t\t\t</label>\n\t\t\t\t"])), main_core.Text.encode(options[i]), main_core.Text.encode(options[i]));
	            AnswerContainer.appendChild(Answer);
	          }
	        }
	        QuestionFormNode.appendChild(main_core.Tag.render(_templateObject6 || (_templateObject6 = babelHelpers.taggedTemplateLiteral(["<div class=\"field\">\n\t\t\t\t", "\n\t\t\t</div>"])), AnswerContainer));
	      }
	      QuestionFormNode.appendChild(main_core.Tag.render(_templateObject7 || (_templateObject7 = babelHelpers.taggedTemplateLiteral(["<p class=\"help is-danger\" id=\"answer-helper\"></p>"]))));
	      var SendButton = main_core.Tag.render(_templateObject8 || (_templateObject8 = babelHelpers.taggedTemplateLiteral(["<button class=\"button question-form__button is-success mt-4\">", "</button>"])), main_core.Loc.getMessage('UP_QUIZ_TAKE_SEND'));
	      SendButton.onclick = function () {
	        var answer = '';
	        if (+_this4.question.QUESTION_TYPE_ID === 0) {
	          var AnswerInput = QuestionFormNode.querySelector('.question-form__input');
	          answer = AnswerInput.value;
	        } else if (+_this4.question.QUESTION_TYPE_ID === 1) {
	          var radios = QuestionFormNode.querySelectorAll('input[type="radio"]');
	          for (var _i = 0; _i < radios.length; _i++) {
	            if (radios[_i].checked) {
	              answer = radios[_i].value;
	              break;
	            }
	          }
	        }
	        SendButton.classList.add('is-loading');
	        _this4.sendAnswer(_this4.question.ID, answer).then(function (success) {
	          _this4.questions.shift();
	          if (+_this4.questions.length === 0) {
	            _this4.renderCompletely();
	          } else {
	            _this4.currentQuestionId = _this4.questions[0].ID;
	            _this4.loadQuestion(_this4.currentQuestionId).then(function (question) {
	              _this4.question = question;
	              _this4.renderQuestion();
	            });
	          }
	        }, function (error) {
	          var errorCode = error.errors[0].code;
	          if (errorCode === 'inactive_quiz') {
	            location.reload();
	            return;
	          }
	          document.getElementById('answer-helper').textContent = Up.Quiz.QuizErrorManager.getMessage(errorCode);
	          SendButton.classList.remove('is-loading');
	        });
	      };
	      QuestionFormNode.appendChild(SendButton);
	      return QuestionFormNode;
	    }
	  }, {
	    key: "sendAnswer",
	    value: function sendAnswer(questionId, answer) {
	      return new Promise(function (resolve, reject) {
	        BX.ajax.runAction('up:quiz.answer.createAnswer', {
	          data: {
	            questionId: questionId,
	            answer: answer
	          }
	        }).then(function (response) {
	          console.log(response);
	          resolve(response);
	        })["catch"](function (error) {
	          console.error(error);
	          reject(error);
	        });
	      });
	    }
	  }, {
	    key: "renderQuestion",
	    value: function renderQuestion() {
	      document.getElementById('question-form').replaceWith(this.getQuestionForm());
	    }
	  }, {
	    key: "renderCompletely",
	    value: function renderCompletely() {
	      this.rootNode.innerHTML = "";
	      this.rootNode.appendChild(main_core.Tag.render(_templateObject9 || (_templateObject9 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<section class=\"hero is-small is-primary\">\n\t\t\t\t<div class=\"hero-body\">\n\t\t\t\t\t<p class=\"title mb-0\">\n\t\t\t\t\t\t", "#", "\n\t\t\t\t\t</p>\n\t\t\t\t</div>\n\t\t\t</section>\n\t\t"])), main_core.Text.encode(this.quiz.TITLE), main_core.Text.encode(this.quiz.CODE)));
	      this.rootNode.appendChild(main_core.Tag.render(_templateObject10 || (_templateObject10 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<div class=\"question-form__container box\" id=\"question-form\">\n\t\t\t\t<h1 class=\"subtitle is-4 mb-2\">", "</h1>\n\t\t\t</div>"])), main_core.Loc.getMessage('UP_QUIZ_TAKE_YOU_ANSWERED_ALL_THE_QUESTIONS')));
	    }
	  }]);
	  return QuizTake;
	}();

	exports.QuizTake = QuizTake;

}((this.Up.Quiz = this.Up.Quiz || {}),BX));
