<?php
if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die();
\Bitrix\Main\UI\Extension::load('up.quiz-edit');
?>

<div class="columns box">
	<div class="column is-one-fifth question-list">
		<div class="question-list__title">Вопросы</div>
		<div class="question-list__questions" id="questions">
			<div class="question-list__question">
			</div>
			<div class="question-list__question">
			</div>
			<div class="question-list__question">
			</div>
			<div class="question-list__question">
			</div>
			<div class="question-list__question">
			</div>
			<div class="question-list__question">
			</div>
			<div class="question-list__question">
			</div>
			<div class="question-list__question">
			</div>
			<div class="question-list__question">
			</div>
		</div>
	</div>

	<div class="column is-three-fifths question-preview">
		<div class="question-preview__title">Превью</div>
		<div id="preview">
<!--		preview -> render into js -->
		</div>
	</div>

	<div class="column question-settings">
		<div class="question-settings__title">Настройки</div>

		<div id="settings">



			<div class="question-settings__input-title">Тип отображения результатов:</div>
			<select name="displayType" id="displayType">
				<option value="pieChart" selected>Круговая диаграмма</option>
				<option value="tagCloud">Облако тэгов</option>
				<option value="barChart">Столбчатая диаграмма</option>
				<option value="rawOutput">Текстовый формат</option>
			</select>

			<button type="submit" class="button is-success">Сохранить</button>
		</div>
	</div>
</div>

<script>
	BX.ready(function() {
		window.QuizEditQuiz = new Up.Quiz.QuizEdit({
			questionsNodeId: 'questions',
			previewNodeId: 'preview',
			settingsNodeId: 'settings'
		});
	});
</script>