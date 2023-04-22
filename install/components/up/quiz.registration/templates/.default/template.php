<?php
if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die();
\Bitrix\Main\UI\Extension::load('up.quiz-registration');
?>

<div id="registration-container-root"></div>

<script>
	BX.ready(function() {
		window.QuizRegistration = new Up.Quiz.QuizRegistration({
			rootNodeId: 'registration-container-root',
		});
	});
</script>
