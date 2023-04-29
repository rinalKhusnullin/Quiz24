this.Up = this.Up || {};
(function (exports,main_core) {
	'use strict';

	var _templateObject;
	var QuizErrorManager = /*#__PURE__*/function () {
	  function QuizErrorManager() {
	    babelHelpers.classCallCheck(this, QuizErrorManager);
	  }
	  babelHelpers.createClass(QuizErrorManager, null, [{
	    key: "getQuizNotFoundError",
	    value: function getQuizNotFoundError() {
	      return main_core.Tag.render(_templateObject || (_templateObject = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<section class=\"section error-message\">\n\t\t\t\t<div class=\"error-content\">\n\t\t\t\t\t<span class=\"error-icon\"><i class=\"fa-regular fa-circle-question fa-2xl\"></i></span>\n\t\t\t\t\t<div class=\"error-info\">\n\t\t\t\t\t\t<h1 class=\"error-title\">\u041E\u043F\u0440\u043E\u0441 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D</h1>\n\t\t\t\t\t\t<a href=\"/\" class=\"is-ghost is-underlined\">\u0412\u0435\u0440\u043D\u0443\u0442\u044C\u0441\u044F \u043D\u0430 \u0433\u043B\u0430\u0432\u043D\u0443\u044E</a>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</section>\n\t\t"])));
	    }
	  }]);
	  return QuizErrorManager;
	}();

	exports.QuizErrorManager = QuizErrorManager;

}((this.Up.Quiz = this.Up.Quiz || {}),BX));
