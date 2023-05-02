import {Tag, Loc} from 'main.core';
import './quiz-error-manager.css';

export class QuizErrorManager
{
	errorMap = {
		'empty_quiz_title' 		: Loc.getMessage('UP_QUIZ_ERROR_EMPTY_QUIZ_TITLE'),
		'exceeding_quiz_title' 	: Loc.getMessage('UP_QUIZ_ERROR_EXCEEDING_QUIZ_TITLE'),
		'unauthorized_user' 	: Loc.getMessage('UP_QUIZ_ERROR_UNAUTHORIZED_USER'),
		'exceeding_quiz_count'	: Loc.getMessage('UP_QUIZ_ERROR_EXCEEDING_QUIZ_COUNT'),
		'invalid_quiz_code' 	: Loc.getMessage('UP_QUIZ_ERROR_INVALID_QUIZ_CODE'),
		'invalid_quiz_id' 		: Loc.getMessage('UP_QUIZ_ERROR_INVALID_QUIZ_ID'),
		'invalid_quiz_state' 	: Loc.getMessage('UP_QUIZ_ERROR_INVALID_QUIZ_STATE'),
		'quiz_not_found' 		: Loc.getMessage('UP_QUIZ_ERROR_QUIZ_NOT_FOUND'),
	};

	constructor() {}

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

	static getMessage(errorCode)
	{
		return this.errorMap[errorCode];
	}
}