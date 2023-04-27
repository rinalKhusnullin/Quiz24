<?php

use Bitrix\Main\Application;

if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die();
\Bitrix\Main\UI\Extension::load('up.quiz-edit');
\Bitrix\Main\UI\Extension::load("ui.notification");
?>
<div class="columns box" id="edit-container-root"></div>

<script>
	BX.ready(function() {
		window.QuizEditQuiz = new Up.Quiz.QuizEdit({
			rootNodeId: 'edit-container-root',
			quizId : <?= Application::getInstance()->getContext()->getRequest()->get('quizId') ?? 1;?>,
		});
	});
</script>