import {Tag, Loc} from 'main.core';
import './quiz-error-manager.css';

export class QuizErrorManager
{
	constructor() {}

	// error_code : error_message
	static ERROR_MAP = {
		'empty_quiz_title' 		: Loc.getMessage('UP_QUIZ_ERROR_EMPTY_QUIZ_TITLE'),
		'exceeding_quiz_title' 	: Loc.getMessage('UP_QUIZ_ERROR_EXCEEDING_QUIZ_TITLE'),
		'unauthorized_user' 	: Loc.getMessage('UP_QUIZ_ERROR_UNAUTHORIZED_USER'),
		'max_count_quizzes'		: Loc.getMessage('UP_QUIZ_ERROR_MAX_COUNT_QUIZZES'),
		'invalid_quiz_code' 	: Loc.getMessage('UP_QUIZ_ERROR_INVALID_QUIZ_CODE'),
		'invalid_quiz_id' 		: Loc.getMessage('UP_QUIZ_ERROR_INVALID_QUIZ_ID'),
		'invalid_quiz_state' 	: Loc.getMessage('UP_QUIZ_ERROR_INVALID_QUIZ_STATE'),
		'quiz_not_found' 		: Loc.getMessage('UP_QUIZ_ERROR_QUIZ_NOT_FOUND'),
		'empty_question'		: Loc.getMessage('UP_QUIZ_ERROR_EMPTY_QUESTION'),
		'empty_question_text'	: Loc.getMessage('UP_QUIZ_ERROR_EMPTY_QUESTION_TEXT'),
		'exceeding_question_text':Loc.getMessage('UP_QUIZ_ERROR_EXCEEDING_QUESTION_TEXT'),
		'invalid_question_id'	: Loc.getMessage('UP_QUIZ_ERROR_INVALID_QUESTION_ID'),
		'invalid_question_type_id' : Loc.getMessage('UP_QUIZ_ERROR_INVALID_QUESTION_TYPE_ID'),
		'invalid_display_type_id': Loc.getMessage('UP_QUIZ_ERROR_INVALID_DISPLAY_TYPE_ID'),
		'parse_options'			: Loc.getMessage('UP_QUIZ_ERROR_PARSE_OPTIONS'),
		'empty_options' 		: Loc.getMessage('UP_QUIZ_ERROR_EMPTY_OPTIONS'),
		'empty_option'			: Loc.getMessage('UP_QUIZ_ERROR_EMPTY_OPTION'),
		'exceeding_option'		: Loc.getMessage('UP_QUIZ_ERROR_EXCEEDING_OPTION'),
		'max_count_options'		: Loc.getMessage('UP_QUIZ_ERROR_MAX_COUNT_OPTIONS'),
		'question_not_found'	: Loc.getMessage('UP_QUIZ_ERROR_QUESTION_NOT_FOUND'),
		'max_count_questions'	: Loc.getMessage('UP_QUIZ_ERROR_MAX_COUNT_QUESTIONS'),
		'empty_answer'			: Loc.getMessage('UP_QUIZ_ERROR_EMPTY_ANSWER'),
		'exceeding_answer'		: Loc.getMessage('UP_QUIZ_ERROR_EXCEEDING_ANSWER'),
		'invalid_answer'		: Loc.getMessage('UP_QUIZ_ERROR_INVALID_ANSWER'),
		'inactive_quiz'			: Loc.getMessage('UP_QUIZ_ERROR_INACTIVE_QUIZ'),
	};

	static getQuizNotFoundError()
	{
		return Tag.render`
			<section class="section error-message">
				<div class="error-content">
					<span class="error-icon"><i class="fa-regular fa-circle-question fa-2xl"></i></span>
					<div class="error-info">
						<h1 class="error-title">Опрос не найден</h1>
						<a href="/" class="is-ghost is-underlined">Вернуться на главную</a>
					</div>
				</div>
			</section>
		`;
	}

	static getQuizNotAvailableError()
	{
		return Tag.render`
			<section class="section error-message">
				<div class="error-content">
					<span class="error-icon"><i class="fa-solid fa-lock fa-2xl"></i></span>
					<div class="error-info">
						<h1 class="error-title">Опрос закрыт для прохождения</h1>
						<a href="/" class="is-ghost is-underlined">Вернуться на главную</a>
					</div>
				</div>
			</section>
		`;
	}

	static showNotify(errorCode)
	{
		return 'Ошибка крутая типо йоу';
	}

	static getMessage(errorCode)
	{
		return this.ERROR_MAP[errorCode];
	}
}