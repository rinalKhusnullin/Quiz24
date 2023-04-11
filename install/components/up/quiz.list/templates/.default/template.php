<?php
	if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die();
	\Bitrix\Main\UI\Extension::load('up.quiz-list');
?>
<!-- Main container -->
<nav class="level">
	<!-- Left side -->
	<div class="level-left">
		<div class="level-item">
			<div class="field has-addons">
				<p class="control">
					<input class="input" type="text" placeholder="Найти опрос">
				</p>
				<p class="control">
					<button class="button">
						Поиск
					</button>
				</p>
			</div>
		</div>
	</div>

	<!-- Right side -->
	<div class="level-right">
		<p class="level-item"><strong>Все</strong></p>
		<p class="level-item"><a>Открытые</a></p>
		<p class="level-item"><a>Закрытые</a></p>
		<p class="level-item"><a>Удаленные</a></p>
		<p class="level-item"><a class="button is-success">Новые</a></p>
	</div>
</nav>

<div id="quiz-container-root">
	<div class="quiz-container">
		<div class="quiz-card">
			<div class="quiz-card__header"></div>
			<div class="quiz-card__content">
				<div class="quiz-card__title">
					<strong class="quiz-card__subtitle is-family-monospace">Название:</strong>
					<div class="quiz-card__title-text has-text-weight-light">
						Кто же пойдет на вечеринку?
					</div>
				</div>
				<div class="quiz-card__title">
					<strong class="quiz-card__subtitle is-family-monospace">linkcode:</strong>
					<div class="quiz-card__title-text has-text-weight-light">
						Оj1s2
					</div>
				</div>
			</div>
			<div class="quiz-card__hidden-btns">
				<a href="/quiz/12/edit" class="button">
					<i class="fa-solid fa-pen"></i>
				</a>
				<a href="##" class="button">
					<i class="fa-sharp fa-solid fa-chart-column"></i>
				</a>
				<a href="##" class="button">
					<i class="fa-sharp fa-solid fa-trash"></i>
				</a>
			</div>
		</div>
	</div>
</div>

<script>
	BX.ready(function() {

		window.ProjectorProjectList = new Up.Quiz.QuizList({
			rootNodeId: 'quiz-container-root',
		});

	});
</script>
