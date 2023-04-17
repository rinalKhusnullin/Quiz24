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
}