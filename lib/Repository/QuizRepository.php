<?php

namespace Up\Quiz\Repository;

use Up\Quiz\Model\QuizzesTable;

class QuizRepository
{
	public static function getPage(): array
	{
		$quizList = QuizzesTable::getList([
			'select' => [
				'ID',
				'TITLE',
				'CODE',
			]
		])->fetchAll();
		return $quizList;
	}

	public static function createQuiz(string $title, int $id): ?array
	{
		$permitted_chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		$code = substr(str_shuffle($permitted_chars), 0, 4);
		$result = QuizzesTable::add(['TITLE' => $title, 'CODE'=>$code, 'USER_ID'=>$id]);

		if ($result->isSuccess())
		{
			return null;
		}
		else
		{
			return $result->getErrors();
		}
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
}