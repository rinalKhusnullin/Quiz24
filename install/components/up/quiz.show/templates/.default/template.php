<?php

use Bitrix\Main\Application;

if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die();
\Bitrix\Main\UI\Extension::load('up.quiz-show');
?>

<div id="quiz-container-root"></div>

<script>
	BX.ready(function() {

		window.QuizShow = new Up.Quiz.QuizShow({
			rootNodeId: 'quiz-container-root',
			quizId : <?= Application::getInstance()->getContext()->getRequest()->get('quizId');?>
		});

	});
</script>