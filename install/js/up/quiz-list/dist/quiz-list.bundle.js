this.Up = this.Up || {};
(function (exports,main_core) {
	'use strict';

	var _templateObject, _templateObject2;
	var QuizList = /*#__PURE__*/function () {
	  function QuizList() {
	    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    babelHelpers.classCallCheck(this, QuizList);
	    if (main_core.Type.isStringFilled(options.rootNodeId)) {
	      this.rootNodeId = options.rootNodeId;
	    } else {
	      throw new Error('QuizList: options.rootNodeId required');
	    }
	    this.rootNode = document.getElementById(this.rootNodeId);
	    if (!this.rootNode) {
	      throw new Error("QuizList: element with id \"".concat(this.rootNodeId, "\" not found"));
	    }
	    this.quizList = [];
	    this.reload();
	  }
	  babelHelpers.createClass(QuizList, [{
	    key: "reload",
	    value: function reload() {
	      var _this = this;
	      this.loadList().then(function (quizList) {
	        _this.quizList = quizList;
	        _this.render();
	      });
	    }
	  }, {
	    key: "loadList",
	    value: function loadList() {
	      return new Promise(function (resolve, reject) {
	        BX.ajax.runAction('up:quiz.quiz.getList').then(function (response) {
	          var quizList = response.data.quizList;
	          resolve(quizList);
	        })["catch"](function (error) {
	          console.error(error);
	          reject(error);
	        });
	      });
	    }
	  }, {
	    key: "createQuiz",
	    value: function createQuiz(title) {
	      var _this2 = this;
	      var UserId = 1;
	      BX.ajax.runAction('up:quiz.quiz.createQuiz', {
	        data: {
	          title: title,
	          id: UserId
	        }
	      }).then(function (response) {
	        if (response.data != null) {
	          //check response
	          console.error('errors:', response.data);
	        } else {
	          _this2.reload();
	        }
	      })["catch"](function (error) {
	        console.error(error);
	      });
	    }
	  }, {
	    key: "deleteQuiz",
	    value: function deleteQuiz(id) {
	      var _this3 = this;
	      BX.ajax.runAction('up:quiz.quiz.deleteQuiz', {
	        data: {
	          id: id
	        }
	      }).then(function (response) {
	        if (response.data != null) {
	          console.error('errors:', response.data);
	        } else {
	          _this3.reload();
	        }
	      })["catch"](function (error) {
	        console.error(error);
	      });
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      var _this4 = this;
	      this.rootNode.innerHTML = "";
	      var QuizContainerNode = main_core.Tag.render(_templateObject || (_templateObject = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<div class=\"quiz-container\">\n\t\t\t\t<div class=\"quiz-card quiz-card__add-new\">\n\t\t\t\t\t<a class=\"is-success is-button quiz-card__new-quiz-btn\" id=\"quiz-card__new-quiz-btn\">\n\t\t\t\t\t\t<i class=\"fa-solid fa-plus\"></i>\n\t\t\t\t\t</a>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t"])));
	      this.quizList.forEach(function (QuizData) {
	        var QuizCard = main_core.Tag.render(_templateObject2 || (_templateObject2 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t\t<div class=\"quiz-card\" data-quiz-id=\"", "\">\n\t\t\t\t\t<div class=\"quiz-card__header\"></div>\n\t\t\t\t\t\t<div class=\"quiz-card__content\">\n\t\t\t\t\t\t\t<div class=\"quiz-card__title\">\n\t\t\t\t\t\t\t\t<strong class=\"quiz-card__subtitle is-family-monospace\">\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435:</strong>\n\t\t\t\t\t\t\t\t<div class=\"quiz-card__title-text has-text-weight-light\">\n\t\t\t\t\t\t\t\t\t", "\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"quiz-card__title\">\n\t\t\t\t\t\t\t<strong class=\"quiz-card__subtitle is-family-monospace\">linkcode:</strong>\n\t\t\t\t\t\t\t<div class=\"quiz-card__title-text has-text-weight-light\">\n\t\t\t\t\t\t\t\t", "\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"quiz-card__hidden-btns\">\n\t\t\t\t\t\t<a href=\"/quiz/", "/edit\" class=\"button\">\n\t\t\t\t\t\t\t<i class=\"fa-solid fa-pen\"></i>\n\t\t\t\t\t\t</a>\n\t\t\t\t\t\t<a href=\"##\" class=\"button\">\n\t\t\t\t\t\t\t<i class=\"fa-sharp fa-solid fa-chart-column\"></i>\n\t\t\t\t\t\t</a>\n\t\t\t\t\t\t<a href=\"##\" class=\"button delete-quiz-button\" >\n\t\t\t\t\t\t\t<i class=\"fa-sharp fa-solid fa-trash\"></i>\n\t\t\t\t\t\t</a>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t"])), QuizData.ID, QuizData.TITLE, QuizData.CODE, QuizData.ID);
	        QuizContainerNode.appendChild(QuizCard);
	      });
	      this.rootNode.appendChild(QuizContainerNode);
	      var addButton = document.getElementById('quiz-card__new-quiz-btn');
	      addButton.addEventListener('click', function () {
	        _this4.createQuiz("New Quiz");
	      });
	      var deleteButtons = document.querySelectorAll('.delete-quiz-button');
	      deleteButtons.forEach(function (button) {
	        button.addEventListener('click', function () {
	          var quizId = parseInt(button.closest('.quiz-card').getAttribute('data-quiz-id'));
	          if (!isNaN(quizId)) {
	            _this4.deleteQuiz(quizId);
	          } else {
	            console.error('Attribute data-quiz-id of this element is not a number ');
	          }
	        });
	      });
	    }
	  }]);
	  return QuizList;
	}();

	exports.QuizList = QuizList;

}((this.Up.Quiz = this.Up.Quiz || {}),BX));
