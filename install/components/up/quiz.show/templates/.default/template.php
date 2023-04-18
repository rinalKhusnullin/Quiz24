<?php

use Bitrix\Main\Application;

if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die();

\Bitrix\Main\UI\Extension::load([
	'up.quiz-show',
	'amcharts4',
	'amcharts4_theme_animated'
]);
\Bitrix\Main\Page\Asset::getInstance()->addJs('/bitrix/js/main/amcharts/4.8.5/plugins/wordCloud.js');
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