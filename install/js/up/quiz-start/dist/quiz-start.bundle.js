this.Up = this.Up || {};
(function (exports,main_core) {
	'use strict';

	var _templateObject;
	var QuizStart = /*#__PURE__*/function () {
	  function QuizStart() {
	    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    babelHelpers.classCallCheck(this, QuizStart);
	    if (main_core.Type.isStringFilled(options.rootNodeId)) {
	      this.rootNodeId = options.rootNodeId;
	    } else {
	      throw new Error('QuizStart: options.rootNodeId required');
	    }
	    this.rootNode = document.getElementById(this.rootNodeId);
	    if (!this.rootNode) {
	      throw new Error("QuizStart: element with id \"".concat(this.rootNodeId, "\" not found"));
	    }
	    this.reload();
	  }
	  babelHelpers.createClass(QuizStart, [{
	    key: "reload",
	    value: function reload() {
	      this.render();
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      var _this = this;
	      var StartContainerNode = main_core.Tag.render(_templateObject || (_templateObject = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<div class=\"box not-auth\">\n\t\t\t\t<h1 class=\"title is-4\">", "</h1>\n\t\t\t\t\t<div class=\"field has-addons has-addons-centered\">\n\t\t\t\t\t\t<div class=\"control\">\n\t\t\t\t\t\t\t<input class=\"input is-dark\" type=\"text\" id=\"quiz-code-input\" placeholder=\"", "\">\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"control\">\n\t\t\t\t\t\t\t<a class=\"button is-dark\" id=\"take-button\">\n\t\t\t\t\t\t\t\t", "\n\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t<strong>", "</strong>\n\t\t\t\t<div>\n\t\t\t\t\t", " <a class=\"is-underlined\" href=\"/login\">", "</a>, ", ".\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t"])), main_core.Loc.getMessage('UP_QUIZ_START_MESSAGE'), main_core.Loc.getMessage('UP_QUIZ_START_ENTER_CODE'), main_core.Loc.getMessage('UP_QUIZ_START_TAKE_QUIZ'), main_core.Loc.getMessage('UP_QUIZ_START_OR'), main_core.Loc.getMessage('UP_QUIZ_START_COMPLETE'), main_core.Loc.getMessage('UP_QUIZ_START_LOGIN'), main_core.Loc.getMessage('UP_QUIZ_START_TO_BE_ABLE_TO_CREATE_QUIZZES'));
	      var codeInput = StartContainerNode.querySelector('#quiz-code-input');
	      var takeButton = StartContainerNode.querySelector('#take-button');
	      codeInput.oninput = function () {
	        _this.quizCode = codeInput.value;
	      };
	      takeButton.onclick = function () {
	        location.href = "/quiz/".concat(_this.quizCode, "/take");
	      };
	      this.rootNode.appendChild(StartContainerNode);
	    }
	  }]);
	  return QuizStart;
	}();

	exports.QuizStart = QuizStart;

}((this.Up.Quiz = this.Up.Quiz || {}),BX));
