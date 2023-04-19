<?php

namespace Up\Quiz\Controller;
use Bitrix\Main\Engine;
use Bitrix\Main\Error;
use CUser;

class User extends Engine\Controller
{
	protected function getDefaultPreFilters()
	{
		return array_merge(
			parent::getDefaultPreFilters(),
			[
				new \Bitrix\Main\Engine\ActionFilter\HttpMethod(
					[\Bitrix\Main\Engine\ActionFilter\HttpMethod::METHOD_POST]
				),
				new \Bitrix\Main\Engine\ActionFilter\Scope(
					\Bitrix\Main\Engine\ActionFilter\Scope::AJAX
				),
			]
		);
	}

	public function qauthAction(string $login, string $password)
	{
		return["123"];
		// $USER = new \CUser;
		// $authResult = $USER->Login($login, $password, "Y");
		// if ($authResult === true) {
		// 	return ["status" => "success"];
		// } else {
		// 	return ["status" => "error", "message" => $authResult["MESSAGE"]];
		// }
	}

	// public function configureActions()
	// {
	// 	return [
	// 		'auth' => [
	// 			'prefilters' => [
	// 				new ActionFilter\Authentication
	// 			],
	// 		],
	// 	];
	// }
}