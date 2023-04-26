this.Up = this.Up || {};
(function (exports,main_core) {
	'use strict';

	var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject10, _templateObject11, _templateObject12, _templateObject13, _templateObject14, _templateObject15, _templateObject16, _templateObject17, _templateObject18, _templateObject19;
	var QuizList = /*#__PURE__*/function () {
	  function QuizList() {
	    var _this = this;
	    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    babelHelpers.classCallCheck(this, QuizList);
	    babelHelpers.defineProperty(this, "config", {
	      MAX_QUIZ_TITLE_LENGTH: 38
	    });
	    if (main_core.Type.isStringFilled(options.rootNodeId)) {
	      this.rootNodeId = options.rootNodeId;
	    } else {
	      throw new Error('QuizList: options.rootNodeId required');
	    }
	    if (main_core.Type.isStringFilled(options.filterNodeId)) {
	      this.filterNodeId = options.filterNodeId;
	    } else {
	      throw new Error('QuizList: options.filterNodeId required');
	    }
	    this.rootNode = document.getElementById(this.rootNodeId);
	    if (!this.rootNode) {
	      throw new Error("QuizList: element with id \"".concat(this.rootNodeId, "\" not found"));
	    }
	    this.filterNode = document.getElementById(this.filterNodeId);
	    if (!this.filterNode) {
	      throw new Error("QuizList: element with id \"".concat(this.filterNodeId, "\" not found"));
	    }
	    this.LinkIsCopyNotify = null;
	    this.getFilterNode().forEach(function (node) {
	      _this.filterNode.appendChild(node);
	    });
	    this.query = '';
	    this.quizState = 'all';
	    this.quizList = [];
	    this.reload();
	  }
	  babelHelpers.createClass(QuizList, [{
	    key: "reload",
	    value: function reload() {
	      var _this2 = this;
	      if (this.query === '' && this.quizState === 'all') this.loadList().then(function (quizList) {
	        _this2.quizList = quizList;
	        _this2.render();
	      });else this.loadQuizzesByFilters().then(function (quizList) {
	        _this2.quizList = quizList;
	        _this2.render();
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
	      var _this3 = this;
	      this.renderLoading();
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
	    key: "loadQuizzesByFilters",
	    value: function loadQuizzesByFilters() {
	      var _this4 = this;
	      this.renderLoading();
	      return new Promise(function (resolve, reject) {
	        BX.ajax.runAction('up:quiz.quiz.getQuizzesByFilters', {
	          data: {
	            query: _this4.query,
	            state: _this4.quizState
	          }
	        }).then(function (response) {
	          resolve(response.data.quizList);
	        })["catch"](function (error) {
	          reject(error);
	        });
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
	  }, {
	    key: "render",
	    value: function render() {
	      var _this6 = this;
	      this.rootNode.innerHTML = "";
	      var QuizContainerNode = main_core.Tag.render(_templateObject || (_templateObject = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<div class=\"quiz-container\">\n\t\t\t\t<div class=\"quiz-card quiz-card__add-new\">\n\t\t\t\t\t<a class=\"is-success is-button quiz-card__new-quiz-btn\" id=\"open_creating_modal_btn\">\n\t\t\t\t\t\t<i class=\"fa-solid fa-plus\"></i>\n\t\t\t\t\t\t<span class=\"quiz-card__add-new-title mobile\">", "</span>\n\t\t\t\t\t</a>\n\t\t\t\t\t<div class=\"modal\" id=\"new_quiz_modal\">\n\t\t\t\t\t\t<div class=\"modal-background close-modal\"></div>\n\t\t\t\t\t\t<div class=\"modal-card\">\n\t\t\t\t\t\t\t<header class=\"modal-card-head\">\n\t\t\t\t\t\t\t\t<p class=\"modal-card-title\">", "</p>\n\t\t\t\t\t\t\t\t<button class=\"delete close-modal\" aria-label=\"close\"></button>\n\t\t\t\t\t\t\t</header>\n\t\t\t\t\t\t\t<section class=\"modal-card-body is-dark\">\n\t\t\t\t\t\t\t\t<div class=\"field\">\n\t\t\t\t\t\t\t\t\t<label class=\"label\">", "</label>\n\t\t\t\t\t\t\t\t\t<div class=\"control\">\n\t\t\t\t\t\t\t\t\t\t<input id=\"quiz_title_input\" class=\"input\" type=\"text\" placeholder=\"", "\">\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<p class=\"help is-danger\" id=\"quiz_title_helper\"></p>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</section>\n\t\t\t\t\t\t\t<footer class=\"modal-card-foot\">\n\t\t\t\t\t\t\t\t<button class=\"button is-dark\" id=\"creating_quiz_btn\">", "</button>\n\t\t\t\t\t\t\t\t<button class=\"button close-modal\">", "</button>\n\t\t\t\t\t\t\t</footer>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t"])), main_core.Loc.getMessage('UP_QUIZ_LIST_CREATE_QUIZ'), main_core.Loc.getMessage('UP_QUIZ_LIST_CREATING_QUIZ'), main_core.Loc.getMessage('UP_QUIZ_LIST_QUIZ_NAME'), main_core.Loc.getMessage('UP_QUIZ_LIST_ENTER_QUIZ_NAME'), main_core.Loc.getMessage('UP_QUIZ_LIST_CREATE'), main_core.Loc.getMessage('UP_QUIZ_LIST_BACK'));
	      this.quizList.forEach(function (QuizData) {
	        var shortQuizTitle = _this6.truncateText(QuizData.TITLE, _this6.config.MAX_QUIZ_TITLE_LENGTH);
	        var QuizCard = main_core.Tag.render(_templateObject2 || (_templateObject2 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t\t<div class=\"quiz-card\" data-quiz-id=\"", "\">\n\t\t\t\t\t<div class=\"quiz-card__header\">\n\t\t\t\t\t\t", "\n\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"quiz-card__content\">\n\t\t\t\t\t\t\t<div class=\"quiz-card__title\">\n\t\t\t\t\t\t\t\t<strong class=\"quiz-card__subtitle is-family-monospace\">", ":</strong>\n\t\t\t\t\t\t\t\t<div class=\"quiz-card__title-text has-text-weight-light\">\n\t\t\t\t\t\t\t\t\t", "\n\t\t\t\t\t\t\t\t\t", "\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"quiz-card__title\">\n\t\t\t\t\t\t\t<strong class=\"quiz-card__subtitle is-family-monospace\">", ":</strong>\n\t\t\t\t\t\t\t<div class=\"quiz-card__title-text has-text-weight-light\">\n\t\t\t\t\t\t\t\t", "\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"quiz-card__title\">\n\t\t\t\t\t\t\t<strong class=\"quiz-card__subtitle is-family-monospace\">", ":</strong>\n\t\t\t\t\t\t\t<div class=\"quiz-card__title-text has-text-weight-light\">\n\t\t\t\t\t\t\t\t", "\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t"])), QuizData.ID, _this6.getHiddenActions(QuizData), main_core.Loc.getMessage('UP_QUIZ_LIST_NAME'), main_core.Text.encode(shortQuizTitle), QuizData.TITLE.length > 50 ? "<div class=\"quiz-card__title-show-more\">".concat(main_core.Text.encode(QuizData.TITLE), "</div>") : '', main_core.Loc.getMessage('UP_QUIZ_LIST_LINK_CODE'), main_core.Text.encode(QuizData.CODE), main_core.Loc.getMessage('UP_QUIZ_LIST_STATE'), +QuizData.IS_ACTIVE === 1 ? main_core.Loc.getMessage('UP_QUIZ_LIST_ACTIVE') : main_core.Loc.getMessage('UP_QUIZ_LIST_NOT_ACTIVE'));
	        QuizContainerNode.appendChild(QuizCard);
	      });
	      this.rootNode.appendChild(QuizContainerNode);
	      var openModalButton = document.getElementById('open_creating_modal_btn');
	      openModalButton.addEventListener('click', function () {
	        _this6.openCreateQuizModal();
	      });
	      var closeModalElems = document.querySelectorAll('.close-modal');
	      closeModalElems.forEach(function (closeModalElem) {
	        closeModalElem.addEventListener('click', function () {
	          _this6.closeCreateQuizModal();
	        });
	      });
	      var addButton = document.getElementById('creating_quiz_btn');
	      var MaxCountQuizzesNotify = new BX.UI.Notification.Balloon({
	        stack: new BX.UI.Notification.Stack({
	          position: 'bottom-center'
	        }),
	        content: main_core.Loc.getMessage('UP_QUIZ_LIST_STOP_CREATE_QUIZZES'),
	        autoHide: true,
	        autoHideDelay: 5000
	      });
	      addButton.addEventListener('click', function () {
	        var quizTitleHelper = document.getElementById('quiz_title_helper');
	        var quizTitleInput = document.getElementById('quiz_title_input');
	        addButton.classList.add('is-loading');
	        _this6.createQuiz(quizTitleInput.value).then(function (result) {
	          addButton.classList.remove('is-loading');
	          window.location.replace("/quiz/".concat(result.data, "/edit"));
	        }, function (reject) {
	          if (reject.errors[0].code === 'max_count_quizzes') {
	            addButton.classList.remove('is-loading');
	            _this6.closeCreateQuizModal();
	            MaxCountQuizzesNotify.show();
	            return;
	          }
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
	      var shareButton = main_core.Tag.render(_templateObject3 || (_templateObject3 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<a class=\"button hidden-action\" >\n\t\t\t\t<i class=\"fa-solid fa-link\"></i>\n\t\t\t\t", "\n\t\t\t</a>\n\t\t"])), main_core.Loc.getMessage('UP_QUIZ_LIST_SHARE'));
	      var shareModal = main_core.Tag.render(_templateObject4 || (_templateObject4 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<div class=\"modal\">\n\t\t\t\t<div class=\"modal-background to-close\"></div>\n\t\t\t\t<div class=\"modal-content box qr-modal\">\n\t\t\t\t\t<div class=\"qr mb-4\"></div>\n\t\t\t\t\t<div>\n\t\t\t\t\t\t<input type=\"text\" class=\"input mb-2\" value=\"", "\" readonly>\n\t\t\t\t\t\t<button class=\"button is-dark copy\">", "</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<button class=\"modal-close is-large to-close\" aria-label=\"close\"></button>\n\t\t\t</div>\n\t\t"])), main_core.Text.encode(quizTakeLink), main_core.Loc.getMessage('UP_QUIZ_LIST_COPY'));
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
	      var CopyLinkIsSuccess = new BX.UI.Notification.Balloon({
	        stack: new BX.UI.Notification.Stack({
	          position: 'bottom-center'
	        }),
	        content: main_core.Loc.getMessage('UP_QUIZ_LIST_LINK_COPY_SUCCESS'),
	        autoHide: true,
	        autoHideDelay: 1000,
	        blinkOnUpdate: true
	      });
	      copyButton.onclick = function () {
	        shareModal.querySelector('.input').select();
	        document.execCommand("copy");
	        CopyLinkIsSuccess.show();
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
	      var _this7 = this;
	      var showHiddenActionsButton = main_core.Tag.render(_templateObject6 || (_templateObject6 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<a class=\"button quiz-card__more-action-btn\">\n\t\t\t\t<i class=\"fa-solid fa-bars\"></i>\n\t\t\t</a>\n\t\t"])));
	      var stateQuizButton = main_core.Tag.render(_templateObject7 || (_templateObject7 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<a class=\"hidden-action button\">\n\t\t\t\t<i class=\"fa-solid fa-", " fa-fw\"></i>\n\t\t\t\t", "\n\t\t\t</a>"])), +quiz.IS_ACTIVE === 1 ? 'stop' : 'play', +quiz.IS_ACTIVE === 1 ? main_core.Loc.getMessage('UP_QUIZ_LIST_DEACTIVATE') : main_core.Loc.getMessage('UP_QUIZ_LIST_ACTIVATE'));
	      stateQuizButton.onclick = function () {
	        _this7.changeState(quiz.ID);
	      };
	      var editQuizButton = main_core.Tag.render(_templateObject8 || (_templateObject8 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<a href=\"/quiz/", "/edit\" class=\"button hidden-action\">\n\t\t\t\t<i class=\"fa-solid fa-pen fa-fw\"></i>\n\t\t\t\t", "\n\t\t\t</a>"])), quiz.ID, main_core.Loc.getMessage('UP_QUIZ_LIST_EDIT'));
	      var deleteQuizButton = main_core.Tag.render(_templateObject9 || (_templateObject9 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<a class=\"button delete-quiz-button hidden-action\" >\n\t\t\t\t<i class=\"fa-sharp fa-solid fa-trash fa-fw\"></i>\n\t\t\t\t", "\n\t\t\t</a>"])), main_core.Loc.getMessage('UP_QUIZ_LIST_DELETE'));
	      deleteQuizButton.onclick = function () {
	        _this7.deleteQuiz(+quiz.ID);
	      };
	      var showResultButton = main_core.Tag.render(_templateObject10 || (_templateObject10 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<a href=\"/quiz/", "/show\" class=\"button hidden-action\">\n\t\t\t\t<i class=\"fa-sharp fa-solid fa-chart-column fa-fw\"></i>\n\t\t\t\t", "\n\t\t\t</a>"])), quiz.ID, main_core.Loc.getMessage('UP_QUIZ_LIST_SHOW_RESULT'));
	      var goToTakeQuizButton = main_core.Tag.render(_templateObject11 || (_templateObject11 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<a href=\"/quiz/", "/take\" class=\"button hidden-action\">\n\t\t\t\t<i class=\"fa-sharp fa-solid fa-arrow-up-right-from-square fa-fw\"></i>\n\t\t\t\t", "\n\t\t\t</a>"])), quiz.CODE, main_core.Loc.getMessage('UP_QUIZ_LIST_GO_TO_TAKE_QUIZ'));
	      var hiddenActionsNode = main_core.Tag.render(_templateObject12 || (_templateObject12 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<div class=\"quiz-card__hidden-actions hidden\">\n\t\t\t\t", "\n\t\t\t\t", "\n\t\t\t\t", "\n\t\t\t\t", "\n\t\t\t\t", "\n\t\t\t\t", "\n\t\t\t</div>\n\t\t"])), stateQuizButton, editQuizButton, showResultButton, this.getShareNode(quiz), goToTakeQuizButton, deleteQuizButton);
	      showHiddenActionsButton.onclick = function () {
	        hiddenActionsNode.classList.toggle('hidden');
	        var icon = showHiddenActionsButton.querySelector('i');
	        if (icon.classList.contains('fa-bars')) {
	          icon.classList.remove('fa-bars');
	          icon.classList.add('fa-circle-xmark');
	        } else {
	          icon.classList.remove('fa-circle-xmark');
	          icon.classList.add('fa-bars');
	        }
	      };
	      return main_core.Tag.render(_templateObject13 || (_templateObject13 = babelHelpers.taggedTemplateLiteral(["", "", ""])), showHiddenActionsButton, hiddenActionsNode);
	    }
	  }, {
	    key: "getFilterNode",
	    value: function getFilterNode() {
	      var _this8 = this;
	      var ShowAllQuizzesButton = main_core.Tag.render(_templateObject14 || (_templateObject14 = babelHelpers.taggedTemplateLiteral(["<button class=\"button is-dark is-selected\" value=\"all\"><span>", "</span></button>"])), main_core.Loc.getMessage('UP_QUIZ_LIST_ALL'));
	      var ShowActiveQuizzesButton = main_core.Tag.render(_templateObject15 || (_templateObject15 = babelHelpers.taggedTemplateLiteral(["<button class=\"button\" value=\"active\"><span>", "</span></button>"])), main_core.Loc.getMessage('UP_QUIZ_LIST_ACTIVES'));
	      var ShowNotActiveQuizzesButton = main_core.Tag.render(_templateObject16 || (_templateObject16 = babelHelpers.taggedTemplateLiteral(["<button class=\"button\" value=\"notActive\"><span>", "</span></button>"])), main_core.Loc.getMessage('UP_QUIZ_LIST_NOT_ACTIVES'));
	      var filterButtons = [ShowNotActiveQuizzesButton, ShowAllQuizzesButton, ShowActiveQuizzesButton];
	      filterButtons.forEach(function (button) {
	        button.onclick = function () {
	          if (button.classList.contains('is-dark') && button.classList.contains('is-selected')) return;
	          button.classList.add('is-dark', 'is-selected');
	          _this8.quizState = button.value;
	          filterButtons.forEach(function (otherButton) {
	            if (button !== otherButton) {
	              otherButton.classList.remove('is-dark', 'is-selected');
	            }
	          });
	          _this8.loadQuizzesByFilters().then(function (quizList) {
	            _this8.quizList = quizList;
	            _this8.render();
	          });
	        };
	      });
	      var SearchInput = main_core.Tag.render(_templateObject17 || (_templateObject17 = babelHelpers.taggedTemplateLiteral(["<input class=\"input\" type=\"text\" placeholder=\"\u041D\u0430\u0439\u0442\u0438 \u043E\u043F\u0440\u043E\u0441\" id=\"search-input\">"])));
	      var SearchButton = main_core.Tag.render(_templateObject18 || (_templateObject18 = babelHelpers.taggedTemplateLiteral(["<button class=\"button\" id=\"search-button\">", "</button>"])), main_core.Loc.getMessage('UP_QUIZ_LIST_FIND_QUIZ'));
	      SearchInput.oninput = function () {
	        _this8.query = SearchInput.value;
	      };
	      SearchButton.onclick = function () {
	        _this8.loadQuizzesByFilters().then(function (quizList) {
	          _this8.quizList = quizList;
	          _this8.render();
	        });
	      };
	      var FilterNode = main_core.Tag.render(_templateObject19 || (_templateObject19 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<div class=\"level-left\">\n\t\t\t\t<div class=\"level-item\">\n\t\t\t\t\t<div class=\"field has-addons\">\n\t\t\t\t\t\t<p class=\"control\">\n\t\t\t\t\t\t\t", "\n\t\t\t\t\t\t</p>\n\t\t\t\t\t\t<p class=\"control\">\n\t\t\t\t\t\t\t", "\n\t\t\t\t\t\t</p>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t<!-- Right side -->\n\t\t\t<div class=\"level-right\">\n\t\t\t\t<div class=\"field has-addons\">\n\t\t\t\t\t<p class=\"control\">\n\t\t\t\t\t\t", "\n\t\t\t\t\t</p>\n\t\t\t\t\t<p class=\"control\">\n\t\t\t\t\t\t", "\n\t\t\t\t\t</p>\n\t\t\t\t\t<p class=\"control\">\n\t\t\t\t\t\t", "\n\t\t\t\t\t</p>\n\t\t\t\t</div>\n\t\t\t</div>"])), SearchInput, SearchButton, ShowAllQuizzesButton, ShowActiveQuizzesButton, ShowNotActiveQuizzesButton);
	      return FilterNode;
	    }
	  }, {
	    key: "truncateText",
	    value: function truncateText(text, length) {
	      if (text.length < length) {
	        return text;
	      }
	      return text.slice(0, length - 3) + '...';
	    }
	  }]);
	  return QuizList;
	}();

	exports.QuizList = QuizList;

}((this.Up.Quiz = this.Up.Quiz || {}),BX));
