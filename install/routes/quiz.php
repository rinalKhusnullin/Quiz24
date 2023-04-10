<?php

use Bitrix\Main\Routing\Controllers\PublicPageController;
use Bitrix\Main\Routing\RoutingConfigurator;

return function (RoutingConfigurator $routes) 
{
	$routes->get('/', new PublicPageController('/local/modules/up.quiz/views/quiz-list.php'));

	$routes->get('/quiz/{quizId}/', new PublicPageController('/local/modules/up.quiz/views/quiz-details.php'));
};