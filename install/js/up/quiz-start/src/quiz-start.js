import {Type, Tag, Text, Loc} from 'main.core';

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
				<h1 class="title is-4">${Loc.getMessage('UP_QUIZ_START_MESSAGE')}</h1>
					<div class="field has-addons has-addons-centered">
						<div class="control">
							<input class="input is-dark" type="text" id="quiz-code-input" placeholder="${Loc.getMessage('UP_QUIZ_START_ENTER_CODE')}">
							<p class="help is-danger" id="quiz-code-helper"></p>
						</div>
						<div class="control">
							<a class="button is-dark" id="take-button">
								${Loc.getMessage('UP_QUIZ_START_TAKE_QUIZ')}
							</a>
						</div>
					</div>
				<strong>${Loc.getMessage('UP_QUIZ_START_OR')}</strong>
				<div>
					<a class="is-underlined" href="/login">${Loc.getMessage('UP_QUIZ_START_TO_LOGIN')}</a> ${Loc.getMessage('UP_QUIZ_START_TO_BE_ABLE_TO_CREATE_QUIZZES')}.
				</div>
			</div>
		`;

		const codeHelper = StartContainerNode.querySelector('#quiz-code-helper');
		const codeInput = StartContainerNode.querySelector('#quiz-code-input');
		const takeButton = StartContainerNode.querySelector('#take-button');
		codeInput.oninput = () => {
			codeHelper.textContent = '';
		}
		takeButton.onclick = () => {
			if (codeInput.value.trim() === '')
			{
				codeHelper.textContent = Loc.getMessage('UP_QUIZ_START_EMPTY_CODE_ERROR');
				return;
			}
			location.href = `/quiz/${codeInput.value}/take`;
		}
		this.rootNode.appendChild(StartContainerNode);
	}
}