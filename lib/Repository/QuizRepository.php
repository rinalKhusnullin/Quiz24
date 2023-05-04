<?php

namespace Up\Quiz\Repository;

use Up\Quiz\Model\QuizzesTable;

class QuizRepository
{
	public static function getList(int $userId): ?array
	{
		$quizList = QuizzesTable::getList([
			  'select' => ['ID', 'TITLE', 'CODE', 'IS_ACTIVE'],
			  'filter' => ['=USER_ID' => $userId],
	    ])->fetchAll();

		return $quizList;
	}

	public static function getQuizzesByFilters(string $query, string $state, int $userId) : ?array
	{
		$quizQuery = QuizzesTable::query()
	 		->addSelect('ID')
	  		->addSelect('TITLE')
		  	->addSelect('CODE')
		  	->addSelect('IS_ACTIVE')
		  	->whereLike('USER_ID', $userId);

		if ($query !== '')
		{
			$sqlHelper = \Bitrix\Main\Application::getConnection()->getSqlHelper();
			$query = $sqlHelper->forSql($query);

			$quizQuery = $quizQuery->whereLike('TITLE', "%$query%");
		}

		if ($state === 'active') $quizQuery = $quizQuery->whereLike('IS_ACTIVE', 1);

		if ($state === 'notActive') $quizQuery = $quizQuery->whereLike('IS_ACTIVE', 0);

		return $quizQuery->exec()->fetchAll();
	}

	public static function createQuiz(string $title, int $userId)
	{
		$permitted_chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		$isCodeExists = true;
		while ($isCodeExists)
		{
			$code = substr(str_shuffle($permitted_chars), 0, 4);
			$isCodeExists = QuizzesTable::getList([
				'select' => ['CODE'],
			    'filter' => ['=CODE' => $code]])->fetch();
		}

		$sqlHelper = \Bitrix\Main\Application::getConnection()->getSqlHelper();
		$title = $sqlHelper->forSql($title);
		$result = QuizzesTable::add(['TITLE' => $title, 'CODE'=>$code, 'USER_ID'=>$userId, 'IS_ACTIVE' => 1]);

		if ($result->isSuccess())
		{
			return $result->getId();
		}
		return $result->getErrors();
	}

	public static function deleteQuiz(int $id): ?array
	{
		$result = QuizzesTable::delete($id);

		if ($result->isSuccess())
		{
			return null;
		}
		return $result->getErrors();
	}

	public static function getQuiz(int $id)
	{
		$result = QuizzesTable::getList([
			'select' => ['ID', 'TITLE', 'CODE', 'IS_ACTIVE'],
			'filter' => ['=ID' => $id],
		])->fetch();

		return $result;
	}

	public static function getQuizByCode(string $code)
	{
		$sqlHelper = \Bitrix\Main\Application::getConnection()->getSqlHelper();
		$code = $sqlHelper->forSql($code);

		$result = QuizzesTable::getList([
			'select' => ['ID', 'TITLE', 'CODE', 'IS_ACTIVE'],
			'filter' => ['=CODE' => $code],
		])->fetch();

		return $result;
	}

	public static function changeState(int $id)
	{
		$isActive = QuizzesTable::getByPrimary($id)->fetch()['IS_ACTIVE'];

		$result = QuizzesTable::update($id, [
			'IS_ACTIVE' => ($isActive === '1') ? 0 : 1,
		]);

		if (!$result->isSuccess())
		{
			return $result->getErrorMessages();
		}

		return $result->getId();
	}

	public static function checkUserHasQuiz(int $userId, int $quizId)
	{
		$result = QuizzesTable::getByPrimary($quizId)->fetch();
		if (($result === false) || ((int)$result['USER_ID'] !== $userId)) return false;
		return true;
	}

	public static function getUserIdByQuizId(int $quizId)
	{
		$result = QuizzesTable::getByPrimary($quizId)->fetch();
		if ($result.success) return (int)$result['USER_ID'];
		return 0;
	}

	public static function getQuizCount(int $userId) : int
	{
		return QuizzesTable::getCount(['=USER_ID' => $userId]);
	}

	public static function updateTitle(int $quizId, string $title) : ?array
	{
		$result = QuizzesTable::update($quizId, [
			'TITLE' => $title,
		]);

		if ($result->isSuccess())
		{
			return null;
		}
		return $result->getErrors();
	}
}
