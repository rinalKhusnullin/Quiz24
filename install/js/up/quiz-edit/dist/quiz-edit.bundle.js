this.Up = this.Up || {};
(function (exports,main_core) {
	'use strict';

	var _templateObject, _templateObject2, _templateObject3;
	var QuizEdit = /*#__PURE__*/function () {
	  function QuizEdit() {
	    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    babelHelpers.classCallCheck(this, QuizEdit);
	    babelHelpers.defineProperty(this, "QUESTION_TYPES", {
	      free: 'Свободный ответ',
	      selectable: 'Выбираемый ответ'
	    });
	    babelHelpers.defineProperty(this, "DISPLAY_TYPES", {
	      pieChart: 'Круговая диаграмма',
	      barChart: 'Столбчатая диаграмма',
	      tagCloud: 'Облако тэгов',
	      rawOutput: 'Сырой вывод'
	    });
	    if (main_core.Type.isStringFilled(options.rootNodeId)) {
	      this.rootNodeId = options.rootNodeId;
	    } else {
	      throw new Error('QuizEdit: options.rootNodeId required');
	    }
	    this.rootNode = document.getElementById(this.rootNodeId);
	    if (!this.rootNode) {
	      throw new Error("QuizEdit: element with id \"".concat(this.rootNodeId, "\" not found"));
	    }
	    this.reload();
	  }
	  babelHelpers.createClass(QuizEdit, [{
	    key: "reload",
	    value: function reload() {
	      var _this = this;
	      this.loadQuestion().then(function (question) {
	        _this.question = question;
	        _this.render();
	      });
	    } // loadQuestions()
	    // {
	    // 	return new Promise((resolve, reject) => {
	    // 		BX.ajax.runAction(
	    // 				'up:quiz.quiz.getQuestions',
	    // 				{
	    // 					data:{
	    // 						quizId:1,
	    // 					}
	    // 				}
	    // 			)
	    // 			.then((response) => {
	    // 				const question = response.data.question;
	    // 				resolve(question);
	    // 			})
	    // 			.catch((error) => {
	    // 				console.error(error);
	    // 				reject(error);
	    // 			})
	    // 		;
	    // 	});
	    // }
	  }, {
	    key: "loadQuestion",
	    value: function loadQuestion() {
	      // [
	      // 	'question' => [
	      // 		'title' => 'Кто же нальет кофе?',
	      // 		'questionType' => 'selectable',
	      // 		'questionTypes' => ['free', 'selectable'],
	      // 		'displayType' => 'pieChart',
	      // 		'displayTypes' => ['pieChart', 'barChart', 'tagCloud', 'rawOutput'],
	      // 		'selectableAnswers' => ['Андрей', 'Кошка', 'Собака', 'Затрудняюсь ответить']
	      // 	]
	      // ];

	      return new Promise(function (resolve, reject) {
	        BX.ajax.runAction('up:quiz.quiz.getQuestion', {
	          data: {
	            id: 1
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
	    key: "render",
	    value: function render() {
	      this.rootNode.innerHTML = "";

	      //рендер вопросов
	      var QuestionsContainerNode = main_core.Tag.render(_templateObject || (_templateObject = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<div class=\"column is-one-fifth question-list\">\n\t\t\t\t<div class=\"question-list__title\">\u0412\u043E\u043F\u0440\u043E\u0441\u044B</div>\n\t\t\t\t<div class=\"question-list__questions\" id=\"questions\">\n\t\t\t\t\t<div class=\"question-list__question\">\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"question-list__question\">\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"question-list__question\">\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"question-list__question\">\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"question-list__question\">\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"question-list__question\">\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"question-list__question\">\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"question-list__question\">\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"question-list__question\">\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t"])));
	      this.rootNode.appendChild(QuestionsContainerNode);

	      //рендер превью
	      //Название вопроса, тип ответа (выбираемый -> варианты ответа),
	      var PreviewContainerNode = main_core.Tag.render(_templateObject2 || (_templateObject2 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<div class=\"column is-three-fifths question-preview\">\n\t\t\t\t<div class=\"question-preview__title\">\u041F\u0440\u0435\u0432\u044C\u044E</div>\n\t\t\t\t<div class=\"box\">\n\t\t\t\t\t<h3 class=\"title question-preview__question-text\" id=\"questionTextPreview\">", "</h3>\n\t\t\t\t\t\t<div class=\"control\" id=\"selectablePreview\">\n\t\t\t\t\t\t\t<label class=\"radio\">\n\t\t\t\t\t\t\t\t<input type=\"radio\">\n\t\t\t\t\t\t\t\t\u0422\u0443\u0442 \u0437\u0430\u0445\u0430\u0440\u0434\u043A\u043E\u0436\u0435\u043D\u043E \u043F\u043E\u043A\u0430 \u0447\u0442\u043E\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t<label class=\"radio\">\n\t\t\t\t\t\t\t\t<input type=\"radio\">\n\t\t\t\t\t\t\t\t\u0422\u0443\u0442 \u0437\u0430\u0445\u0430\u0440\u0434\u043A\u043E\u0436\u0435\u043D\u043E \u043F\u043E\u043A\u0430 \u0447\u0442\u043E\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<input type=\"text\" class=\"input\" placeholder=\"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043E\u0442\u0432\u0435\u0442\" id=\"freePreview\">\n\t\t\t\t\t<a class=\"button is-success\" disabled>\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C</a>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"box\" id=\"displayTypePreview\">\n\t\t\t\t\t<h3 class=\"title\">\u0420\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u044B \u043E\u043F\u0440\u043E\u0441\u0430:</h3>\n\t\t\t\t\t<div id=\"pieChartPreview\">\n\t\t\t\t\t\t\u0422\u0443\u0442 \u0442\u0438\u043F\u043E \u043F\u0440\u0435\u0432\u044C\u044E \u043A\u0440\u0443\u0433\u043E\u0432\u043E\u0439\n\t\t\t\t\t</div>\n\t\t\t\t\t<div id=\"barChartPreview\" class=\"hidden\">\n\t\t\t\t\t\t\u0422\u0443\u0442 \u0442\u0438\u043F\u043E \u043F\u0440\u0435\u0432\u044C\u044E \u0421\u0442\u043E\u043B\u0431\u0447\u0430\u0442\u043E\u0439\n\t\t\t\t\t</div>\n\t\t\t\t\t<div id=\"tagCloudPreview\" class=\"hidden\">\n\t\t\t\t\t\t\u0422\u0443\u0442 \u0442\u0438\u043F\u043E \u043F\u0440\u0435\u0432\u044C\u044E \u041E\u0431\u043B\u0430\u043A\u043E \u0442\u044D\u0433\u043E\u0432\n\t\t\t\t\t</div>\n\t\t\t\t\t<div id=\"rawOutputPreview\" class=\"hidden\">\n\t\t\t\t\t\t\u0422\u0443\u0442 \u0442\u0438\u043F\u043E \u043F\u0440\u0435\u0432\u044C\u044E \u0421\u044B\u0440\u043E\u0432\u043E\u0433\u043E \u0432\u044B\u0432\u043E\u0434\u0430\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t"])), this.question.title);
	      this.rootNode.appendChild(PreviewContainerNode);

	      //рендер настроек
	      var SettingsContainerNode = main_core.Tag.render(_templateObject3 || (_templateObject3 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<div class=\"column question-settings\">\n\t\t\t\t<div class=\"question-settings__title\">\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438</div>\n\t\t\t\t\n\t\t\t\t<div class=\"question-settings__input-title\">\u0422\u0435\u043A\u0441\u0442 \u0432\u043E\u043F\u0440\u043E\u0441\u0430:</div>\n\t\t\t\t<input value=\"", "\" class=\"input\" type=\"text\" placeholder=\"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0432\u043E\u043F\u0440\u043E\u0441\" name=\"questionText\" id=\"questionText\">\n\t\t\t\t\n\t\t\t\t<div class=\"question-settings__input-title\">\u0422\u0438\u043F \u043E\u0442\u0432\u0435\u0442\u0430:</div>\n\t\t\t\t<select class=\"select\" name=\"questionType\" id=\"questionType\">\n\t\t\t\t\t<option value=\"free\" selected>", "</option>\n\t\t\t\t\t<option value=\"selectable\">", "</option>\n\t\t\t\t</select>\n\t\t\t\t\n\t\t\t\t<div class=\"question-settings__selectable-answers hidden\" id=\"selectableAnswers\">\n\t\t\t\t<div class=\"question-settings__input-title\">\u0412\u0430\u0440\u0438\u0430\u0442\u044B \u043E\u0442\u0432\u0435\u0442\u0430:</div>\n\t\t\t\t<div class=\"question-settings__answers-container\" id=\"answersContainer\">\n\t\t\t\t\t<input type=\"text\" class=\"question-settings__answer input\" name=\"selectableAnswer\">\n\t\t\t\t</div>\n\t\t\t\t<a class=\"button\" id=\"addAnswerButton\">\n\t\t\t\t\t<i class=\"fa-solid fa-plus \"></i>\n\t\t\t\t</a>\n\t\t\t</div>\n\t\t\t\t\n\t\t\t\t<div class=\"question-settings__input-title\">\u0422\u0438\u043F \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u043E\u0432:</div>\n\t\t\t\t<select name=\"displayType\" id=\"displayType\">\n\t\t\t\t\t<option value=\"pieChart\" selected>\u041A\u0440\u0443\u0433\u043E\u0432\u0430\u044F \u0434\u0438\u0430\u0433\u0440\u0430\u043C\u043C\u0430</option>\n\t\t\t\t\t<option value=\"tagCloud\">\u041E\u0431\u043B\u0430\u043A\u043E \u0442\u044D\u0433\u043E\u0432</option>\n\t\t\t\t\t<option value=\"barChart\">\u0421\u0442\u043E\u043B\u0431\u0447\u0430\u0442\u0430\u044F \u0434\u0438\u0430\u0433\u0440\u0430\u043C\u043C\u0430</option>\n\t\t\t\t\t<option value=\"rawOutput\">\u0422\u0435\u043A\u0441\u0442\u043E\u0432\u044B\u0439 \u0444\u043E\u0440\u043C\u0430\u0442</option>\n\t\t\t\t</select>\n\t\t\t\t<button type=\"submit\" class=\"button is-success\">\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C</button>\n\t\t\t</div>\n\t\t"])), this.question.title, this.QUESTION_TYPES.free, this.QUESTION_TYPES.selectable);
	      SettingsContainerNode.oninput = this.renderPreview;
	      this.rootNode.appendChild(SettingsContainerNode);
	    }
	  }, {
	    key: "renderPreview",
	    value: function renderPreview() {
	      alert(1);
	      //идея такая!
	      // this.question = getQuestionSettings(); //Получаем информацию о настройках вопроса
	      // this.renderPreview(); //Подгружаем превью
	    }
	  }]);
	  return QuizEdit;
	}();

	exports.QuizEdit = QuizEdit;

}((this.Up.Quiz = this.Up.Quiz || {}),BX));
