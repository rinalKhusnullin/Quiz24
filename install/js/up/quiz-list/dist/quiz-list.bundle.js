this.Up = this.Up || {};
(function (exports,main_core) {
	'use strict';

	var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5;
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
	    this.userId = 1;
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
	      this.renderLoading();
	      var UserId = 1;
	      return new Promise(function (resolve, reject) {
	        BX.ajax.runAction('up:quiz.quiz.getList', {
	          data: {
	            userId: UserId
	          }
	        }).then(function (response) {
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
	      BX.ajax.runAction('up:quiz.quiz.createQuiz', {
	        data: {
	          title: title,
	          userId: this.userId
	        }
	      }).then(function (response) {
	        if (Number.isInteger(response.data)) {
	          window.location.href = "/quiz/".concat(response.data, "/edit");
	        }
	      })["catch"](function (error) {
	        var errors = error.errors;
	        errors.forEach(function (error) {
	          if (error.code === 'invalid_user_id') {
	            alert('TODO:НЕПРАВИЛЬНЫЙ USER_ID');
	          }
	        });
	        console.log(error);
	      });
	    }
	  }, {
	    key: "deleteQuiz",
	    value: function deleteQuiz(id) {
	      var _this2 = this;
	      this.renderLoading();
	      BX.ajax.runAction('up:quiz.quiz.deleteQuiz', {
	        data: {
	          id: id
	        }
	      }).then(function (response) {
	        if (response.data != null) {
	          console.error('errors:', response.data);
	        } else {
	          _this2.reload();
	        }
	      })["catch"](function (error) {
	        console.error(error);
	      });
	    }
	  }, {
	    key: "renderLoading",
	    value: function renderLoading() {
	      if (!(this.rootNode.innerHTML === '<div class="donut"></div>')) this.rootNode.innerHTML = "<div class=\"donut\"></div>";
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      var _this3 = this;
	      this.rootNode.innerHTML = "";
	      var QuizContainerNode = main_core.Tag.render(_templateObject || (_templateObject = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<div class=\"quiz-container\">\n\t\t\t\t<div class=\"quiz-card quiz-card__add-new\">\n\t\t\t\t\t<a class=\"is-success is-button quiz-card__new-quiz-btn\" id=\"open_creating_modal_btn\">\n\t\t\t\t\t\t<i class=\"fa-solid fa-plus\"></i>\n\t\t\t\t\t</a>\n\t\t\t\t\t<div class=\"modal\" id=\"new_quiz_modal\">\n\t\t\t\t\t\t<div class=\"modal-background close-modal\"></div>\n\t\t\t\t\t\t<div class=\"modal-card\">\n\t\t\t\t\t\t\t<header class=\"modal-card-head\">\n\t\t\t\t\t\t\t\t<p class=\"modal-card-title\">\u0421\u043E\u0437\u0434\u0430\u043D\u0438\u0435 \u043E\u043F\u0440\u043E\u0441\u0430</p>\n\t\t\t\t\t\t\t\t<button class=\"delete close-modal\" aria-label=\"close\"></button>\n\t\t\t\t\t\t\t</header>\n\t\t\t\t\t\t\t<section class=\"modal-card-body is-dark\">\n\t\t\t\t\t\t\t\t<div class=\"field\">\n\t\t\t\t\t\t\t\t\t<label class=\"label\">\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043E\u043F\u0440\u043E\u0441\u0430</label>\n\t\t\t\t\t\t\t\t\t<div class=\"control\">\n\t\t\t\t\t\t\t\t\t\t<input id=\"quizTitle\" class=\"input\" type=\"text\" placeholder=\"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043E\u043F\u0440\u043E\u0441\u0430\">\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<p class=\"help\" id=\"creating-quiz-helper\"></p>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</section>\n\t\t\t\t\t\t\t<footer class=\"modal-card-foot\">\n\t\t\t\t\t\t\t\t<button class=\"button is-success\" id=\"creating_quiz_btn\">\u0421\u043E\u0437\u0434\u0430\u0442\u044C</button>\n\t\t\t\t\t\t\t\t<button class=\"button close-modal\">Cancel</button>\n\t\t\t\t\t\t\t</footer>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t"])));
	      this.quizList.forEach(function (QuizData) {
	        var isActive = +QuizData.IS_ACTIVE === 1 ? 'Включен' : 'Выключен';
	        var QuizCard = main_core.Tag.render(_templateObject2 || (_templateObject2 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t\t<div class=\"quiz-card\" data-quiz-id=\"", "\">\n\t\t\t\t\t<div class=\"quiz-card__header\"></div>\n\t\t\t\t\t\t<div class=\"quiz-card__content\">\n\t\t\t\t\t\t\t<div class=\"quiz-card__title\">\n\t\t\t\t\t\t\t\t<strong class=\"quiz-card__subtitle is-family-monospace\">\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435:</strong>\n\t\t\t\t\t\t\t\t<div class=\"quiz-card__title-text has-text-weight-light\">\n\t\t\t\t\t\t\t\t\t", "\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"quiz-card__title\">\n\t\t\t\t\t\t\t<strong class=\"quiz-card__subtitle is-family-monospace\">linkcode:</strong>\n\t\t\t\t\t\t\t<div class=\"quiz-card__title-text has-text-weight-light\">\n\t\t\t\t\t\t\t\t", "\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"quiz-card__title\">\n\t\t\t\t\t\t\t<strong class=\"quiz-card__subtitle is-family-monospace\">\u0421\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435:</strong>\n\t\t\t\t\t\t\t<div class=\"quiz-card__title-text has-text-weight-light\">\n\t\t\t\t\t\t\t\t", "\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"quiz-card__hidden-btns\">\n\t\t\t\t\t\t", "\n\t\t\t\t\t\t<a href=\"/quiz/", "/edit\" title=\"\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043E\u043F\u0440\u043E\u0441\">\n\t\t\t\t\t\t\t<i class=\"fa-solid fa-pen fa-fw\"></i>\n\t\t\t\t\t\t</a>\n\t\t\t\t\t\t<a href=\"/quiz/", "/show\" title=\"\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u044B\">\n\t\t\t\t\t\t\t<i class=\"fa-sharp fa-solid fa-chart-column fa-fw\"></i>\n\t\t\t\t\t\t</a>\n\t\t\t\t\t\t<a href=\"/quiz/", "/show\" title=\"\u041F\u043E\u0434\u0435\u043B\u0438\u0442\u044C\u0441\u044F\">\n\t\t\t\t\t\t\t<i class=\"fa-solid fa-link fa-fw\"></i>\n\t\t\t\t\t\t</a>\n\t\t\t\t\t\t<a class=\"delete-quiz-button\" title=\"\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043E\u043F\u0440\u043E\u0441\">\n\t\t\t\t\t\t\t<i class=\"fa-sharp fa-solid fa-trash fa-fw\"></i>\n\t\t\t\t\t\t</a>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t"])), QuizData.ID, QuizData.TITLE, QuizData.CODE, isActive, _this3.getStateButton(QuizData), QuizData.ID, QuizData.ID, QuizData.ID);
	        QuizContainerNode.appendChild(QuizCard);
	      });
	      this.rootNode.appendChild(QuizContainerNode);
	      var openModalButton = document.getElementById('open_creating_modal_btn');
	      openModalButton.addEventListener('click', function () {
	        _this3.openCreatingQuizModal();
	      });
	      var closeModalElems = document.querySelectorAll('.close-modal');
	      closeModalElems.forEach(function (closeModalElem) {
	        closeModalElem.addEventListener('click', function () {
	          _this3.closeCreatingQuizModal();
	        });
	      });
	      var addButton = document.getElementById('creating_quiz_btn');
	      addButton.addEventListener('click', function () {
	        var quizTitle = document.getElementById('quizTitle').value;
	        if (quizTitle !== '') _this3.createQuiz(quizTitle);
	      });
	      var QuizTitleInput = document.getElementById('quizTitle');
	      QuizTitleInput.addEventListener('input', function () {
	        var QuizTitleInputHelper = document.getElementById('creating-quiz-helper');
	        if (QuizTitleInput.value === '') {
	          //todo Я знаю, что это ужасно! Думаю вынести в отдельную функцию
	          QuizTitleInput.classList.add('is-danger');
	          QuizTitleInput.classList.remove('is-success');
	          QuizTitleInputHelper.textContent = 'Название опроса не может быть пустым!';
	          QuizTitleInputHelper.classList.add('is-danger');
	          QuizTitleInputHelper.classList.remove('is-success');
	        } else {
	          QuizTitleInput.classList.add('is-success');
	          QuizTitleInput.classList.remove('is-danger');
	          QuizTitleInputHelper.textContent = 'Все кул!';
	          QuizTitleInputHelper.classList.remove('is-danger');
	          QuizTitleInputHelper.classList.add('is-success');
	        }
	      });
	      var deleteButtons = document.querySelectorAll('.delete-quiz-button');
	      deleteButtons.forEach(function (button) {
	        button.addEventListener('click', function () {
	          var quizId = parseInt(button.closest('.quiz-card').getAttribute('data-quiz-id'));
	          if (!isNaN(quizId)) {
	            _this3.deleteQuiz(quizId);
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
	  }, {
	    key: "getStateButton",
	    value: function getStateButton(quiz) {
	      var _this4 = this;
	      var button = main_core.Tag.render(_templateObject3 || (_templateObject3 = babelHelpers.taggedTemplateLiteral(["<a></a>"])));
	      if (+quiz.IS_ACTIVE === 0) {
	        button.title = 'Запустить опрос';
	        button.appendChild(main_core.Tag.render(_templateObject4 || (_templateObject4 = babelHelpers.taggedTemplateLiteral(["<i class=\"fa-sharp fa-regular fa-circle-play fa-fw\"></i>"]))));
	      } else {
	        button.title = 'Выключить опрос';
	        button.appendChild(main_core.Tag.render(_templateObject5 || (_templateObject5 = babelHelpers.taggedTemplateLiteral(["<i class=\"fa-sharp fa-regular fa-circle-stop fa-fw\"></i>"]))));
	      }
	      button.onclick = function () {
	        _this4.changeState(quiz.ID);
	      };
	      return button;
	    }
	  }, {
	    key: "changeState",
	    value: function changeState(id) {
	      var _this5 = this;
	      BX.ajax.runAction('up:quiz.quiz.changeState', {
	        data: {
	          id: id
	        }
	      }).then(function (response) {
	        if (response.data.quizId === null) {
	          //check response
	          console.error('errors:', response.data);
	        } else {
	          _this5.reload();
	        }
	      })["catch"](function (error) {
	        console.error(error);
	      });
	    }
	  }]);
	  return QuizList;
	}();

	exports.QuizList = QuizList;

}((this.Up.Quiz = this.Up.Quiz || {}),BX));
