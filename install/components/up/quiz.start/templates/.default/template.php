<?php
if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die();
\Bitrix\Main\UI\Extension::load('up.quiz-start');
?>

<div  id="start-container-root">

</div>

<script>
	BX.ready(function() {
		window.QuizStart = new Up.Quiz.QuizStart({
			rootNodeId: 'start-container-root',
		});
	});
</script>