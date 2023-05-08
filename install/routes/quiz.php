<?php

use Bitrix\Main\Routing\Controllers\PublicPageController;
use Bitrix\Main\Routing\RoutingConfigurator;

return function (RoutingConfigurator $routes)
{
	$routes->get('/', new PublicPageController('/local/modules/up.quiz/views/quiz-list.php'));//

	$routes->get('/quiz/{quizId}/edit', new PublicPageController('/local/modules/up.quiz/views/quiz-edit.php'));//редактирование опроса
	$routes->get('/quiz/{quizId}/edit/', new PublicPageController('/local/modules/up.quiz/views/quiz-edit.php'));

	$routes->get('/quiz/{quizId}/show', new PublicPageController('/local/modules/up.quiz/views/quiz-show.php')); //демонстрация результатов
	$routes->get('/quiz/{quizId}/show/', new PublicPageController('/local/modules/up.quiz/views/quiz-show.php'));

	$routes->get('/quiz/{quizCode}/take', new PublicPageController('/local/modules/up.quiz/views/quiz-take.php')); //для прохождения опроса
	$routes->get('/quiz/{quizCode}/take/', new PublicPageController('/local/modules/up.quiz/views/quiz-take.php'));

	$routes->get('/login/', new PublicPageController('/local/modules/up.quiz/views/quiz-login.php')); //Войти в аккаунт
	$routes->get('/login', new PublicPageController('/local/modules/up.quiz/views/quiz-login.php'));

	$routes->get('/registration/', new PublicPageController('/local/modules/up.quiz/views/quiz-registration.php')); //Зарегистрироваться
	$routes->get('/registration', new PublicPageController('/local/modules/up.quiz/views/quiz-registration.php'));

	$routes->get('/logout', new PublicPageController('/local/modules/up.quiz/views/quiz-logout.php')); //Выйти из аккаунта
	$routes->get('/logout/', new PublicPageController('/local/modules/up.quiz/views/quiz-logout.php'));

	$routes->get('/{any}', new PublicPageController('/local/modules/up.quiz/views/404.php'))
		->where('any', '.*');
};