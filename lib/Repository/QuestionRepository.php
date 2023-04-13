<?php

namespace Up\Quiz\Repository;

use Up\Quiz\Model\QuestionsTable;
use Up\Quiz\Model\QuizzesTable;

class QuestionRepository
{
	public static function getQuestions(int $quizId): ?array
	{
		$questionList = QuestionsTable::getList([
			  'select' => [
				  'ID',
				  'QUESTION_TEXT',
				  'CODE',
			  ]
		  ])->fetchAll();
		return $questionList;
	}

	public static function createQuestion(int $quizId): ?array
	{
		$permitted_chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		$code = substr(str_shuffle($permitted_chars), 0, 4);
		$result = QuizzesTable::add(['QUIZ_ID' => $quizId, 'CODE'=>$code]);
		if ($result->isSuccess())
		{
			return null;
		}
		return $result->getErrors();
	}

	public static function getQuestion(int $id): ?array
	{
		$question = QuestionsTable::getById($id)->fetchAll();
		return $question;
	}
}