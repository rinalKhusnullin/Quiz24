this.Up = this.Up || {};
(function (exports,main_core) {
	'use strict';

	var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5;
	var QuizShow = /*#__PURE__*/function () {
	  function QuizShow() {
	    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    babelHelpers.classCallCheck(this, QuizShow);
	    this.quizId = options.quizId;
	    if (main_core.Type.isStringFilled(options.rootNodeId)) {
	      this.rootNodeId = options.rootNodeId;
	    } else {
	      throw new Error('QuizShow: options.rootNodeId required');
	    }
	    this.rootNode = document.getElementById(this.rootNodeId);
	    if (!this.rootNode) {
	      throw new Error("QuizShow: element with id \"".concat(this.rootNodeId, "\" not found"));
	    }
	    this.questions = []; // Все вопросы : title, id
	    this.currentQuestionId = 1; // Текущий id вопроса
	    this.reload();
	  }
	  babelHelpers.createClass(QuizShow, [{
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
	    key: "reload",
	    value: function reload() {
	      var _this3 = this;
	      this.loadQuiz().then(function (quiz) {
	        _this3.Quiz = quiz;
	        _this3.loadQuestions().then(function (questions) {
	          _this3.questions = questions;
	          _this3.loadQuestion(_this3.currentQuestionId).then(function (question) {
	            _this3.question = question;
	          });
	          _this3.render();
	        });
	      });
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      console.log(this);
	      this.rootNode.innerHTML = "";
	      var QuizHeroSection = main_core.Tag.render(_templateObject || (_templateObject = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<section class=\"hero is-small is-primary\">\n\t\t\t\t<div class=\"hero-body\">\n\t\t\t\t\t<p class=\"title mb-0\">\n\t\t\t\t\t\t", "#", "\n\t\t\t\t\t</p>\n\t\t\t\t\t<button class=\"button\">\n\t\t\t\t\t\t<i class=\"fa-solid fa-qrcode\"></i>\n\t\t\t\t\t</button>\n\t\t\t\t</div>\n\t\t\t</section>\n\t\t"])), this.Quiz.TITLE, this.Quiz.CODE);
	      var QuizResultContent = main_core.Tag.render(_templateObject2 || (_templateObject2 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<div class=\"box\">\n\t\t\t\t<div class=\"columns\">\n\t\t\t\t\t<div class=\"column is-one-quarter question-list\">\n\t\t\t\t\t\t<div class=\"question-list__title has-text-weight-semibold has-text-centered is-uppercase\">\u0412\u043E\u043F\u0440\u043E\u0441</div>\n\t\t\t\t\t\t", "\n\t\t\t\t\t</div>\n\t\t\t\t\t\t", "\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t"])), this.getQuestionsListNode(), this.getQuestionResultNode());
	      this.rootNode.append(QuizHeroSection, QuizResultContent);
	    }
	  }, {
	    key: "getQuestionsListNode",
	    value: function getQuestionsListNode() {
	      var QuestionListNode = main_core.Tag.render(_templateObject3 || (_templateObject3 = babelHelpers.taggedTemplateLiteral(["<div class=\"question-list__questions\"></div>"])));
	      this.questions.forEach(function (question) {
	        var QuestionNode = main_core.Tag.render(_templateObject4 || (_templateObject4 = babelHelpers.taggedTemplateLiteral(["<a class=\"question-list__question button\">", "</a>"])), question.QUESTION_TEXT);
	        // QuestionNode.onclick = this.renderQuestionResult(+question.ID);
	        QuestionListNode.appendChild(QuestionNode);
	      });
	      return QuestionListNode;
	    }
	  }, {
	    key: "getQuestionResultNode",
	    value: function getQuestionResultNode() {
	      console.log(this);
	      console.log(this.question);
	      var QuestionResultNode = main_core.Tag.render(_templateObject5 || (_templateObject5 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<div class=\" column is-three-quarters statistics\" id=\"questionResult\">\n\t\t\t\t<div class=\"statistics__title has-text-weight-semibold has-text-centered is-uppercase\">\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430</div>\n\t\t\t\t<div class=\"statistics__question-title\">\n\t\t\t\t\t<strong>\u0412\u043E\u043F\u0440\u043E\u0441 : </strong>\n\t\t\t\t\t", "\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<canvas id=\"myChart\"></canvas>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t"])), this.question.QUESTION_TEXT);
	      return QuestionResultNode;
	    }
	  }, {
	    key: "renderQuestionResult",
	    value: function renderQuestionResult(questionId) {
	      // alert(1);
	      // this.loadQuestion(questionId).then(question =>{
	      // 	this.question = question;
	      // });
	      // document.getElementById('questionResult').innerHTML = this.getQuestionResultNode();
	      //
	      // return false;
	    }
	  }]);
	  return QuizShow;
	}();

	exports.QuizShow = QuizShow;

}((this.Up.Quiz = this.Up.Quiz || {}),BX));
