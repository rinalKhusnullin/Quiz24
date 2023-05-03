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
			$this->addError(new Error('Question is null or empty', 'empty_question'));
			return null;
		}

		$question["QUESTION_TEXT"] = trim($question["QUESTION_TEXT"]);
		if (empty($question["QUESTION_TEXT"]))
		{
			$this->addError(new Error('Question text cannot be empty', 'empty_question_text'));
		}
		if (mb_strlen($question["QUESTION_TEXT"]) > 256)
		{
			$this->addError(new Error('Question length cannot be more than 256', 'exceeding_question_text'));
		}

		if ((int)$question["ID"] <= 0){
			$this->addError(new Error('Question ID should be greater than 0', 'invalid_question_id'));
		}

		if (!in_array($question["QUESTION_TYPE_ID"], ['0', '1'], true))
		{
			$this->addError(new Error('Invalid value for question type', 'invalid_question_type_id'));
		}

		if (!in_array($question["QUESTION_DISPLAY_ID"], ['0', '1', '2', '3'], true))
		{
			$this->addError(new Error('Invalid value for question result display type', 'invalid_display_type_id'));
		}

		if ($question['QUESTION_TYPE_ID'] === '1' && empty($question["OPTIONS"]))
		{
			$this->addError(new Error('A multiple choice question must have at least one answer choice', 'empty_options'));
		}

		if (!empty($question["OPTIONS"]))
		{
			$options = json_decode($question["OPTIONS"]);
			if ($options === null && json_last_error() !== JSON_ERROR_NONE)
			{
				$this->addError(new Error('Question options parse error', 'parse_options'));
				return null;
			}
			if (count($options) > 20)
			{
				$this->addError(new Error('The maximum number of question options : 20', 'max_count_options'));
				return null;
			}
			$options = array_map('trim', $options);
			foreach ($options as $option)
			{
				if (empty($option))
				{
					$this->addError(new Error('Question options cannot be empty', 'empty_option'));
					break;
				}
				if (mb_strlen($option) > 40)
				{
					$this->addError(new Error('Question options cannot exceed 40 characters', 'exceeding_option'));
					break;
				}
			}
		}

		if (!empty($this->getErrors()))
		{
			return null; // Собираем все ошибки и отдаем клиенту
		}

		global $USER;
		$userId = $USER->GetID();

		if ((int)$question["QUIZ_ID"] <= 0)
		{
			$this->addError(new Error('Quiz id should be greater than 0', 'invalid_quiz_id'));
			return null;
		}

		if (!QuizRepository::checkUserHasQuiz($userId, (int)$question["QUIZ_ID"]))//принадлежит ли quiz текущему пользователю и существует
		{
			$this->addError(new Error('Quiz not found in current User', 'quiz_not_found'));
			return null;
		}

		if (!QuestionRepository::checkQuizHasQuestion((int)$question["QUIZ_ID"], (int)$question["ID"])){//Проверка что вопрос принадлежит именно к этому квизу
			$this->addError(new Error('Question not found in current Quiz', 'question_not_found'));
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
			$this->addError(new Error('Quiz not found in current User', 'quiz_not_found'));
			return null;
		}

		$questionCount = QuestionRepository::getQuestionCount($quizId);
		if ($questionCount > 20)
		{
			$this->addError(new Error('Quiz cannot have more than 20 questions', 'max_count_questions'));
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
			$this->addError(new Error('Quiz not found in current User', 'quiz_not_found'));
			return null;
		}

		if (!QuestionRepository::checkQuizHasQuestion($quizId, $id)){//вопрос принадлежит именно к этому квизу и существует
			$this->addError(new Error('Question not found in current Quiz', 'invalid_question_id'));
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