this.Up = this.Up || {};
(function (exports,main_core) {
	'use strict';

	var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5;
	window.am4core.useTheme(am4themes_animated);
	// import Chart from 'chart.js/auto';

	var QuizShow = /*#__PURE__*/function () {
	  function QuizShow() {
	    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    babelHelpers.classCallCheck(this, QuizShow);
	    babelHelpers.defineProperty(this, "DISPLAY_TYPES", {
	      0: 'PieChart3D',
	      1: 'WordCloud',
	      2: 'BarChart'
	    });
	    this.quizId = options.quizId;
	    if (main_core.Type.isStringFilled(options.rootNodeId)) {
	      this.rootNodeId = options.rootNodeId;
	    } else {
	      throw new Error('QuizShow: options.rootNodeId required');
	    }
	    this.rootNode = document.getElementById(this.rootNodeId);
	    if (!this.rootNode) {
	      throw new Error("QuizShow: element with id \"".concat(this.rootNodeId, "\" not found"));
	    }
	    this.questions = []; // Все вопросы : title, id
	    this.currentQuestionId = 1; // Текущий id вопроса
	    this.reload();
	  }
	  babelHelpers.createClass(QuizShow, [{
	    key: "loadQuiz",
	    value: function loadQuiz() {
	      var _this = this;
	      return new Promise(function (resolve, reject) {
	        BX.ajax.runAction('up:quiz.quiz.getQuiz', {
	          data: {
	            id: _this.quizId
	          }
	        }).then(function (response) {
	          var quiz = response.data.quiz;
	          resolve(quiz);
	        })["catch"](function (error) {
	          console.error(error);
	          reject(error);
	        });
	      });
	    }
	  }, {
	    key: "loadQuestion",
	    value: function loadQuestion(id) {
	      return new Promise(function (resolve, reject) {
	        BX.ajax.runAction('up:quiz.question.getQuestion', {
	          data: {
	            id: id
	          }
	        }).then(function (response) {
	          var question = response.data.question;
	          resolve(question);
	        })["catch"](function (error) {
	          console.error(error);
	          reject(error);
	        });
	      });
	    }
	  }, {
	    key: "loadQuestions",
	    value: function loadQuestions() {
	      var _this2 = this;
	      return new Promise(function (resolve, reject) {
	        BX.ajax.runAction('up:quiz.question.getQuestions', {
	          data: {
	            quizId: _this2.quizId
	          }
	        }).then(function (response) {
	          var questions = response.data.questions;
	          resolve(questions);
	        })["catch"](function (error) {
	          console.error(error);
	          reject(error);
	        });
	      });
	    }
	  }, {
	    key: "loadAnswers",
	    value: function loadAnswers() {
	      var _this3 = this;
	      return new Promise(function (resolve, reject) {
	        BX.ajax.runAction('up:quiz.answer.getAnswers', {
	          data: {
	            questionId: _this3.question.ID
	          }
	        }).then(function (response) {
	          var answers = response.data;
	          resolve(answers);
	        })["catch"](function (error) {
	          console.error(error);
	        });
	      });
	    }
	  }, {
	    key: "reload",
	    value: function reload() {
	      var _this4 = this;
	      this.loadQuiz().then(function (quiz) {
	        _this4.quiz = quiz;
	        _this4.loadQuestions().then(function (questions) {
	          _this4.questions = questions;
	          if (_this4.questions.length === 0) {
	            alert("todo вопросов нет");
	            //this.reload();
	          } else {
	            _this4.currentQuestionId = _this4.questions[0].ID;
	            _this4.loadQuestion(_this4.currentQuestionId).then(function (question) {
	              _this4.question = question;
	              _this4.loadAnswers().then(function (answers) {
	                _this4.answers = answers;
	                _this4.render();
	              });
	            });
	          }
	        });
	      });
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      this.rootNode.innerHTML = "";
	      var QuizHeroSection = main_core.Tag.render(_templateObject || (_templateObject = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<section class=\"hero is-small is-primary\">\n\t\t\t\t<div class=\"hero-body\">\n\t\t\t\t\t<p class=\"title mb-0\">\n\t\t\t\t\t\t", "#", "\n\t\t\t\t\t</p>\n\t\t\t\t\t<button class=\"button\">\n\t\t\t\t\t\t<i class=\"fa-solid fa-qrcode\"></i>\n\t\t\t\t\t</button>\n\t\t\t\t\t<div class=\"modal\">\n\t\t\t\t\t\t<div class=\"modal-background\"></div>\n\t\t\t\t\t    <div class=\"modal-content\">\n\t\t\t\t\t\t\t<p class=\"image is-4by3\">\n\t\t\t\t\t\t\t  <img src=\"https://bulma.io/images/placeholders/1280x960.png\" alt=\"\">\n\t\t\t\t\t\t\t</p>\n\t\t\t\t\t    </div>\n\t\t\t\t\t\t<button class=\"modal-close is-large\" aria-label=\"close\"></button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</section>\n\t\t"])), this.quiz.TITLE, this.quiz.CODE);
	      this.rootNode.appendChild(QuizHeroSection);
	      var QuizResultContent = main_core.Tag.render(_templateObject2 || (_templateObject2 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<div class=\"box\">\n\t\t\t\t<div class=\"columns\">\n\t\t\t\t\t<div class=\"column is-one-quarter question-list\">\n\t\t\t\t\t\t<div class=\"question-list__title has-text-weight-semibold has-text-centered is-uppercase\">\u0412\u043E\u043F\u0440\u043E\u0441</div>\n\t\t\t\t\t\t", "\n\t\t\t\t\t</div>\n\t\t\t\t\t\t", "\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t"])), this.getQuestionsListNode(), this.getQuestionResultNode());
	      this.rootNode.appendChild(QuizResultContent);
	      this.renderChart();
	    }
	  }, {
	    key: "getQuestionsListNode",
	    value: function getQuestionsListNode() {
	      var _this5 = this;
	      var QuestionListNode = main_core.Tag.render(_templateObject3 || (_templateObject3 = babelHelpers.taggedTemplateLiteral(["<div class=\"question-list__questions\"></div>"])));
	      this.questions.forEach(function (question) {
	        var QuestionNode = main_core.Tag.render(_templateObject4 || (_templateObject4 = babelHelpers.taggedTemplateLiteral(["<a class=\"question-list__question button\">", "</a>"])), question.QUESTION_TEXT);
	        QuestionNode.onclick = function () {
	          _this5.renderQuestionResult(+question.ID);
	        };
	        QuestionListNode.appendChild(QuestionNode);
	      });
	      return QuestionListNode;
	    }
	  }, {
	    key: "getQuestionResultNode",
	    value: function getQuestionResultNode() {
	      return main_core.Tag.render(_templateObject5 || (_templateObject5 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<div class=\" column is-three-quarters statistics\" id=\"questionResult\">\n\t\t\t\t<div class=\"statistics__title has-text-weight-semibold has-text-centered is-uppercase\">\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430</div>\n\t\t\t\t<div class=\"statistics__question-title\">\n\t\t\t\t\t<strong>\u0412\u043E\u043F\u0440\u043E\u0441 : </strong>\n\t\t\t\t\t", "\n\t\t\t\t\t<button id=\"updateButton\"><i class=\"fa-solid fa-rotate-right\"></i></button>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<div id=\"chart\" style=\"width: 900px; height: 800px;\"></div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t"])), this.question.QUESTION_TEXT);
	    }
	  }, {
	    key: "renderChart",
	    value: function renderChart() {
	      var _this$DISPLAY_TYPES$t;
	      // Create chart instance
	      var chartType = (_this$DISPLAY_TYPES$t = this.DISPLAY_TYPES[this.question.QUESTION_DISPLAY_ID]) !== null && _this$DISPLAY_TYPES$t !== void 0 ? _this$DISPLAY_TYPES$t : 'PieChart';
	      var data = this.getAnswersData();
	      if (chartType === 'PieChart3D') {
	        var _chart = am4core.create('chart', 'PieChart');
	        var _series = _chart.series.push(new am4charts.PieSeries3D());
	        _series.dataFields.value = "count";
	        _series.dataFields.category = "answer";
	        _chart.data = data;
	      }

	      // здесь ошибка, чтобы ее увидеть надо убрать if
	      var chart = am4core.create('chart', am4charts.WordCloud);
	      var series = chart.series.push(new am4charts.WordCloud.WordCloudSeries());
	      series.text = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta nihil quae quas voluptas. Amet beatae consequatur corporis delectus doloribus illo numquam optio porro provident quos reiciendis sit unde veniam, voluptate?';

	      // And, for a good measure, let's add a legend
	      chart.legend = new am4charts.Legend();

	      // const chartNode = document.getElementById('chart');
	      //
	      // let answersData = this.getAnswersData();
	      //
	      // this.chart = new Chart(chartNode, {
	      // 	type: this.DISPLAY_TYPES[this.question.QUESTION_DISPLAY_ID] ?? 'bar',
	      // 	data: {
	      // 		labels: answersData.labels,
	      // 		datasets: [{
	      // 			label: this.question.QUESTION_TEXT,
	      // 			data: answersData.counts,
	      // 			borderWidth: 1,
	      // 		}]
	      // 	},
	      // 	options: {
	      // 		scales: {
	      // 			y: {
	      // 				beginAtZero: true
	      // 			}
	      // 		}
	      // 	}
	      // });
	      //
	      // document.getElementById('updateButton').onclick = () => {
	      // 	this.updateChart(this.chart);
	      // };
	    }
	  }, {
	    key: "updateChart",
	    value: function updateChart() {
	      var _this6 = this;
	      this.loadAnswers().then(function (answers) {
	        _this6.answers = answers;
	        var answersData = _this6.getAnswersData();
	        _this6.chart.data.labels = answersData.labels;
	        _this6.chart.data.datasets[0].data = answersData.counts;
	        _this6.chart.update();
	      });
	    } //update ResultNode
	  }, {
	    key: "renderQuestionResult",
	    value: function renderQuestionResult(questionId) {
	      var _this7 = this;
	      this.loadQuestion(questionId).then(function (question) {
	        _this7.question = question;
	        _this7.loadAnswers().then(function (answers) {
	          _this7.answers = answers;
	          document.getElementById('questionResult').replaceWith(_this7.getQuestionResultNode());
	          _this7.renderChart();
	        });
	      });
	    }
	  }, {
	    key: "getAnswersData",
	    value: function getAnswersData() {
	      var result = [];
	      for (var i = 0; i < this.answers.length; i++) {
	        result.push({
	          'answer': this.answers[i].ANSWER,
	          'count': this.answers[i].COUNT
	        });
	      }
	      console.log(result);
	      return result;
	    }
	  }]);
	  return QuizShow;
	}();

	exports.QuizShow = QuizShow;

}((this.Up.Quiz = this.Up.Quiz || {}),BX));
