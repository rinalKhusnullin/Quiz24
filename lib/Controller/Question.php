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
		if ($id <= 0)
		{
			$this->addError(new Error('Question id should be greater than 0', 'invalid_question_id'));
			return null;
		}

		$question = QuestionRepository::getQuestion($id);
		return [
			'question' => $question
		];
	}

	public function getQuestionsAction(int $quizId) : ?array
	{
		if ($quizId <= 0)
		{
			$this->addError(new Error('Quiz id should be greater than 0', 'invalid_quiz_id'));
			return null;
		}

		$questions = QuestionRepository::getQuestions($quizId);
		return [
			'questions' => $questions
		];
	}

	public function setQuestionAction(array $question): ?array
	{
		//check valid question
		return QuestionRepository::setQuestions($question);
	}

	public function createQuestionAction(int $quizId) : ?array
	{
		if ($quizId <= 0)
		{
			$this->addError(new Error('Quiz id should be greater than 0', 'invalid_quiz_id'));
			return null;
		}

		$newQuestionId = QuestionRepository::createQuestion($quizId);
		return [
			'newQuestion' => QuestionRepository::getQuestion($newQuestionId)
		];
	}

	public function deleteQuestionAction(int $id): ?array
	{
		if ($id <= 0)
		{
			$this->addError(new Error('Question id should be greater than 0', 'invalid_quiz_id'));
			return null;
		}

		return QuestionRepository::deleteQuestion($id);
	}
}