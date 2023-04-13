this.BX = this.BX || {};
(function (exports,main_core) {
	'use strict';

	var QuizShow = /*#__PURE__*/function () {
	  function QuizShow() {
	    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
	      name: 'QuizShow'
	    };
	    babelHelpers.classCallCheck(this, QuizShow);
	    this.name = options.name;
	  }
	  babelHelpers.createClass(QuizShow, [{
	    key: "setName",
	    value: function setName(name) {
	      if (main_core.Type.isString(name)) {
	        this.name = name;
	      }
	    }
	  }, {
	    key: "getName",
	    value: function getName() {
	      return this.name;
	    }
	  }]);
	  return QuizShow;
	}();

	exports.QuizShow = QuizShow;

}((this.BX.UP = this.BX.UP || {}),BX));
