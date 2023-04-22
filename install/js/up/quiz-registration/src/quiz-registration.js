import {Type, Tag} from 'main.core';

export class QuizRegistration
{
	constructor(options = {})
	{
		if (Type.isStringFilled(options.rootNodeId))
		{
			this.rootNodeId = options.rootNodeId;
		}
		else
		{
			throw new Error('QuizRegistration: options.rootNodeId required');
		}

		this.rootNode = document.getElementById(this.rootNodeId);
		if (!this.rootNode)
		{
			throw new Error(`QuizRegistration: element with id "${this.rootNodeId}" not found`);
		}

		this.reload();
	}

	registration()
	{
		return new Promise((resolve, reject) => {
			BX.ajax.runAction(
					'up:quiz.user.registerUser',{
						data : {
							login: this.login.value,
							email: this.email.value,
							password: this.password.value,
							confirmPassword : this.confirmPassword.value,
						}
					}
				)
				.then((response) => {
					console.log(response);
					resolve(response.data);
				})
				.catch((error) => {
					console.error(error);
					reject(error);
				})
			;
		});
	}

	reload()
	{
		this.render();
	}

	render()
	{
		this.rootNode.innerHTML = ``;

		const RegistrationFormNode = Tag.render`
			<div class="reg box">
				<h1 class="title">Создать аккаунт</h1>
				<div class="field">
					<label class="label">Логин</label>
					<div class="control has-icons-left has-icons-right">
						<input class="input" type="text" placeholder="Введите логин" value="" id="login-input">
						<span class="icon is-small is-left">
							<i class="fas fa-user"></i>
						</span>
					</div>
					<p class="help is-danger" id="login-helper"></p>
				</div>
				<div class="field">
				<label class="label">Email</label>
					<p class="control is-expanded has-icons-left has-icons-right">
						<input class="input" type="email" placeholder="Введите Email" value="" id="email-input">
						<span class="icon is-small is-left">
					  		<i class="fas fa-envelope"></i>
						</span>
				  	</p>
				  	<p class="help is-danger" id="email-helper"></p>
				</div>
				<div class="field">
					<label class="label">Пароль</label>
					<p class="control has-icons-left">
						<input class="input" type="password" placeholder="Введите пароль" id="password-input">
						<span class="icon is-small is-left">
							<i class="fas fa-lock"></i>
						</span>
					</p>
					<p class="help is-danger" id="password-helper"></p>
				</div>
				<div class="field">
					<label class="label">Подтверждение пароля</label>
					<p class="control has-icons-left">
						<input class="input" type="password" placeholder="Повторите пароль" id="confirm-password-input">
						<span class="icon is-small is-left">
							<i class="fas fa-lock"></i>
						</span>
					</p>
					<p class="help is-danger" id="confirm-password-helper"></p>
				</div>
				<div class="mb-2"><a href="/login" class="is-underlined">Войдите</a>, если у вас уже есть аккаунт</div>
				<div class="field is-grouped">
					<div class="control reg-button">
						<button class="button is-link" id="registration-button">Создать аккаунт</button>
					</div>
				</div>
			</div>
		`;

		this.login = RegistrationFormNode.querySelector('#login-input');
		this.email = RegistrationFormNode.querySelector('#email-input');
		this.password = RegistrationFormNode.querySelector('#password-input');
		this.confirmPassword = RegistrationFormNode.querySelector('#confirm-password-input');

		this.loginHelper = RegistrationFormNode.querySelector('#login-helper');
		this.emailHelper = RegistrationFormNode.querySelector('#email-helper');
		this.passwordHelper = RegistrationFormNode.querySelector('#password-helper');
		this.confirmPasswordHelper = RegistrationFormNode.querySelector('#confirm-password-helper');

		const SubmitButton = RegistrationFormNode.querySelector('#registration-button');

		this.login.oninput = () => {
			this.loginHelper.textContent = '';
			this.login.classList.remove('is-danger')
		};

		this.email.oninput = () => {
			this.emailHelper.textContent = '';
			this.email.classList.remove('is-danger')
		};

		this.password.oninput = () => {
			this.passwordHelper.textContent = '';
			this.password.classList.remove('is-danger')
		};

		this.confirmPassword.oninput = () => {
			this.confirmPasswordHelper.textContent = '';
			this.confirmPassword.classList.remove('is-danger')
		};

		SubmitButton.onclick = () => {
			SubmitButton.classList.add('is-loading')
			this.registration().then(answer => {
				if (answer.status === 'success')
				{
					SubmitButton.innerHTML = `<i class="fa-solid fa-check"></i>`;
					SubmitButton.classList.add('is-success');
					window.location.href = '/';
				}
				else
				{
					this.resetInputs();
					this.showErrors(answer.message);
				}
				SubmitButton.classList.remove('is-loading')
			});
		};

		this.rootNode.appendChild(RegistrationFormNode);
	}

	showErrors(errorMessage)
	{
		errorMessage = errorMessage.toLowerCase();
		let errors = errorMessage.split('<br>');
		for (let i = 0; i < errors.length; i++)
		{
			if (errors[i].includes('логин'))
			{
				this.login.classList.add('is-danger');
				this.loginHelper.textContent = errors[i];
			}
			else if (errors[i].includes('пароль'))
			{
				this.password.classList.add('is-danger')
				this.passwordHelper.textContent = errors[i];
			}
			else if (errors[i].includes('email'))
			{
				this.email.classList.add('is-danger');
				this.emailHelper.textContent = errors[i];
			}
			else if (errors[i].includes('подтверждение пароля'))
			{
				this.confirmPassword.classList.add('is-danger');
				this.confirmPasswordHelper.textContent = errors[i];
			}
		}

	}

	resetInputs()
	{
		[this.login, this.password, this.email, this.confirmPassword].forEach(node => {
			node.classList.remove('is-danger');
		});
		[this.loginHelper, this.passwordHelper, this.emailHelper, this.confirmPasswordHelper].forEach(node => {
			node.textContent = '';
		});
	}
}