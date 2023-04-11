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
				'TITLE'
			]
		])->fetchAll();
		return $quizList;
	}

	public static function createQuiz(string $title): ?array
	{
		$result = QuizzesTable::add(['TITLE' => $title]);

		if ($result->isSuccess())
		{
			return null;
		}
		else
		{
			return $result->getErrors();
		}
	}
}