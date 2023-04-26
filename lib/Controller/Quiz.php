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

	public function createQuizAction(string $title)
	{
		global $USER;
		if (empty(trim($title)))
		{
			$this->addError(new Error('Название опроса не может быть пустым', 'invalid_quiz_title'));
			return null;
		}

		if (mb_strlen($title) > 256)
		{
			$this->addError(new Error('Название опроса не может превышать 256 символов', 'invalid_quiz_title'));
			return null;
		}

		if (!$USER->IsAuthorized())
		{
			$this->addError(new Error('User must be authorized', 'unauthorized_user'));
			return null;
		}

		$userId = $USER->GetID();

		$quizCount = QuizRepository::getQuizCount($userId);
		if ($quizCount >= 11)
		{
			$this->addError(new Error('Максимальное количество опросов - 11.','max_count_quizzes'));
			return null;
		}

		return QuizRepository::createQuiz($title, $userId);
	}

	public function getQuizByCodeAction(string $code) : ?array
	{
		if (mb_strlen($code) !== 4)
		{
			$this->addError(new Error('Quiz code length must be 4', 'invalid_quiz_code'));
			return null;
		}

		$quiz = QuizRepository::getQuizByCode($code);

		return [
			'quiz' => $quiz,
		];
	}

	public function getListAction(): ?array
	{
		global $USER;

		if (!$USER->IsAuthorized())
		{
			$this->addError(new Error('User must be authorized', 'unauthorized_user'));
			return null;
		}

		$userId = $USER->GetID();

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

		global $USER;
		$userId = $USER->GetID();
		if (!QuizRepository::checkUserHasQuiz($userId, $id))//принадлежит ли quiz текущему пользователю и существует
		{
			$this->addError(new Error('Quiz not found in current User', 'invalid_quizId'));
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

	public function getQuizzesByFiltersAction(string $query, string $state) : ?array
	{
		if (!in_array($state, ['all', 'active', 'notActive']))
		{
			$this->addError(new Error("quiz state must be 'all' | 'active' | 'notActive'", 'invalid_quiz_state'));
			return null;
		}

		global $USER;
		if (!$USER->IsAuthorized())
		{
			$this->addError(new Error('user must be authorized', 'unauthorized_user'));
			return null;
		}

		$userId = $USER->GetID();

		return ['quizList' => QuizRepository::getQuizzesByFilters($query, $state, $userId)];
	}

	public function configureActions()
	{
		return [
			'getQuizByCode' => [
				'-prefilters' => [
					\Bitrix\Main\Engine\ActionFilter\Authentication::class,
				],
			],
		];
	}
}
