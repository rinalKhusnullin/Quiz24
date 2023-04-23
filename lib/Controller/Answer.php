<?php

namespace Up\Quiz\Controller;
use Bitrix\Main\Engine;
use Bitrix\Main\Error;
use Up\Quiz\Repository\AnswerRepository;

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
		return AnswerRepository::createAnswer($questionId, $answer);
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