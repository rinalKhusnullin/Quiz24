<?php
namespace Up\Quiz\Controller;

use Bitrix\Main\Engine;
use Bitrix\Main\Error;
use Up\Quiz\Repository\QuestionRepository;

class Question extends Engine\Controller
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

	public function getQuestionAction(int $id): ?array
	{
		$question = QuestionRepository::getQuestion($id);
		return [
			'question' => $question
		];
	}

	public function getQuestionsAction(int $quizId) : ?array
	{
		$questions = QuestionRepository::getQuestions($quizId);
		return [
			'questions' => $questions
		];
	}

	public function setQuestionAction(array $question): ?array
	{

		return QuestionRepository::setQuestions($question);
	}
}