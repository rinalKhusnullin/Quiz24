import {Type, Tag} from 'main.core';

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
					console.log(response);
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
				<h1 class="title">Войти</h1>
	
				<div class="field">
					<label class="label">Логин</label>
					<div class="control has-icons-left has-icons-right">
						<input id="login-input" class="input" type="text" placeholder="Введите логин" value="">
						<span class="icon is-small is-left">
							<i class="fas fa-user"></i>
						</span>
					</div>
				</div>
	
				<div class="field">
					<label class="label">Пароль</label>
					<p class="control has-icons-left">
						<input id="password-input" class="input" type="password" placeholder="Введите пароль">
						<span class="icon is-small is-left">
							<i class="fas fa-lock"></i>
						</span>
					</p>
				</div>
				
				<article class="message is-danger" id="error-container">
				</article>
	
				<div class="mb-2">Если у вас нет аккаунта Вы можете создать его тут - <a href="/registration" class="">Создать аккаунт</a>
				</div>
	
				<div class="field is-grouped">
					<div class="control login-button">
						<button id="submit-button" class="button is-link">Войти</button>
					</div>
				</div>
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

		errorContainer.appendChild(Tag.render`<div class="message-body">
			Неверный <strong>Логин</strong> или <strong>Пароль</strong>
		</div>`);
		let inputs = [loginInput, passwordInput];
		inputs.forEach(input => {
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