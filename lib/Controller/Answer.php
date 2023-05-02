<?php

namespace Up\Quiz\Controller;
use Bitrix\Main\Engine;
use Bitrix\Main\Error;
use Up\Quiz\Repository\AnswerRepository;

use Bitrix\Main\Loader;
use Bitrix\Main\EventManager;
use Up\Quiz\PullHandler;
use \Bitrix\Main\Engine\Response\Json;
use Up\Quiz\Repository\QuestionRepository;

Loader::includeModule('pull');

EventManager::getInstance()->addEventHandler(
	'pull',
	'OnGetDependentModule',
	[PullHandler::class, 'onGetDependentModule']
);

class Answer extends Engine\Controller
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

	public function sendPushNotificationAction(string $answer, int $questionId)
	{
		$pushParams = [
			'module_id' => 'up.quiz',
			'command' => 'update_answers',
			'params' => [
				'message' => 'new Answer available',
				'answer' => $answer,
				'questionId' => $questionId
			]
		];
		$userId = QuestionRepository::getUserIdByQuestionId($questionId);

		\Bitrix\Pull\Event::add($userId, $pushParams);
		return ['success' => true, 'user'=>$userId];
	}

	//Создать ответ на вопрос
	public function createAnswerAction(int $questionId, string $answer): ?array
	{
		if ($questionId <= 0)
		{
			$this->addError(new Error('Question id should be greater than 0', 'invalid_question_id'));
			return null;
		}
		if (trim($answer) === '' ){
			$this->addError(new Error('Answer should be not empty', 'invalid_answer'));
			return null;
		}
		if (strlen(trim($answer)) > 128){
			$this->addError(new Error('Answer length should be not more 128', 'invalid_answer'));
			return null;
		}

		$result = AnswerRepository::createAnswer($questionId, trim($answer));
		$f = $this->sendPushNotificationAction($answer, $questionId);
		return [$result, $f];
	}

	public function getAnswersAction(int $questionId): ?array
	{
		if ($questionId <= 0)
		{
			$this->addError(new Error('Question id should be greater than 0', 'invalid_question_id'));
			return null;
		}

		return AnswerRepository::getAnswersCounts($questionId);
	}

	public function configureActions()
	{
		return [
			'createAnswer' => [
				'-prefilters' => [
					\Bitrix\Main\Engine\ActionFilter\Authentication::class,
				],
			],
		];
	}
}