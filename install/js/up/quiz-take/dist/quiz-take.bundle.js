this.Up = this.Up || {};
(function (exports,main_core) {
	'use strict';

	var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7;
	var QuizTake = /*#__PURE__*/function () {
	  function QuizTake() {
	    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    babelHelpers.classCallCheck(this, QuizTake);
	    //VALIDATE QUIZ_ID !
	    this.quizId = options.quizId;
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
	        console.log(quiz);
	        if (quiz == null) {
	          alert('TODO : ЕСЛИ QUIZ НЕ НАЙДЕН');
	        } else if (+quiz.IS_ACTIVE === 0) {
	          alert('TODO : ЕСЛИ QUIZ ЗАКРЫТ ДЛЯ ПРОХОЖДЕНИЯ');
	        } else {
	          _this.quiz = quiz;
	          _this.loadQuestions().then(function (questions) {
	            if (questions.length === 0) {
	              alert('TODO: ЕСЛИ ВОПРОСОВ НЕТ');
	            } else {
	              _this.questions = questions;
	              _this.currentQuestionId = questions[0].ID;
	              _this.loadQuestion(_this.currentQuestionId).then(function (question) {
	                _this.question = question;
	                _this.render();
	              });
	            }
	          });
	        }
	      });
	    }
	  }, {
	    key: "loadQuiz",
	    value: function loadQuiz() {
	      var _this2 = this;
	      return new Promise(function (resolve, reject) {
	        BX.ajax.runAction('up:quiz.quiz.getQuiz', {
	          data: {
	            id: _this2.quizId
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
	            quizId: _this3.quizId
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
	      var QuizHeroSection = main_core.Tag.render(_templateObject || (_templateObject = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<section class=\"hero is-small is-primary\">\n\t\t\t\t<div class=\"hero-body\">\n\t\t\t\t\t<p class=\"title mb-0\">\n\t\t\t\t\t\t", "#", "\n\t\t\t\t\t</p>\n\t\t\t\t</div>\n\t\t\t</section>\n\t\t"])), this.quiz.TITLE, this.quiz.CODE);
	      this.rootNode.appendChild(QuizHeroSection);
	      var QuestionForm = this.getQuestionForm();
	      this.rootNode.appendChild(QuestionForm);
	    }
	  }, {
	    key: "getQuestionForm",
	    value: function getQuestionForm() {
	      var _this4 = this;
	      var QuestionFormNode = main_core.Tag.render(_templateObject2 || (_templateObject2 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<div class=\"question-form__container box\" id=\"question-form\">\n\t\t\t\t<h1 class=\"subtitle is-4\">", "</h1>\n\t\t\t</div>"])), this.question.QUESTION_TEXT);
	      if (+this.question.QUESTION_TYPE_ID === 0) {
	        var QuestionTypeInput = main_core.Tag.render(_templateObject3 || (_templateObject3 = babelHelpers.taggedTemplateLiteral(["<input type=\"text\" class=\"input question-form__input\" placeholder=\"\u0421\u0432\u043E\u0431\u043E\u0434\u043D\u044B\u0439 \u043E\u0442\u0432\u0435\u0442\">"])));
	        QuestionFormNode.appendChild(QuestionTypeInput);
	      } else if (+this.question.QUESTION_TYPE_ID === 1) {
	        var AnswerContainer = main_core.Tag.render(_templateObject4 || (_templateObject4 = babelHelpers.taggedTemplateLiteral(["<div class=\"control\"></div>"])));
	        if (this.question.OPTIONS != null && this.question.OPTIONS !== 'undefined' && this.question.OPTIONS !== '') {
	          var options = JSON.parse(this.question.OPTIONS);
	          for (var i = 0; i < options.length; i++) {
	            var Answer = main_core.Tag.render(_templateObject5 || (_templateObject5 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t\t\t<label class=\"radio\">\n\t\t\t\t\t\t<input type=\"radio\" name=\"questionAnswer\" value=\"", "\">\n\t\t\t\t\t\t", "\n\t\t\t\t\t</label>\n\t\t\t\t"])), options[i], options[i]);
	            AnswerContainer.appendChild(Answer);
	          }
	        }
	        QuestionFormNode.appendChild(main_core.Tag.render(_templateObject6 || (_templateObject6 = babelHelpers.taggedTemplateLiteral(["<div class=\"field\">", "</div>"])), AnswerContainer));
	      }
	      var SendButton = main_core.Tag.render(_templateObject7 || (_templateObject7 = babelHelpers.taggedTemplateLiteral(["<button class=\"button question-form__button\">\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C</button>"])));
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
	        _this4.sendAnswer(_this4.question.ID, answer);
	      };
	      QuestionFormNode.appendChild(SendButton);
	      return QuestionFormNode;
	    }
	  }, {
	    key: "sendAnswer",
	    value: function sendAnswer(questionId, answer) {
	      var _this5 = this;
	      this.questions.shift();
	      BX.ajax.runAction('up:quiz.answer.createAnswer', {
	        data: {
	          questionId: questionId,
	          answer: answer
	        }
	      }).then(function (response) {
	        console.log(response.data);
	        if (+_this5.questions.length === 0) {
	          _this5.renderCompletely();
	        } else {
	          _this5.currentQuestionId = _this5.questions[0].ID;
	          _this5.loadQuestion(_this5.currentQuestionId).then(function (question) {
	            _this5.question = question;
	            _this5.renderQuestion();
	          });
	        }
	      })["catch"](function (error) {
	        console.error(error);
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
	      this.rootNode.textContent = "Вы ответили на все вопросы!";
	    }
	  }]);
	  return QuizTake;
	}();

	exports.QuizTake = QuizTake;

}((this.Up.Quiz = this.Up.Quiz || {}),BX));
