<?php
	if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die();
	\Bitrix\Main\UI\Extension::load('up.quiz-list');
	\Bitrix\Main\UI\Extension::load('qrcode');
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
		<div class="field has-addons">
			<p class="control">
				<button class="button">
					<span>Все</span>
				</button>
			</p>
			<p class="control">
				<button class="button">
					<span>Активные</span>
				</button>
			</p>
			<p class="control">
				<button class="button">
					<span>Неактивные</span>
				</button>
			</p>
		</div>
	</div>
</nav>


<div id="quiz-container-root">
</div>

<script>
	BX.ready(function() {
		window.ProjectorProjectList = new Up.Quiz.QuizList({
			rootNodeId: 'quiz-container-root',
		});
	});
</script>
