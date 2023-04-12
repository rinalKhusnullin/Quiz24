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
	<div class="loader" style="--b: 20px;--c:#000;width:80px;--n:15;--g:7deg"></div>
</div>

<script>
	BX.ready(function() {

		window.ProjectorProjectList = new Up.Quiz.QuizList({
			rootNodeId: 'quiz-container-root',
		});

	});
</script>
