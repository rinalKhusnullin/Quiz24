this.Up = this.Up || {};
(function (exports,main_core) {
	'use strict';

	var QuizList = /*#__PURE__*/function () {
	  function QuizList() {
	    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
	      name: 'QuizList'
	    };
	    babelHelpers.classCallCheck(this, QuizList);
	    this.name = options.name;
	  }
	  babelHelpers.createClass(QuizList, [{
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
	  return QuizList;
	}();

	exports.QuizList = QuizList;

}((this.Up.Quiz = this.Up.Quiz || {}),BX));
