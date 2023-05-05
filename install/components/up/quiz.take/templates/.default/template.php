<?php

use Bitrix\Main\Application;

if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die();
\Bitrix\Main\UI\Extension::load('up.quiz-take');
\Bitrix\Main\UI\Extension::load('up.quiz-error-manager');
?>
<div id="question-container-root"></div>


<script>
	BX.ready(function() {
		window.QuizTake = new Up.Quiz.QuizTake({
			rootNodeId: 'question-container-root',
			quizCode : '<?=Application::getInstance()->getContext()->getRequest()->get('quizCode');?>',
		});
	});
</script>