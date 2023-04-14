<?php

use Bitrix\Main\Application;

if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die();
\Bitrix\Main\UI\Extension::load('up.quiz-show');
?>

<div id="quiz-container-root"></div>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<script>
	BX.ready(function() {

		window.QuizShow = new Up.Quiz.QuizShow({
			rootNodeId: 'quiz-container-root',
			quizId : <?= Application::getInstance()->getContext()->getRequest()->get('quizId');?>
		});

	});

	const ctx = document.getElementById('myChart');

	let hello = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
			datasets: [{
				label: '# of Votes',
				data: [12, 19, 3, 5, 2, 3],
				borderWidth: 1
			}]
		},
		options: {
			scales: {
				y: {
					beginAtZero: true
				}
			}
		}
	});

	function test(){
		for (let i = 0; i < 10; i++){
			setTimeout(function(){
				hello.data.datasets[0].data[0]++;
				hello.update();
			}, 1);
		}
	}
</script>