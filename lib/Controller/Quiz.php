<?php
namespace Up\Quiz\Controller;

use Bitrix\Main\Engine;
use Bitrix\Main\Error;
use Up\Quiz\Repository\QuizRepository;

class Quiz extends Engine\Controller
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

	public function createQuizAction(string $title, int $id): ?array
	{
		if (!empty(trim($title)))
		{
			return QuizRepository::createQuiz($title, $id);
		}
		return null;
	}

	public function getListAction(): ?array
	{
		$quizList = QuizRepository::getPage();
		return [
			'quizList' => $quizList
		];
	}

	public function deleteTaskAction(int $id): ?array
	{
		return QuizRepository::deleteQuiz($id);
	}


}
