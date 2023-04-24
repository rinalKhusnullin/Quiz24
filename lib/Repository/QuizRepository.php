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

		$result = QuizzesTable::add(['TITLE' => $title, 'CODE'=>$code, 'USER_ID'=>$userId]);

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
}
