<?php
if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die();
\Bitrix\Main\UI\Extension::load('up.quiz-login');
?>

<div class="login box">

	<h1 class="title">Войти</h1>

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

	<div class="mb-2">Если у вас нет аккаунта Вы можете создать его тут - <a href="/registration" class="">Создать аккаунт</a></div>


	<div class="field is-grouped">
		<div class="control login-button">
			<button class="button is-link">Войти</button>
		</div>
	</div>
</div>

<script>
	BX.ready(function() {
		window.QuizLogin = new Up.Quiz.QuizLogin({
			rootNodeId: 'login-container-root',
		});
	});
</script>
