import {Type, Tag} from 'main.core';

export class QuizStart
{
	constructor(options = {})
	{
		if (Type.isStringFilled(options.rootNodeId))
		{
			this.rootNodeId = options.rootNodeId;
		}
		else
		{
			throw new Error('QuizStart: options.rootNodeId required');
		}

		this.rootNode = document.getElementById(this.rootNodeId);
		if (!this.rootNode)
		{
			throw new Error(`QuizStart: element with id "${this.rootNodeId}" not found`);
		}

		this.reload();
	}

	reload()
	{
		this.render();
	}

	render()
	{
		const StartContainerNode = Tag.render`
			<div class="box not-auth">
				<h1 class="title is-4">Укажите код опроса, в котором хотите принять участие</h1>
					<div class="field has-addons has-addons-centered">
						<div class="control">
							<input class="input is-dark" type="text" id="quiz-code-input" placeholder="Введите quiz-code">
						</div>
						<div class="control">
							<a class="button is-dark" id="take-button">
								Пройти опрос
							</a>
						</div>
					</div>
				<strong>ИЛИ</strong>
				<div>
					Выполните <a class="is-underlined" href="/login">вход</a>, для возможности создавать опросы.
				</div>
			</div>
		`;

		const codeInput = StartContainerNode.querySelector('#quiz-code-input');
		const takeButton = StartContainerNode.querySelector('#take-button');
		codeInput.oninput = () => {
			this.quizCode = codeInput.value;
		}
		takeButton.onclick = () => {
			location.href = `/quiz/${this.quizCode}/take`;
		}
		this.rootNode.appendChild(StartContainerNode);
	}
}