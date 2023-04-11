this.Up = this.Up || {};
(function (exports,main_core) {
	'use strict';

	var QuizList = /*#__PURE__*/function () {
	  function QuizList() {
	    babelHelpers.classCallCheck(this, QuizList);
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
	    key: "createTask",
	    value: function createTask(title) {
	      var _this2 = this;
	      BX.ajax.runAction('up:quiz.quiz.createQuiz', {
	        data: {
	          title: title
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
	    key: "render",
	    value: function render() {}
	  }]);
	  return QuizList;
	}();

	exports.QuizList = QuizList;

}((this.Up.Quiz = this.Up.Quiz || {}),BX));
