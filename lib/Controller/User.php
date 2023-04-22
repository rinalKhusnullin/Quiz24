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

	public function authAction(string $login, string $password): ?array
	{
		$USER = new \CUser;
		$authResult = $USER->Login($login, $password, "Y");
		if ($authResult === true) {
			return ["status" => "success"];
		}
		return ["status" => "error", "message" => $authResult["MESSAGE"]];
	}

	public function registerUserAction(string $login, string $email, string $password, string $confirmPassword) : ?array
	{
		$USER = new \CUser;

		$newUserID = $USER->Add([
			'LOGIN' => $login,
			'EMAIL' => $email,
			'PASSWORD' => $password,
			'CONFIRM_PASSWORD' => $confirmPassword,
		]);

		if (intval($newUserID) > 0)
		{
			$USER->Authorize($newUserID);
			return ["status" => "success"];
		}
		return ["status" => "error", "message" => $USER->LAST_ERROR];
	}

	public function configureActions()
	{
		return [
			'auth' => [
				'-prefilters' => [
					\Bitrix\Main\Engine\ActionFilter\Authentication::class,
				],
			],
			'registerUser' => [
				'-prefilters' => [
					\Bitrix\Main\Engine\ActionFilter\Authentication::class,
				],
			],
		];
	}
}