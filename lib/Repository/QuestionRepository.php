<?php

namespace Up\Quiz\Repository;

use Up\Quiz\Model\QuestionsTable;
use Up\Quiz\Repository\QuizRepository;
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

	public static function getQuestion(int $id)
	{
		$question = QuestionsTable::getById($id)->fetch();
		$question['QUESTION_TEXT'] = stripslashes($question['QUESTION_TEXT']);
		$question['QUESTION_TYPE_ID'] = stripslashes($question['QUESTION_TYPE_ID']);
		$question['QUESTION_DISPLAY_ID'] = stripslashes($question['QUESTION_DISPLAY_ID']);
		$question['OPTIONS'] = stripslashes($question['OPTIONS']);
		return $question;
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

		$sqlHelper = \Bitrix\Main\Application::getConnection()->getSqlHelper();

		$question['QUESTION_TEXT'] = $sqlHelper->forSql($question['QUESTION_TEXT']);
		$question['QUESTION_TYPE_ID'] = $sqlHelper->forSql($question['QUESTION_TYPE_ID']);
		$question['QUESTION_DISPLAY_ID'] = $sqlHelper->forSql($question['QUESTION_DISPLAY_ID']);
		$question['OPTIONS'] = $sqlHelper->forSql($question['OPTIONS']);

		$newValues = array(
			'QUESTION_TEXT' => $question['QUESTION_TEXT'],
			'QUESTION_TYPE_ID' => $question['QUESTION_TYPE_ID'],
			'QUESTION_DISPLAY_ID' => $question['QUESTION_DISPLAY_ID'],
			'OPTIONS' => $question['OPTIONS'],
		);

		return QuestionsTable::update($id,$newValues)->getData();
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

	public static function getUserIdByQuestionId(int $questionId)
	{
		$result = QuestionsTable::getByPrimary($questionId)->fetch();
		$quizId = $result['QUIZ_ID'];
		return QuizRepository::getUserIdByQuizId($quizId);
	}

	public static function checkQuizHasQuestion(int $quizId, int $questionId) : bool //вопрос существует и принадлежит к переданному квизу
	{
		$result = QuestionsTable::getByPrimary($questionId)->fetch();
		if (($result === false) || ((int)$result['QUIZ_ID'] !== $quizId)) return false;
		return true;
	}

	public static function getQuestionCount(int $quizId) : int
	{
		return QuestionsTable::getCount(['=QUIZ_ID' => $quizId]);
	}

}
