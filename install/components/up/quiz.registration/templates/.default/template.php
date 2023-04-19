<?php
if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die();
\Bitrix\Main\UI\Extension::load('up.quiz-registration');
?>

<div class="reg box">

	<h1 class="title">Создать аккаунт</h1>

	<div class="field">
		<label class="label">Логин</label>
		<div class="control has-icons-left has-icons-right">
			<input class="input is-success" type="text" placeholder="Введите логин" value="">
			<span class="icon is-small is-left">
      <i class="fas fa-user"></i>
    </span>
			<span class="icon is-small is-right">
      <i class="fas fa-check"></i>
    </span>
		</div>
		<p class="help is-success">This username is available</p>
	</div>

	<div class="field">
		<label class="label">Пароль</label>
		<p class="control has-icons-left">
			<input class="input" type="password" placeholder="Введите пароль">
			<span class="icon is-small is-left">
      <i class="fas fa-lock"></i>
    </span>
		</p>
	</div>
	<div class="field">
		<label class="label">Подтверждение пароля</label>
		<p class="control has-icons-left">
			<input class="input" type="ConfirmPassword" placeholder="Повторите пароль">
			<span class="icon is-small is-left">
      <i class="fas fa-lock"></i>
    </span>
		</p>
	</div>

	<div class="mb-2">У Вас уже есть акаунт? <a href="/login" class="">Войти</a></div>


	<div class="field is-grouped">
		<div class="control reg-button">
			<button class="button is-link">Создать аккаунт</button>
		</div>
	</div>
</div>

<div id="registration-container-root"></div>

<script>
	BX.ready(function() {
		window.QuizRegistration = new Up.Quiz.QuizRegistration({
			rootNodeId: 'registration-container-root',
		});
	});
</script>
