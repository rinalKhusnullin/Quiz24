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

	public function createQuizAction(string $title, int $userId)
	{
		if (empty(trim($title)))
		{
			$this->addError(new Error('Quiz title must not be empty', 'invalid_quiz_title'));
			return null;
		}

		if ($userId <= 0)
		{
			$this->addError(new Error('Quiz id should be greater than 0', 'invalid_quiz_id'));
			return null;
		}

		return QuizRepository::createQuiz($title, $userId);
	}

	public function getListAction(int $userId): ?array
	{
		if ($userId <= 0)
		{
			$this->addError(new Error('User id should be greater than 0', 'invalid_user_id'));
			return null;
		}

		$quizList = QuizRepository::getList($userId);

		return [
			'quizList' => $quizList
		];
	}

	public function deleteQuizAction(int $id): ?array
	{
		if ($id <= 0)
		{
			$this->addError(new Error('Quiz id should be greater than 0', 'invalid_quiz_id'));
			return null;
		}

		return QuizRepository::deleteQuiz($id);
	}

	public function getQuizAction(int $id) : ?array
	{
		if ($id <= 0)
		{
			$this->addError(new Error('Quiz id should be greater than 0', 'invalid_quiz_id'));
			return null;
		}
		return [
			'quiz' => QuizRepository::getQuiz($id),
		];
	}

	public function changeStateAction(int $id) : ?array
	{
		if ($id <= 0)
		{
			return null;
		}
		return [
			'quizId' => QuizRepository::changeState($id),
		];
	}
}
