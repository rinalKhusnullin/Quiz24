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
	      var QuizContainerNode = main_core.Tag.render(_templateObject || (_templateObject = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<div class=\"quiz-container\">\n\t\t\t\t<div class=\"quiz-card quiz-card__add-new\">\n\t\t\t\t\t<a class=\"is-success is-button quiz-card__new-quiz-btn\" id=\"open_creating_modal_btn\">\n\t\t\t\t\t\t<i class=\"fa-solid fa-plus\"></i>\n\t\t\t\t\t</a>\n\t\t\t\t\t<div class=\"modal\" id=\"new_quiz_modal\">\n\t\t\t\t\t\t<div class=\"modal-background close-modal\"></div>\n\t\t\t\t\t\t<div class=\"modal-card\">\n\t\t\t\t\t\t\t<header class=\"modal-card-head\">\n\t\t\t\t\t\t\t\t<p class=\"modal-card-title\">\u0421\u043E\u0437\u0434\u0430\u043D\u0438\u0435 \u043E\u043F\u0440\u043E\u0441\u0430</p>\n\t\t\t\t\t\t\t\t<button class=\"delete close-modal\" aria-label=\"close\"></button>\n\t\t\t\t\t\t\t</header>\n\t\t\t\t\t\t\t<section class=\"modal-card-body is-dark\">\n\t\t\t\t\t\t\t\t<div class=\"field\">\n\t\t\t\t\t\t\t\t\t<label class=\"label\">\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043E\u043F\u0440\u043E\u0441\u0430</label>\n\t\t\t\t\t\t\t\t\t<div class=\"control\">\n\t\t\t\t\t\t\t\t\t\t<input id=\"quizTitle\" class=\"input\" type=\"text\" placeholder=\"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043E\u043F\u0440\u043E\u0441\u0430\">\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</section>\n\t\t\t\t\t\t\t<footer class=\"modal-card-foot\">\n\t\t\t\t\t\t\t\t<button class=\"button is-success\" id=\"creating_quiz_btn\">\u0421\u043E\u0437\u0434\u0430\u0442\u044C</button>\n\t\t\t\t\t\t\t\t<button class=\"button close-modal\">Cancel</button>\n\t\t\t\t\t\t\t</footer>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t"])));
	      this.quizList.forEach(function (QuizData) {
	        var QuizCard = main_core.Tag.render(_templateObject2 || (_templateObject2 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t\t<div class=\"quiz-card\" data-quiz-id=\"", "\">\n\t\t\t\t\t<div class=\"quiz-card__header\"></div>\n\t\t\t\t\t\t<div class=\"quiz-card__content\">\n\t\t\t\t\t\t\t<div class=\"quiz-card__title\">\n\t\t\t\t\t\t\t\t<strong class=\"quiz-card__subtitle is-family-monospace\">\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435:</strong>\n\t\t\t\t\t\t\t\t<div class=\"quiz-card__title-text has-text-weight-light\">\n\t\t\t\t\t\t\t\t\t", "\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"quiz-card__title\">\n\t\t\t\t\t\t\t<strong class=\"quiz-card__subtitle is-family-monospace\">linkcode:</strong>\n\t\t\t\t\t\t\t<div class=\"quiz-card__title-text has-text-weight-light\">\n\t\t\t\t\t\t\t\t", "\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"quiz-card__hidden-btns\">\n\t\t\t\t\t\t<a href=\"/quiz/", "/edit\" class=\"button\">\n\t\t\t\t\t\t\t<i class=\"fa-solid fa-pen\"></i>\n\t\t\t\t\t\t</a>\n\t\t\t\t\t\t<a href=\"/quiz/", "/show\" class=\"button\">\n\t\t\t\t\t\t\t<i class=\"fa-sharp fa-solid fa-chart-column\"></i>\n\t\t\t\t\t\t</a>\n\t\t\t\t\t\t<a class=\"button delete-quiz-button\" >\n\t\t\t\t\t\t\t<i class=\"fa-sharp fa-solid fa-trash\"></i>\n\t\t\t\t\t\t</a>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t"])), QuizData.ID, QuizData.TITLE, QuizData.CODE, QuizData.ID, QuizData.ID);
	        QuizContainerNode.appendChild(QuizCard);
	      });
	      this.rootNode.appendChild(QuizContainerNode);
	      var openModalButton = document.getElementById('open_creating_modal_btn');
	      openModalButton.addEventListener('click', function () {
	        _this4.openCreatingQuizModal();
	      });
	      var closeModalElems = document.querySelectorAll('.close-modal');
	      closeModalElems.forEach(function (closeModalElem) {
	        closeModalElem.addEventListener('click', function () {
	          _this4.closeCreatingQuizModal();
	        });
	      });
	      var addButton = document.getElementById('creating_quiz_btn');
	      addButton.addEventListener('click', function () {
	        var quizTitle = document.getElementById('quizTitle').value;
	        _this4.createQuiz(quizTitle);
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
	  }, {
	    key: "openCreatingQuizModal",
	    value: function openCreatingQuizModal() {
	      var modal = document.getElementById('new_quiz_modal');
	      modal.classList.add("is-active");
	    }
	  }, {
	    key: "closeCreatingQuizModal",
	    value: function closeCreatingQuizModal() {
	      var modal = document.getElementById('new_quiz_modal');
	      modal.classList.remove("is-active");
	    }
	  }]);
	  return QuizList;
	}();

	exports.QuizList = QuizList;

}((this.Up.Quiz = this.Up.Quiz || {}),BX));
