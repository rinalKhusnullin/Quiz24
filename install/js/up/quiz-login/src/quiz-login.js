import {Type, Tag, Loc} from 'main.core';

export class QuizLogin
{
	constructor(options = {})
	{
		if (Type.isStringFilled(options.rootNodeId))
		{
			this.rootNodeId = options.rootNodeId;
		}
		else
		{
			throw new Error('QuizLogin: options.rootNodeId required');
		}

		this.rootNode = document.getElementById(this.rootNodeId);
		if (!this.rootNode)
		{
			throw new Error(`QuizLogin: element with id "${this.rootNodeId}" not found`);
		}

		this.reload();
	}

	reload()
	{
		this.render();
	}

	auth(login, password){

		return new Promise((resolve, reject) => {
			BX.ajax.runAction(
					'up:quiz.user.auth',{
						data : {
							login: login,
							password: password
						}
					}
				)
				.then((response) => {
					if (response.status === "success")
					{
						if (response.data.status === "success")
						{
							resolve(true);
							document.location.href = '/';
						}
						else{
							resolve(false);
							this.failAuth();
						}
					}
					else
					{
						console.log(response.message);
					}
				})
				.catch((error) => {
					console.error(error);
					reject(error);
				})
			;
		});
	}

	render()
	{
		const LoginContainerNode = Tag.render`
			<div class="login-container-node">
				<h1 class="title">${Loc.getMessage('UP_QUIZ_LOGIN_COME_IN')}</h1>
				<form action="##">
					<div class="field">
						<label class="label">${Loc.getMessage('UP_QUIZ_LOGIN_LOGIN')}</label>
						<div class="control has-icons-left has-icons-right">
							<input id="login-input" class="input" type="text" placeholder="${Loc.getMessage('UP_QUIZ_LOGIN_ENTER_LOGIN')}" value="">
							<span class="icon is-small is-left">
								<i class="fas fa-user"></i>
							</span>
						</div>
					</div>
		
					<div class="field">
						<label class="label">Пароль</label>
						<p class="control has-icons-left">
							<input id="password-input" class="input" type="password" placeholder="${Loc.getMessage('UP_QUIZ_LOGIN_ENTER_PASSWORD')}">
							<span class="icon is-small is-left">
								<i class="fas fa-lock"></i>
							</span>
						</p>
					</div>
					
					<article class="message is-danger" id="error-container"></article>
		
					<div class="mb-2"><a href="/registration" class="is-underlined">${Loc.getMessage('UP_QUIZ_LOGIN_CREATE_ACCOUNT')}</a> ${Loc.getMessage('UP_QUIZ_LOGIN_IF_NOT_EXISTS')}.
					</div>
		
					<div class="field is-grouped">
						<div class="control login-button">
							<button type="submit" id="submit-button" class="button is-link">${Loc.getMessage('UP_QUIZ_LOGIN_COME_IN')}</button>
						</div>
					</div>
				</form>
			</div>
		`;
		const loginInput = LoginContainerNode.querySelector('#login-input');
		const passwordInput = LoginContainerNode.querySelector('#password-input');
		const submitButton = LoginContainerNode.querySelector('#submit-button');

		submitButton.onclick = () => {
			submitButton.classList.add('is-loading');
			this.auth(loginInput.value, passwordInput.value).then(isSuccess => {
				if (isSuccess) {
					submitButton.innerHTML = `<i class="fa-solid fa-check"></i>`;
					submitButton.classList.add('is-success');
				}
				submitButton.classList.remove('is-loading');
			});
		}

		this.rootNode.appendChild(LoginContainerNode);
	}

	failAuth()
	{
		const errorContainer = document.getElementById('error-container');
		const loginInput = document.getElementById('login-input');
		const passwordInput = document.getElementById('password-input')

		if (!errorContainer.hasChildNodes())
		{
			errorContainer.appendChild(Tag.render`<div class="message-body">
				${Loc.getMessage('UP_QUIZ_LOGIN_INVALID')} <strong>${Loc.getMessage('UP_QUIZ_LOGIN_LOGIN')}</strong> ${Loc.getMessage('UP_QUIZ_LOGIN_OR')} <strong>${Loc.getMessage('UP_QUIZ_LOGIN_PASSWORD')}</strong>
			</div>`);
		}

		[loginInput, passwordInput].forEach(input => {
			input.classList.add('is-danger');
			input.oninput = () => {
				inputs.forEach(input => {
					input.classList.remove('is-danger');
				});
				errorContainer.innerHTML = ``;
			};
		});
	}
}