<?php

namespace Up\Quiz\Repository;

use Up\Quiz\Model\QuestionsTable;

class QuestionRepository
{
	public static function getQuestions(int $quizId): ?array
	{
		$questionList = QuestionsTable::getList([
			'select' => [
				'ID',
				'QUESTION_TEXT'
			],
			'filter' => ['=QUIZ_ID' => $quizId],
		])->fetchAll();
		return $questionList;
	}

	// public static function createQuestion(int $quizId): ?array
	// {
	// 	$permitted_chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	// 	$code = substr(str_shuffle($permitted_chars), 0, 4);
	// 	$result = QuizzesTable::add(['QUIZ_ID' => $quizId, 'CODE'=>$code]);
	// 	if ($result->isSuccess())
	// 	{
	// 		return null;
	// 	}
	// 	return $result->getErrors();
	// }

	public static function getQuestion(int $id)
	{
		return QuestionsTable::getById($id)->fetch();
	}

	public static function deleteQuestion(int $id): ?array
	{
		$result = QuestionsTable::delete($id);

		if ($result->isSuccess())
		{
			return null;
		}
		return $result->getErrors();
	}

	public static function setQuestion($question): ?array
	{
		$id = $question['ID'];
		$newValues = array(
			'QUESTION_TEXT' => $question['QUESTION_TEXT'],
			'QUESTION_TYPE_ID' => $question['QUESTION_TYPE_ID'],
			'QUESTION_DISPLAY_ID' => $question['QUESTION_DISPLAY_ID'],
			'OPTIONS' => $question['OPTIONS'],
		);
		$result = QuestionsTable::update($id,$newValues);

		return $result->getData();
	}

	public static function createQuestion(int $quizId) : ?int
	{
		$questionValues = [
			'QUIZ_ID' => $quizId,
			'QUESTION_TEXT' => 'Новый вопрос',
			'QUESTION_TYPE_ID' => 0,
			'QUESTION_DISPLAY_ID' => 0,
			'OPTIONS' => null,
		];

		$result = QuestionsTable::add($questionValues);

		if (!$result->isSuccess())
		{
			return null;
		}

		return $result->getId();
	}

	public static function checkQuizHasQuestion(int $quizId, int $questionId) : bool //вопрос существует и принадлежит к переданному квизу
	{
		$result = QuestionsTable::getByPrimary($questionId)->fetch();
		if (($result === false) || ((int)$result['QUIZ_ID'] !== $quizId)) return false;
		return true;
	}

}
