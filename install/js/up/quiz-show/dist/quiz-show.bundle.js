this.Up = this.Up || {};
(function (exports,main_core) {
	'use strict';

	var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8;
	window.am4core.useTheme(am4themes_animated);
	window.am4core.useTheme(am4themes_material);
	var QuizShow = /*#__PURE__*/function () {
	  function QuizShow() {
	    var _this = this;
	    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    babelHelpers.classCallCheck(this, QuizShow);
	    babelHelpers.defineProperty(this, "DISPLAY_TYPES", {
	      0: 'PieChart',
	      1: 'WordCloud',
	      2: 'BarChart',
	      3: 'RawOutput'
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

	    BX.addCustomEvent("onPullEvent-up.quiz", function (command, params) {
	      if (command === "update_answers") {
	        // Обработка Push-уведомления
	        console.log(params.message);
	        console.log(params.answer);
	        console.log(params.questionId);
	        _this.updateChart(params.answer, params.questionId);
	      }
	    });
	    this.reload();
	  }
	  babelHelpers.createClass(QuizShow, [{
	    key: "loadQuiz",
	    value: function loadQuiz() {
	      var _this2 = this;
	      return new Promise(function (resolve, reject) {
	        BX.ajax.runAction('up:quiz.quiz.getQuiz', {
	          data: {
	            id: _this2.quizId
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
	      var _this3 = this;
	      return new Promise(function (resolve, reject) {
	        BX.ajax.runAction('up:quiz.question.getQuestions', {
	          data: {
	            quizId: _this3.quizId
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
	      var _this4 = this;
	      return new Promise(function (resolve, reject) {
	        BX.ajax.runAction('up:quiz.answer.getAnswers', {
	          data: {
	            questionId: _this4.question.ID
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
	      var _this5 = this;
	      this.loadQuiz().then(function (quiz) {
	        _this5.quiz = quiz;
	        _this5.loadQuestions().then(function (questions) {
	          _this5.questions = questions;
	          if (_this5.questions.length === 0) {
	            _this5.rootNode.innerHTML = '';
	            _this5.rootNode.appendChild(Up.Quiz.QuizErrorManager.getNotQuestionsError());
	          } else {
	            _this5.currentQuestionId = +_this5.questions[0].ID;
	            _this5.loadQuestion(_this5.currentQuestionId).then(function (question) {
	              _this5.question = question;
	              _this5.loadAnswers().then(function (answers) {
	                _this5.answers = answers;
	                _this5.render();
	              });
	            });
	          }
	        });
	      }, function (error) {
	        _this5.rootNode.innerHTML = '';
	        _this5.rootNode.appendChild(Up.Quiz.QuizErrorManager.getQuizNotFoundError());
	      });
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      this.rootNode.innerHTML = "";
	      var QuizHeroSection = main_core.Tag.render(_templateObject || (_templateObject = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<section class=\"hero is-small is-primary\">\n\t\t\t\t<div class=\"hero-body\">\n\t\t\t\t\t<p class=\"title mb-0\">\n\t\t\t\t\t\t", "#", "\n\t\t\t\t\t</p>\n\t\t\t\t\t", "\n\t\t\t\t</div>\n\t\t\t</section>\n\t\t"])), main_core.Text.encode(this.quiz.TITLE), main_core.Text.encode(this.quiz.CODE), this.getShareNode(this.quiz));
	      this.rootNode.appendChild(QuizHeroSection);
	      var QuizResultContent = main_core.Tag.render(_templateObject2 || (_templateObject2 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<div class=\"box\">\n\t\t\t\t<div class=\"columns\">\n\t\t\t\t\t<div class=\"column is-one-quarter question-list\">\n\t\t\t\t\t\t<div class=\"question-list__title has-text-weight-semibold has-text-centered is-uppercase\">", "</div>\n\t\t\t\t\t\t", "\n\t\t\t\t\t</div>\n\t\t\t\t\t\t", "\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t"])), main_core.Loc.getMessage('UP_QUIZ_SHOW_QUESTION'), this.getQuestionsListNode(), this.getQuestionResultNode());
	      this.rootNode.appendChild(QuizResultContent);
	      this.renderChart();
	    }
	  }, {
	    key: "getQuestionsListNode",
	    value: function getQuestionsListNode() {
	      var _this6 = this;
	      var QuestionListNode = main_core.Tag.render(_templateObject3 || (_templateObject3 = babelHelpers.taggedTemplateLiteral(["<div class=\"question-list__questions\"></div>"])));
	      this.questions.forEach(function (question) {
	        var QuestionNode = main_core.Tag.render(_templateObject4 || (_templateObject4 = babelHelpers.taggedTemplateLiteral(["<a class=\"question-list__question button\">", "</a>"])), main_core.Text.encode(question.QUESTION_TEXT));
	        QuestionNode.onclick = function () {
	          _this6.renderQuestionResult(+main_core.Text.encode(question.ID));
	          _this6.currentQuestionId = +question.ID;
	        };
	        if (_this6.currentQuestionId === +question.ID) {
	          QuestionNode.classList.add('is-link', 'is-selected');
	        }
	        QuestionListNode.appendChild(QuestionNode);
	      });
	      QuestionListNode.onclick = function (e) {
	        var target = e.target;
	        var questions = QuestionListNode.querySelectorAll('.question-list__question');
	        if (!target.closest('.question-list__question')) return;
	        questions.forEach(function (question) {
	          if (target === question) {
	            if (!question.classList.contains('is-link')) question.classList.add('is-link', 'is-selected');
	          } else {
	            question.classList.remove('is-link', 'is-selected');
	          }
	        });
	      };
	      return QuestionListNode;
	    }
	  }, {
	    key: "getQuestionResultNode",
	    value: function getQuestionResultNode() {
	      return main_core.Tag.render(_templateObject5 || (_templateObject5 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<div class=\" column is-three-quarters statistics\" id=\"questionResult\">\n\t\t\t\t<div class=\"statistics__title has-text-weight-semibold has-text-centered is-uppercase\">", "</div>\n\t\t\t\t<div id=\"statistics__content\">\n\t\t\t\t\t<div class=\"statistics__question-title\">\n\t\t\t\t\t\t<strong>", " : </strong>\n\t\t\t\t\t\t", "\n\t\t\t\t\t</div>\n\t\t\t\t\t<div>\n\t\t\t\t\t\t<div id=\"chart\" style=\"width: 900px; height: 600px;\"></div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t"])), main_core.Loc.getMessage('UP_QUIZ_SHOW_STATISTIC'), main_core.Loc.getMessage('UP_QUIZ_SHOW_QUESTION'), main_core.Text.encode(this.question.QUESTION_TEXT));
	    }
	  }, {
	    key: "renderChart",
	    value: function renderChart() {
	      var _this$DISPLAY_TYPES$t;
	      // Create chart instance
	      var chartType = (_this$DISPLAY_TYPES$t = this.DISPLAY_TYPES[this.question.QUESTION_DISPLAY_ID]) !== null && _this$DISPLAY_TYPES$t !== void 0 ? _this$DISPLAY_TYPES$t : 'BarChart'; //BarChart - Default chart series
	      var data = this.getAnswersData();
	      if (chartType === 'PieChart') {
	        var chart = am4core.create('chart', 'PieChart');
	        var series = chart.series.push(new am4charts.PieSeries());
	        series.dataFields.value = "count";
	        series.dataFields.category = "answer";
	        chart.data = data;
	        chart.animated = true;
	        chart.legend = new am4charts.Legend();
	        if (this.chart) this.chart.dispose();
	        this.chart = chart;
	      } else if (chartType === 'WordCloud') {
	        // установка данных для диаграммы
	        var _chart = am4core.create('chart', am4plugins_wordCloud.WordCloud);
	        _chart.data = data;

	        // настройка серии Word Cloud
	        var _series = _chart.series.push(new am4plugins_wordCloud.WordCloudSeries());
	        _series.dataFields.word = "answer";
	        _series.dataFields.value = "count";
	        _series.colors = new am4core.ColorSet();

	        // настройка свойств серии
	        _series.minFontSize = 18;
	        _series.maxFontSize = 60;
	        _series.labels.template.tooltipText = "".concat(main_core.Loc.getMessage('UP_QUIZ_SHOW_ANSWER_OPTION'), ": {answer}\n").concat(main_core.Loc.getMessage('UP_QUIZ_SHOW_ANSWERS_COUNT'), ": {count}");
	        _series.labels.template.fillOpacity = 0.9;
	        _series.angles = [0, -90];

	        // настройка свойств диаграммы
	        //chart.fontSize = 20;
	        //chart.fontFamily = 'Courier New';
	        //chart.background.fill = am4core.color('#F5F5F5');
	        //chart.background.stroke = am4core.color('#D3D3D3');
	        //chart.background.strokeWidth = 2;
	        //chart.background.cornerRadius = 10;
	        //chart.padding(40, 40, 40, 40);
	        _chart.legend = null;
	        if (this.chart) this.chart.dispose();
	        this.chart = _chart;
	      } else if (chartType === 'BarChart' || 1) {
	        // установка данных для диаграммы
	        var _chart2 = am4core.create('chart', am4charts.XYChart);
	        _chart2.data = data;
	        var categoryAxis = _chart2.xAxes.push(new am4charts.CategoryAxis());
	        categoryAxis.dataFields.category = 'answer';
	        categoryAxis.renderer.grid.template.location = 0;

	        // создание оси Y
	        var valueAxis = _chart2.yAxes.push(new am4charts.ValueAxis());
	        valueAxis.renderer.grid.template.location = 0;
	        valueAxis.renderer.labels.template.step = 2;
	        valueAxis.min = 0;
	        valueAxis.renderer.minGridDistance = 50;
	        var label = valueAxis.renderer.labels.template;
	        label.numberFormatter = new am4core.NumberFormatter();
	        label.numberFormatter.numberFormat = "#";

	        // создание серии колонок
	        var _series2 = _chart2.series.push(new am4charts.ColumnSeries());
	        _series2.dataFields.categoryX = 'answer';
	        _series2.dataFields.valueY = 'count';
	        _series2.columns.template.tooltipText = "".concat(main_core.Loc.getMessage('UP_QUIZ_SHOW_ANSWER_OPTION'), ": {categoryX}\n").concat(main_core.Loc.getMessage('UP_QUIZ_SHOW_ANSWERS_COUNT'), ": {valueY}");
	        var colorSet = new am4core.ColorSet();
	        colorSet.colors = [am4core.color("#FFC300"), am4core.color("#FF5733"), am4core.color("#C70039"), am4core.color("#900C3F"), am4core.color("#581845"), am4core.color("#0074D9"), am4core.color("#7FDBFF"), am4core.color("#39CCCC"), am4core.color("#3D9970"), am4core.color("#2ECC40"), am4core.color("#01FF70"), am4core.color("#FFDC00"), am4core.color("#FF851B"), am4core.color("#FF4136"), am4core.color("#B10DC9")];
	        _series2.columns.template.adapter.add("fill", function (fill, target) {
	          return colorSet.next();
	        });
	        // убрать границу у колонок
	        _series2.columns.template.strokeOpacity = 0;

	        // настройка свойств диаграммы
	        _chart2.padding(40, 40, 40, 40);
	        //chart.background.fill = am4core.color('#F5F5F5');
	        //chart.background.stroke = am4core.color('#D3D3D3');
	        //chart.background.strokeWidth = 2;
	        //chart.background.cornerRadius = 10;
	        if (this.chart) this.chart.dispose();
	        this.chart = _chart2;
	      }
	      this.chart.animationDuration = 5000; // продолжительность анимации в миллисекундах
	      this.chart.animationEasing = am4core.ease.sinOut;
	    }
	  }, {
	    key: "updateChart",
	    value: function updateChart(answerValue, questionID) {
	      if (questionID !== this.currentQuestionId) {
	        return;
	      }
	      for (var i = 0; i < this.chart.data.length; i++) {
	        if (answerValue === this.chart.data[i].answer) {
	          this.chart.data[i].count++;
	          this.chart.invalidateRawData();
	          return;
	        }
	      }
	      this.chart.addData({
	        answer: answerValue,
	        count: 1
	      });
	      this.chart.invalidateData();
	    } //update ResultNode
	  }, {
	    key: "renderQuestionResult",
	    value: function renderQuestionResult(questionId) {
	      var _this7 = this;
	      BX.showWait("statistics__content", "", "big", {
	        useIcon: true,
	        icon: "spinner"
	      });
	      this.loadQuestion(questionId).then(function (question) {
	        _this7.question = question;
	        _this7.loadAnswers().then(function (answers) {
	          _this7.answers = answers;
	          document.getElementById('questionResult').replaceWith(_this7.getQuestionResultNode());
	          _this7.renderChart();
	          BX.closeWait();
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
	      return result;
	    }
	  }, {
	    key: "getShareNode",
	    value: function getShareNode(quiz) {
	      var quizTakeLink = "".concat(location.host, "/quiz/").concat(main_core.Text.encode(quiz.CODE), "/take");
	      var shareButton = main_core.Tag.render(_templateObject6 || (_templateObject6 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<button class=\"button\">\n\t\t\t\t<i class=\"fa-solid fa-qrcode\"></i>\n\t\t\t</button>\n\t\t"])));
	      var shareModal = main_core.Tag.render(_templateObject7 || (_templateObject7 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<div class=\"modal\">\n\t\t\t\t<div class=\"modal-background to-close\"></div>\n\t\t\t\t<div class=\"modal-content box qr-modal\">\n\t\t\t\t\t<h1 style=\" font-size: 40px; text-align: center; margin-bottom: 10px; \">\n\t\t\t\t\t\t", "\n    \t\t\t\t</h1>\n\t\t\t\t\t<div class=\"qr mb-4\"></div>\n\t\t\t\t\t<div>\n\t\t\t\t\t\t<input type=\"text\" class=\"input mb-2\" value=\"", "\" readonly>\n\t\t\t\t\t\t<button class=\"button is-dark copy\">", "</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<button class=\"modal-close is-large to-close\" aria-label=\"close\"></button>\n\t\t\t</div>\n\t\t"])), main_core.Text.encode(quiz.CODE), main_core.Text.encode(quizTakeLink), main_core.Loc.getMessage('UP_QUIZ_SHOW_COPY'));
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
	        content: main_core.Loc.getMessage('UP_QUIZ_SHOW_LINK_COPY_SUCCESS'),
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
	      return main_core.Tag.render(_templateObject8 || (_templateObject8 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t", "\n\t\t\t", "\n\t\t"])), shareButton, shareModal);
	    }
	  }]);
	  return QuizShow;
	}();

	exports.QuizShow = QuizShow;

}((this.Up.Quiz = this.Up.Quiz || {}),BX));
