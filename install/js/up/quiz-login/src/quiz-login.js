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
		BX.ajax.runAction('up:quiz.user.qauth', {
				data: {
					login: login,
					password: password
				}
			}).then(function(response) {
				if (response.status === "success") {
					// Авторизация прошла успешно
					alert('success');
				} else {
					// Ошибка авторизации
					alert(response.message);
				}
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
						<input id="login-input" class="input is-success" type="text" placeholder="Введите логин" value="">
						<span class="icon is-small is-left">
							<i class="fas fa-user"></i>
						</span>
						<span class="icon is-small is-right">
							<i class ="fas fa-check"></i>
						</span>
					</div>
					<p class="help is-success">This username is available</p>
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
			this.auth(loginInput.value, passwordInput.value);
		}

		this.rootNode.appendChild(LoginContainerNode);
	}
}