<?php
if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die();
\Bitrix\Main\UI\Extension::load('up.quiz-edit');
?>
<div class="columns box" id="edit-container-root">

</div>

</div>
<script>
	BX.ready(function() {
		window.QuizEditQuiz = new Up.Quiz.QuizEdit({
			rootNodeId: 'edit-container-root',
			quizId : 1,
			questionsNodeId: 'questions',
			previewNodeId: 'preview',
			settingsNodeId: 'settings'
		});
	});
</script>