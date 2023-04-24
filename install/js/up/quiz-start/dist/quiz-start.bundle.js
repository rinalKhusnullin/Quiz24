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
	      var StartContainerNode = main_core.Tag.render(_templateObject || (_templateObject = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<div class=\"box not-auth\">\n\t\t\t\t<h1 class=\"title is-4\">\u0423\u043A\u0430\u0436\u0438\u0442\u0435 \u043A\u043E\u0434 \u043E\u043F\u0440\u043E\u0441\u0430, \u0432 \u043A\u043E\u0442\u043E\u0440\u043E\u043C \u0445\u043E\u0442\u0438\u0442\u0435 \u043F\u0440\u0438\u043D\u044F\u0442\u044C \u0443\u0447\u0430\u0441\u0442\u0438\u0435</h1>\n\t\t\t\t\t<div class=\"field has-addons has-addons-centered\">\n\t\t\t\t\t\t<div class=\"control\">\n\t\t\t\t\t\t\t<input class=\"input is-dark\" type=\"text\" id=\"quiz-code-input\" placeholder=\"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 quiz-code\">\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"control\">\n\t\t\t\t\t\t\t<a class=\"button is-dark\" id=\"take-button\">\n\t\t\t\t\t\t\t\t\u041F\u0440\u043E\u0439\u0442\u0438 \u043E\u043F\u0440\u043E\u0441\n\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t<strong>\u0418\u041B\u0418</strong>\n\t\t\t\t<div>\n\t\t\t\t\t\u0412\u044B\u043F\u043E\u043B\u043D\u0438\u0442\u0435 <a class=\"is-underlined\" href=\"/login\">\u0432\u0445\u043E\u0434</a>, \u0434\u043B\u044F \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u0438 \u0441\u043E\u0437\u0434\u0430\u0432\u0430\u0442\u044C \u043E\u043F\u0440\u043E\u0441\u044B.\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t"])));
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
