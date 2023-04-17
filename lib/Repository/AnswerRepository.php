<?php

namespace Up\Quiz\Repository;
use Up\Quiz\Model\AnswersTable;
class AnswerRepository
{
	public static function createAnswer(int $questionId, string $answer) : ?array
	{
		$answerValues = [
			'QUESTION_ID' => $questionId,
			'ANSWER' => $answer,
		];
		return AnswersTable::add($answerValues)->getErrors();
	}

	public static function getAnswers($questionId): ?array
	{
		$answersList = AnswersTable::getList([
			'select' => [
				'ANSWER',
			],
			'filter' => ['=QUESTION_ID' => $questionId],
		])->fetchAll();
		return $answersList;
	}

	public static function getAnswersCounts($questionId)
	{
		$query = AnswersTable::query()
					->addSelect('ANSWER')
					->addSelect(new \Bitrix\Main\Entity\ExpressionField('COUNT', 'COUNT(*)'))
					->where('QUESTION_ID', $questionId)
					->addGroup('ANSWER');

		return $query->exec()->fetchAll();
	}
}