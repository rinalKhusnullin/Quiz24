<?php
if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die();
?>

<div class="columns">
	<div class="column is-one-fifth question-list">
		<div class="question-list__title">Вопросы:</div>
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
	<div class="column is-three-fifths question-preview">
		Тут Будет превью типо : )
	</div>
	<div class="column question-settings">
		<div class="question-settings__title">Настройки:</div>
		<form action="##" method="post">
			<div class="question-settings__input-title">Вопрос:</div>
			<input type="text" placeholder="Введите вопрос" name="questionTitle">
			<div class="question-settings__input-title">Тип ответа:</div>
			<select name="questionType" id="">
				<option value="free">Свободный ответ</option>
				<option value="selectable">Выбираемый ответ</option>
			</select>
		</form>
	</div>
</div>