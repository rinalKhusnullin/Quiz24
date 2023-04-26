<?php

namespace Up\Quiz\Controller;

use Bitrix\Main\Engine;
use Bitrix\Main\Error;
use Up\Quiz\Repository\QuestionRepository;
use Up\Quiz\Repository\QuizRepository;

class Question extends Engine\Controller
{
	protected function getDefaultPreFilters()
	{
		return array_merge(
			parent::getDefaultPreFilters(), [
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
			'question' => $question,
		];
	}

	public function getQuestionsAction(int $quizId): ?array
	{
		if ($quizId <= 0)
		{
			$this->addError(new Error('Quiz id should be greater than 0', 'invalid_quiz_id'));

			return null;
		}

		$questions = QuestionRepository::getQuestions($quizId);

		return [
			'questions' => $questions,
		];
	}

	public function setQuestionAction(array $question): ?array
	{

		if (empty($question))
		{
			$this->addError(new Error('Question is null or empty', 'invalid_question'));

			return null;
		}

		if ($question["OPTIONS"] !== null)
		{
			$options = json_decode($question["OPTIONS"]);
			if ($options === null && json_last_error() !== JSON_ERROR_NONE)
			{
				$this->addError(new Error('Question options parse error', 'invalid_options'));
				return null;
			}
			$options = array_map('trim', $options);
			foreach ($options as $option)
			{
				if ($option === '')
				{
					$this->addError(new Error('Question option must be not empty', 'invalid_options'));
					return null;
				}
			}
		}
		if (count($question["OPTIONS"]) > 20)
		{
			$this->addError(new Error('Question option must be less then 20', 'invalid_options'));
			return null;
		}

		$question["QUESTION_TEXT"] = trim($question["QUESTION_TEXT"]);
		if ($question["QUESTION_TEXT"] === '')
		{
			$this->addError(new Error('Question text be not empty', 'invalid_text'));

			return null;
		}

		global $USER;
		$userId = $USER->GetID();

		if (!is_numeric($question["QUIZ_ID"]))
		{
			$this->addError(new Error('QuizID must be numeric', 'invalid_quizId'));
			return null;
		}

		if (!QuizRepository::checkUserHasQuiz($userId, (int)$question["QUIZ_ID"]))//принадлежит ли quiz текущему пользователю и существует
		{
			$this->addError(new Error('Quiz not found in current User', 'invalid_quizId'));
			return null;
		}

		if (!is_numeric($question["ID"])){
			$this->addError(new Error('Question ID must be numeric', 'invalid_questionId'));
			return null;
		}

		if (!QuestionRepository::checkQuizHasQuestion((int)$question["QUIZ_ID"], (int)$question["ID"])){//Проверка что вопрос принадлежит именно к этому квизу
			$this->addError(new Error('Question not found in current Quiz', 'invalid_questionId'));
			return null;
		}

		return QuestionRepository::setQuestion($question);
	}

	public function createQuestionAction(int $quizId): ?array
	{

		if ($quizId <= 0)
		{
			$this->addError(new Error('Quiz id should be greater than 0', 'invalid_quiz_id'));
			return null;
		}

		global $USER;
		$userId = $USER->GetID();
		if (!QuizRepository::checkUserHasQuiz($userId, $quizId))//принадлежит ли quiz текущему пользователю и существует
		{
			$this->addError(new Error('Quiz not found in current User', 'invalid_quizId'));
			return null;
		}

		$newQuestionId = QuestionRepository::createQuestion($quizId);

		return [
			'newQuestion' => QuestionRepository::getQuestion($newQuestionId),
		];
	}

	public function deleteQuestionAction(int $id, int $quizId): ?array
	{
		if ($id <= 0)
		{
			$this->addError(new Error('Question id should be greater than 0', 'invalid_quiz_id'));
			return null;
		}

		global $USER;
		$userId = $USER->GetID();
		if (!QuizRepository::checkUserHasQuiz($userId, $quizId))//quiz принадлежит текущему пользователю и существует
		{
			$this->addError(new Error('Quiz not found in current User', 'invalid_quizId'));
			return null;
		}

		if (!QuestionRepository::checkQuizHasQuestion($quizId, $id)){//вопрос принадлежит именно к этому квизу и существует
			$this->addError(new Error('Question not found in current Quiz', 'invalid_questionId'));
			return null;
		}

		return QuestionRepository::deleteQuestion($id);
	}

	public function configureActions()
	{
		return [
			'getQuestions' => [
				'-prefilters' => [
					\Bitrix\Main\Engine\ActionFilter\Authentication::class,
				],
			],
			'getQuestion' => [
				'-prefilters' => [
					\Bitrix\Main\Engine\ActionFilter\Authentication::class,
				],
			],
		];
	}
}