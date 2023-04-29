<?php
	if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die();

use Bitrix\Main\Page\Asset;

\Bitrix\Main\UI\Extension::load('up.quiz-list');
\Bitrix\Main\UI\Extension::load('qrcode');
\Bitrix\Main\UI\Extension::load("ui.notification");

?>
<!-- Main container -->
<nav class="level" id="filter"></nav>

<div id="quiz-container-root"></div>

<script>
	BX.ready(function() {
		window.QuizList = new Up.Quiz.QuizList({
			rootNodeId: 'quiz-container-root',
			filterNodeId : 'filter',
		});
	});
</script>
