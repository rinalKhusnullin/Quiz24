this.BX = this.BX || {};
(function (exports,main_core) {
	'use strict';

	var QuizTake = /*#__PURE__*/function () {
	  function QuizTake() {
	    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
	      name: 'QuizTake'
	    };
	    babelHelpers.classCallCheck(this, QuizTake);
	    this.name = options.name;
	  }
	  babelHelpers.createClass(QuizTake, [{
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
	  return QuizTake;
	}();

	exports.QuizTake = QuizTake;

}((this.BX.UP = this.BX.UP || {}),BX));
