<?php
if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die();
?>

<div class="columns box">
	<div class="column is-one-fifth question-list">
		<div class="question-list__title">Вопросы</div>
		<div class="question-list__questions">
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
		<div class="box">
			<h3 class="title question-preview__question-text" id="questionTextPreview">Кто сьел весь пирог?</h3>
			<div class="control hidden" id="selectablePreview">
				<label class="radio">
					<input type="radio" name="answer">
					Yes
				</label>
				<label class="radio">
					<input type="radio" name="answer">
					No
				</label>
			</div>

			<input type="text" class="input" placeholder="Введите ответ" id="freePreview">

			<a href="##" class="button is-success">Отправить</a>
		</div>
		<div class="box" id="displayTypePreview">
			<h3 class="title">Результаты опроса?</h3>
			<div id="pieChartPreview">
				Тут типо превью круговой
			</div>
			<div id="barChartPreview" class="hidden">
				Тут типо превью Столбчатой
			</div>
			<div id="tagCloudPreview" class="hidden">
				Тут типо превью Облако тэгов
			</div>
			<div id="rawOutputPreview" class="hidden">
				Тут типо превью Сырового вывода
			</div>
		</div>
	</div>

	<div class="column question-settings">
		<div class="question-settings__title">Настройки</div>
		<form action="##" method="post" name="questionSettings"><!--Стоит что то сделать с отправкой формы чтобы понимать какой мы вопрос редактируем-->

			<div class="question-settings__input-title">Вопрос:</div>
			<input value="Кто сьел весь пирог?" class="input" type="text" placeholder="Введите вопрос" name="questionText" id="questionText">

			<div class="question-settings__input-title">Тип ответа:</div>
			<select class="select" name="questionType" id="questionType">
				<option value="free" selected>Свободный ответ</option>
				<option value="selectable">Выбираемый ответ</option>
			</select>

			<div class="question-settings__selectable-answers hidden" id="selectableAnswers">
				<div class="question-settings__input-title">Вариаты ответа:</div>
				<div class="question-settings__answers-container" id="answersContainer">
					<input type="text" class="question-settings__answer input">
				</div>
				<a href="##" class="button" id="addAnswerButton">
					<i class="fa-solid fa-plus "></i>
				</a>
			</div>

			<div class="question-settings__input-title">Тип отображения результатов:</div>
			<select name="displayType" id="displayType">
				<option value="pieChart" selected>Круговая диаграмма</option>
				<option value="tagCloud">Облако тэгов</option>
				<option value="barChart">Столбчатая диаграмма</option>
				<option value="rawOutput">Текстовый формат</option>
			</select>

			<button type="submit" class="button is-success">Сохранить</button>
		</form>
	</div>
</div>