<?php

use Bitrix\Main\Application;
use Bitrix\Main\DB\Connection;
use Bitrix\Main\Request;
use Bitrix\Main\EventManager;
use Up\Quiz\PullHandler;
use Bitrix\Main\Loader;

function request(): Request
{
	return Application::getInstance()->getContext()->getRequest();
}

function db(): Connection
{
	return Application::getConnection();
}

if (file_exists(__DIR__ . '/module_updater.php'))
{
	include (__DIR__ . '/module_updater.php');
}

if (Loader::includeModule('pull'))
{
	// Модуль push&pull установлен и подключен
	// Регистрация обработчика события OnGetDependentModule
	EventManager::getInstance()->addEventHandler(
		'pull',
		'OnGetDependentModule',
		[PullHandler::class, 'onGetDependentModule']
	);
}