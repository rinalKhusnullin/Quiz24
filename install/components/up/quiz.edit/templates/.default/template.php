<?php
if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die();
?>

<div class="columns">
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
	</div>
	<div class="column question-settings">
		<div class="question-settings__title">Настройки</div>
		<form action="##" method="post">
			<div class="question-settings__input-title">Вопрос:</div>
			<input type="text" placeholder="Введите вопрос" name="questionTitle">
			<div class="question-settings__input-title">Тип ответа:</div>
			<select name="questionType" id="questionType">
				<option value="free" selected>Свободный ответ</option>
				<option value="selectable">Выбираемый ответ</option>
			</select>
			<div class="question-settings__selectable-options hidden" id="selectableOptions">
				<div class="question-settings__selectable-title">Вариаты ответа:</div>
				<div class="question-settings__selectable-container" id="selectableOptionsContainer">
					<input type="text" class="question-settings__selectable-inputs">
				</div>
				<a href="##" class="button" id="addOptionButton">
					<i class="fa-solid fa-plus "></i>
				</a>
			</div>
		</form>
	</div>
</div>