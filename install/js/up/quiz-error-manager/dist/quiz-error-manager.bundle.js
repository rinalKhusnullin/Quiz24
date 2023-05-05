this.Up = this.Up || {};
(function (exports,main_core) {
	'use strict';

	var _templateObject, _templateObject2, _templateObject3;
	var QuizErrorManager = /*#__PURE__*/function () {
	  function QuizErrorManager() {
	    babelHelpers.classCallCheck(this, QuizErrorManager);
	  }

	  // error_code : error_message
	  babelHelpers.createClass(QuizErrorManager, null, [{
	    key: "getQuizNotFoundError",
	    value: function getQuizNotFoundError() {
	      return main_core.Tag.render(_templateObject || (_templateObject = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<section class=\"section error-message\">\n\t\t\t\t<div class=\"error-content\">\n\t\t\t\t\t<span class=\"error-icon\"><i class=\"fa-regular fa-circle-question fa-2xl\"></i></span>\n\t\t\t\t\t<div class=\"error-info\">\n\t\t\t\t\t\t<h1 class=\"error-title\">", "</h1>\n\t\t\t\t\t\t<a href=\"/\" class=\"is-ghost is-underlined\">", "</a>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</section>\n\t\t"])), main_core.Loc.getMessage('UP_QUIZ_ERROR_QUIZ_NOT_FOUND_TITLE'), main_core.Loc.getMessage('UP_QUIZ_ERROR_GO_TO_MAIN_PAGE'));
	    }
	  }, {
	    key: "getQuizNotAvailableError",
	    value: function getQuizNotAvailableError() {
	      return main_core.Tag.render(_templateObject2 || (_templateObject2 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<section class=\"section error-message\">\n\t\t\t\t<div class=\"error-content\">\n\t\t\t\t\t<span class=\"error-icon\"><i class=\"fa-solid fa-lock fa-2xl\"></i></span>\n\t\t\t\t\t<div class=\"error-info\">\n\t\t\t\t\t\t<h1 class=\"error-title\">", "</h1>\n\t\t\t\t\t\t<a href=\"/\" class=\"is-ghost is-underlined\">", "</a>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</section>\n\t\t"])), main_core.Loc.getMessage('UP_QUIZ_ERROR_QUIZ_NOT_AVAILABLE_TITLE'), main_core.Loc.getMessage('UP_QUIZ_ERROR_GO_TO_MAIN_PAGE'));
	    }
	  }, {
	    key: "getNotQuestionsError",
	    value: function getNotQuestionsError() {
	      return main_core.Tag.render(_templateObject3 || (_templateObject3 = babelHelpers.taggedTemplateLiteral(["\n\t\t\t<section class=\"section error-message\">\n\t\t\t\t<div class=\"error-content\">\n\t\t\t\t\t<span class=\"error-icon\"><i class=\"fa-sharp fa-solid fa-person-circle-question fa-2xl\"></i></span>\n\t\t\t\t\t<div class=\"error-info\">\n\t\t\t\t\t\t<h1 class=\"error-title\">", "</h1>\n\t\t\t\t\t\t<a href=\"/\" class=\"is-ghost is-underlined\">", "</a>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</section>\n\t\t"])), main_core.Loc.getMessage('UP_QUIZ_ERROR_QUIZ_NOT_HAS_QUESTIONS'), main_core.Loc.getMessage('UP_QUIZ_ERROR_GO_TO_MAIN_PAGE'));
	    }
	  }, {
	    key: "getMessage",
	    value: function getMessage(errorCode) {
	      return this.ERROR_MAP[errorCode];
	    }
	  }, {
	    key: "test",
	    value: function test() {
	      return 'up:jaypmt_npet_gt_nd_qdlz';
	    }
	  }]);
	  return QuizErrorManager;
	}();
	babelHelpers.defineProperty(QuizErrorManager, "ERROR_MAP", {
	  'empty_quiz_title': main_core.Loc.getMessage('UP_QUIZ_ERROR_EMPTY_QUIZ_TITLE'),
	  'exceeding_quiz_title': main_core.Loc.getMessage('UP_QUIZ_ERROR_EXCEEDING_QUIZ_TITLE'),
	  'unauthorized_user': main_core.Loc.getMessage('UP_QUIZ_ERROR_UNAUTHORIZED_USER'),
	  'max_count_quizzes': main_core.Loc.getMessage('UP_QUIZ_ERROR_MAX_COUNT_QUIZZES'),
	  'invalid_quiz_code': main_core.Loc.getMessage('UP_QUIZ_ERROR_INVALID_QUIZ_CODE'),
	  'invalid_quiz_id': main_core.Loc.getMessage('UP_QUIZ_ERROR_INVALID_QUIZ_ID'),
	  'invalid_quiz_state': main_core.Loc.getMessage('UP_QUIZ_ERROR_INVALID_QUIZ_STATE'),
	  'quiz_not_found': main_core.Loc.getMessage('UP_QUIZ_ERROR_QUIZ_NOT_FOUND'),
	  'empty_question': main_core.Loc.getMessage('UP_QUIZ_ERROR_EMPTY_QUESTION'),
	  'empty_question_text': main_core.Loc.getMessage('UP_QUIZ_ERROR_EMPTY_QUESTION_TEXT'),
	  'exceeding_question_text': main_core.Loc.getMessage('UP_QUIZ_ERROR_EXCEEDING_QUESTION_TEXT'),
	  'invalid_question_id': main_core.Loc.getMessage('UP_QUIZ_ERROR_INVALID_QUESTION_ID'),
	  'invalid_question_type_id': main_core.Loc.getMessage('UP_QUIZ_ERROR_INVALID_QUESTION_TYPE_ID'),
	  'invalid_display_type_id': main_core.Loc.getMessage('UP_QUIZ_ERROR_INVALID_DISPLAY_TYPE_ID'),
	  'parse_options': main_core.Loc.getMessage('UP_QUIZ_ERROR_PARSE_OPTIONS'),
	  'empty_options': main_core.Loc.getMessage('UP_QUIZ_ERROR_EMPTY_OPTIONS'),
	  'empty_option': main_core.Loc.getMessage('UP_QUIZ_ERROR_EMPTY_OPTION'),
	  'exceeding_option': main_core.Loc.getMessage('UP_QUIZ_ERROR_EXCEEDING_OPTION'),
	  'max_count_options': main_core.Loc.getMessage('UP_QUIZ_ERROR_MAX_COUNT_OPTIONS'),
	  'question_not_found': main_core.Loc.getMessage('UP_QUIZ_ERROR_QUESTION_NOT_FOUND'),
	  'max_count_questions': main_core.Loc.getMessage('UP_QUIZ_ERROR_MAX_COUNT_QUESTIONS'),
	  'empty_answer': main_core.Loc.getMessage('UP_QUIZ_ERROR_EMPTY_ANSWER'),
	  'exceeding_answer': main_core.Loc.getMessage('UP_QUIZ_ERROR_EXCEEDING_ANSWER'),
	  'invalid_answer': main_core.Loc.getMessage('UP_QUIZ_ERROR_INVALID_ANSWER'),
	  'inactive_quiz': main_core.Loc.getMessage('UP_QUIZ_ERROR_INACTIVE_QUIZ')
	});

	exports.QuizErrorManager = QuizErrorManager;

}((this.Up.Quiz = this.Up.Quiz || {}),BX));
