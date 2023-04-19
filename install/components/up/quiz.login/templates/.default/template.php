<?php
if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die();
\Bitrix\Main\UI\Extension::load('up.quiz-login');
?>

<div class="login box" id="login-container-root">

</div>

<script>
	BX.ready(function() {
		window.QuizLogin = new Up.Quiz.QuizLogin({
			rootNodeId: 'login-container-root',
		});
	});
</script>
