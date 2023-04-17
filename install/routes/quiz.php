<?php

use Bitrix\Main\Routing\Controllers\PublicPageController;
use Bitrix\Main\Routing\RoutingConfigurator;

return function (RoutingConfigurator $routes)
{
	$routes->get('/', new PublicPageController('/local/modules/up.quiz/views/quiz-list.php'));

	$routes->get('/quiz/{quizId}/edit', new PublicPageController('/local/modules/up.quiz/views/quiz-edit.php'));
	$routes->get('/quiz/{quizId}/edit/', new PublicPageController('/local/modules/up.quiz/views/quiz-edit.php'));

	$routes->get('/quiz/{quizId}/show', new PublicPageController('/local/modules/up.quiz/views/quiz-show.php')); //демонстрация результатов
	$routes->get('/quiz/{quizId}/show/', new PublicPageController('/local/modules/up.quiz/views/quiz-show.php'));

	$routes->get('/quiz/{quizCode}/take', new PublicPageController('/local/modules/up.quiz/views/quiz-take.php')); //для прохождения опроса
	$routes->get('/quiz/{quizCode}/take/', new PublicPageController('/local/modules/up.quiz/views/quiz-take.php'));
};