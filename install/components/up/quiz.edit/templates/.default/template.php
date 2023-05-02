<?php
use Bitrix\Main\Application;
if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die();

\Bitrix\Main\UI\Extension::load([
	'up.quiz-edit',
	'up.quiz-error-manager',
	"ui.notification",
	'amcharts4',
	'amcharts4_theme_animated',
]);
\Bitrix\Main\Page\Asset::getInstance()->addJs('/bitrix/js/main/amcharts/4.8.5/plugins/wordCloud.js');
\Bitrix\Main\Page\Asset::getInstance()->addJs('/bitrix/js/main/amcharts/4.8.5/themes/material.js');
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