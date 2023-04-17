<?php

use Bitrix\Main\Application;

if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die();
\Bitrix\Main\UI\Extension::load('up.quiz-take');
?>
<div id="question-container-root"></div>


<script>
	BX.ready(function() {
		window.QuizTake = new Up.Quiz.QuizTake({
			rootNodeId: 'question-container-root',
			quizId : <?= Application::getInstance()->getContext()->getRequest()->get('quizCode');?> //TODO : INTO LinkCode (not id)
		});
	});
</script>