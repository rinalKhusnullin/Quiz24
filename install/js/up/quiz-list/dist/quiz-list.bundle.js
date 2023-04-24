this.Up = this.Up || {};
(function (exports,main_core) {
	'use strict';

	var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject10, _templateObject11, _templateObject12;
	var QuizList = /*#__PURE__*/function () {
	  function QuizList() {
	    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    babelHelpers.classCallCheck(this, QuizList);
	    babelHelpers.defineProperty(this, "config", {
	      MAX_QUIZ_TITLE_LENGTH: 40
	    });
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
	      this.renderLoading();
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
	      return new Promise(function (resolve, reject) {
	        BX.ajax.runAction('up:quiz.quiz.createQuiz', {
	          data: {
	            title: title
	          }
	        }).then(function (response) {
	          resolve(response);
	        })["catch"](function (error) {
	          reject(error);
	        });
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
	    key: "changeState",
	    value: function changeState(id) {
	      var _this3 = this;
	      BX.ajax.runAction('up:quiz.quiz.changeState', {
	        data: {
	          id: id
	        }
	      }).then(function (response) {
	        if (response.data.quizId === null) {
	          //check response
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
	      var QuizContainerNode = main_core.Tag.render(_templateObject || (_templateObject = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<div class=\"quiz-container\">\n\t\t\t\t<div class=\"quiz-card quiz-card__add-new\">\n\t\t\t\t\t<a class=\"is-success is-button quiz-card__new-quiz-btn\" id=\"open_creating_modal_btn\">\n\t\t\t\t\t\t<i class=\"fa-solid fa-plus\"></i>\n\t\t\t\t\t</a>\n\t\t\t\t\t<div class=\"modal\" id=\"new_quiz_modal\">\n\t\t\t\t\t\t<div class=\"modal-background close-modal\"></div>\n\t\t\t\t\t\t<div class=\"modal-card\">\n\t\t\t\t\t\t\t<header class=\"modal-card-head\">\n\t\t\t\t\t\t\t\t<p class=\"modal-card-title\">\u0421\u043E\u0437\u0434\u0430\u043D\u0438\u0435 \u043E\u043F\u0440\u043E\u0441\u0430</p>\n\t\t\t\t\t\t\t\t<button class=\"delete close-modal\" aria-label=\"close\"></button>\n\t\t\t\t\t\t\t</header>\n\t\t\t\t\t\t\t<section class=\"modal-card-body is-dark\">\n\t\t\t\t\t\t\t\t<div class=\"field\">\n\t\t\t\t\t\t\t\t\t<label class=\"label\">\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043E\u043F\u0440\u043E\u0441\u0430</label>\n\t\t\t\t\t\t\t\t\t<div class=\"control\">\n\t\t\t\t\t\t\t\t\t\t<input id=\"quiz_title_input\" class=\"input\" type=\"text\" placeholder=\"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043E\u043F\u0440\u043E\u0441\u0430\">\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<p class=\"help is-danger\" id=\"quiz_title_helper\"></p>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</section>\n\t\t\t\t\t\t\t<footer class=\"modal-card-foot\">\n\t\t\t\t\t\t\t\t<button class=\"button is-success\" id=\"creating_quiz_btn\">\u0421\u043E\u0437\u0434\u0430\u0442\u044C</button>\n\t\t\t\t\t\t\t\t<button class=\"button close-modal\">Cancel</button>\n\t\t\t\t\t\t\t</footer>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t"])));
	      this.quizList.forEach(function (QuizData) {
	        var shortQuizTitle = _this4.truncateText(QuizData.TITLE, _this4.config.MAX_QUIZ_TITLE_LENGTH);
	        var QuizCard = main_core.Tag.render(_templateObject2 || (_templateObject2 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t\t<div class=\"quiz-card\" data-quiz-id=\"", "\">\n\t\t\t\t\t<div class=\"quiz-card__header\">\n\t\t\t\t\t\t", "\n\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"quiz-card__content\">\n\t\t\t\t\t\t\t<div class=\"quiz-card__title\">\n\t\t\t\t\t\t\t\t<strong class=\"quiz-card__subtitle is-family-monospace\">\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435:</strong>\n\t\t\t\t\t\t\t\t<div class=\"quiz-card__title-text has-text-weight-light\">\n\t\t\t\t\t\t\t\t\t", "\n\t\t\t\t\t\t\t\t\t", "\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"quiz-card__title\">\n\t\t\t\t\t\t\t<strong class=\"quiz-card__subtitle is-family-monospace\">linkcode:</strong>\n\t\t\t\t\t\t\t<div class=\"quiz-card__title-text has-text-weight-light\">\n\t\t\t\t\t\t\t\t", "\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"quiz-card__title\">\n\t\t\t\t\t\t\t<strong class=\"quiz-card__subtitle is-family-monospace\">\u0421\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435:</strong>\n\t\t\t\t\t\t\t<div class=\"quiz-card__title-text has-text-weight-light\">\n\t\t\t\t\t\t\t\t", "\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t"])), QuizData.ID, _this4.getHiddenActions(QuizData), BX.util.htmlspecialchars(shortQuizTitle), QuizData.TITLE.length > 50 ? "<div class=\"quiz-card__title-show-more\">".concat(BX.util.htmlspecialchars(QuizData.TITLE), "</div>") : '', BX.util.htmlspecialchars(QuizData.CODE), +QuizData.IS_ACTIVE === 1 ? 'Активный' : 'Не активный');
	        QuizContainerNode.appendChild(QuizCard);
	      });
	      this.rootNode.appendChild(QuizContainerNode);
	      var openModalButton = document.getElementById('open_creating_modal_btn');
	      openModalButton.addEventListener('click', function () {
	        _this4.openCreateQuizModal();
	      });
	      var closeModalElems = document.querySelectorAll('.close-modal');
	      closeModalElems.forEach(function (closeModalElem) {
	        closeModalElem.addEventListener('click', function () {
	          _this4.closeCreateQuizModal();
	        });
	      });
	      var addButton = document.getElementById('creating_quiz_btn');
	      addButton.addEventListener('click', function () {
	        var quizTitleHelper = document.getElementById('quiz_title_helper');
	        var quizTitleInput = document.getElementById('quiz_title_input');
	        addButton.classList.add('is-loading');
	        _this4.createQuiz(quizTitleInput.value).then(function (result) {
	          addButton.classList.remove('is-loading');
	          window.open("/quiz/".concat(result.data, "/edit"), '_blank');
	          _this4.reload();
	          _this4.closeCreateQuizModal();
	          quizTitleInput.value = '';
	          quizTitleHelper.textContent = '';
	        }, function (reject) {
	          addButton.classList.remove('is-loading');
	          quizTitleHelper.textContent = reject.errors[0].message;
	          quizTitleInput.oninput = function () {
	            quizTitleHelper.textContent = '';
	          };
	        });
	      });
	    }
	  }, {
	    key: "openCreateQuizModal",
	    value: function openCreateQuizModal() {
	      document.getElementById('quiz_title_helper').textContent = '';
	      var modal = document.getElementById('new_quiz_modal');
	      modal.classList.add("is-active");
	    }
	  }, {
	    key: "closeCreateQuizModal",
	    value: function closeCreateQuizModal() {
	      var modal = document.getElementById('new_quiz_modal');
	      modal.classList.remove("is-active");
	    }
	  }, {
	    key: "getShareNode",
	    value: function getShareNode(quiz) {
	      var quizTakeLink = "".concat(location.hostname, "/quiz/").concat(quiz.CODE, "/take");
	      var shareButton = main_core.Tag.render(_templateObject3 || (_templateObject3 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<a class=\"button hidden-action\" >\n\t\t\t\t<i class=\"fa-solid fa-link\"></i>\n\t\t\t\t\u041F\u043E\u0434\u0435\u043B\u0438\u0442\u044C\u0441\u044F\n\t\t\t</a>\n\t\t"])));
	      var shareModal = main_core.Tag.render(_templateObject4 || (_templateObject4 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<div class=\"modal\">\n\t\t\t\t<div class=\"modal-background to-close\"></div>\n\t\t\t\t<div class=\"modal-content box\">\n\t\t\t\t\t<div class=\"qr mb-4\"></div>\n\t\t\t\t\t<div>\n\t\t\t\t\t\t<input type=\"text\" class=\"input mb-2\" value=\"", "\" readonly>\n\t\t\t\t\t\t<button class=\"button is-success copy\">\u0421\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<button class=\"modal-close is-large to-close\" aria-label=\"close\"></button>\n\t\t\t</div>\n\t\t"])), BX.util.htmlspecialchars(quizTakeLink));
	      shareButton.onclick = function () {
	        shareModal.classList.add('is-active');
	      };
	      var elemsToCloseModal = shareModal.querySelectorAll('.to-close');
	      elemsToCloseModal.forEach(function (elem) {
	        elem.onclick = function () {
	          shareModal.classList.remove('is-active');
	        };
	      });
	      var copyButton = shareModal.querySelector('.copy');
	      copyButton.onclick = function () {
	        shareModal.querySelector('.input').select();
	        document.execCommand("copy");
	      };
	      new QRCode(shareModal.querySelector(".qr"), {
	        text: quizTakeLink,
	        width: 600,
	        height: 600,
	        colorDark: "#000000",
	        colorLight: "#ffffff",
	        correctLevel: QRCode.CorrectLevel.H
	      });
	      return main_core.Tag.render(_templateObject5 || (_templateObject5 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t", "\n\t\t\t", "\n\t\t"])), shareButton, shareModal);
	    }
	  }, {
	    key: "getHiddenActions",
	    value: function getHiddenActions(quiz) {
	      var _this5 = this;
	      var showHiddenActions = main_core.Tag.render(_templateObject6 || (_templateObject6 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<a class=\"button quiz-card__more-action-btn\">\n\t\t\t\t<i class=\"fa-solid fa-bars\"></i>\n\t\t\t</a>\n\t\t"])));
	      var stateQuizButton = main_core.Tag.render(_templateObject7 || (_templateObject7 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<a class=\"hidden-action button\">\n\t\t\t\t<i class=\"fa-solid fa-", " fa-fw\"></i>\n\t\t\t\t", "\n\t\t\t</a>"])), +quiz.IS_ACTIVE === 1 ? 'stop' : 'play', +quiz.IS_ACTIVE === 1 ? 'Деактивировать' : 'Активировать');
	      stateQuizButton.onclick = function () {
	        _this5.changeState(quiz.ID);
	      };
	      var editQuizButton = main_core.Tag.render(_templateObject8 || (_templateObject8 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<a href=\"/quiz/", "/edit\" class=\"button hidden-action\">\n\t\t\t\t<i class=\"fa-solid fa-pen fa-fw\"></i>\n\t\t\t\t\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C\n\t\t\t</a>"])), quiz.ID);
	      var deleteQuizButton = main_core.Tag.render(_templateObject9 || (_templateObject9 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<a class=\"button delete-quiz-button hidden-action\" >\n\t\t\t\t<i class=\"fa-sharp fa-solid fa-trash fa-fw\"></i>\n\t\t\t\t\u0423\u0434\u0430\u043B\u0438\u0442\u044C\n\t\t\t</a>"])));
	      deleteQuizButton.onclick = function () {
	        _this5.deleteQuiz(+quiz.ID);
	      };
	      var showResultButton = main_core.Tag.render(_templateObject10 || (_templateObject10 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<a href=\"/quiz/", "/show\" class=\"button hidden-action\">\n\t\t\t\t<i class=\"fa-sharp fa-solid fa-chart-column fa-fw\"></i>\n\t\t\t\t\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u044B\n\t\t\t</a>"])), quiz.ID);
	      var hiddenActions = main_core.Tag.render(_templateObject11 || (_templateObject11 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<div class=\"quiz-card__hidden-actions hidden\">\n\t\t\t\t", "\n\t\t\t\t", "\n\t\t\t\t", "\n\t\t\t\t", "\n\t\t\t\t", "\n\t\t\t</div>\n\t\t"])), stateQuizButton, editQuizButton, showResultButton, this.getShareNode(quiz), deleteQuizButton);
	      showHiddenActions.onclick = function () {
	        hiddenActions.classList.toggle('hidden');
	        var icon = showHiddenActions.querySelector('i');
	        if (icon.classList.contains('fa-bars')) {
	          icon.classList.remove('fa-bars');
	          icon.classList.add('fa-circle-xmark');
	        } else {
	          icon.classList.remove('fa-circle-xmark');
	          icon.classList.add('fa-bars');
	        }
	      };
	      return main_core.Tag.render(_templateObject12 || (_templateObject12 = babelHelpers.taggedTemplateLiteral(["", "", ""])), showHiddenActions, hiddenActions);
	    }
	  }, {
	    key: "truncateText",
	    value: function truncateText(text, length) {
	      if (text.length < length) {
	        return text;
	      }
	      return text.slice(0, length) + '...';
	    }
	  }]);
	  return QuizList;
	}();

	exports.QuizList = QuizList;

}((this.Up.Quiz = this.Up.Quiz || {}),BX));
