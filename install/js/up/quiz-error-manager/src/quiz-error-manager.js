import {Tag} from 'main.core';
import './quiz-error-manager.css';

export class QuizErrorManager
{
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
}