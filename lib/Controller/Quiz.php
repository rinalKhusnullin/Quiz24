<?php
namespace Up\Quiz\Controller;

use Bitrix\Main\Engine;
use Bitrix\Main\Error;
use Up\Quiz\Repository\QuizRepository;

class Quiz extends Engine\Controller
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

	public function createQuizAction(string $title, int $id): ?array
	{
		if (!empty(trim($title)))
		{
			return QuizRepository::createQuiz($title, $id);
		}
		return null;
	}

	public function getListAction(): ?array
	{
		$quizList = QuizRepository::getPage();
		return [
			'quizList' => $quizList
		];
	}

	public function deleteQuizAction(int $id): ?array
	{
		return QuizRepository::deleteQuiz($id);
	}

	public function getQuestionAction(int $id) : ?array
	{
		return [
			'question' => [
				'title' => 'Кто же нальет кофе?',
				'questionType' => 'selectable',
				'questionTypes' => ['free', 'selectable'],
				'displayType' => 'pieChart',
				'displayTypes' => ['pieChart', 'barChart', 'tagCloud', 'rawOutput'],
				'selectableAnswers' => ['Андрей', 'Кошка', 'Собака', 'Затрудняюсь ответить']
			]
		];
	}

	public function getQuestionsAction(int $quizId) : ?array
	{
		return [
			'questions' => [
				[
					'title' => 'Кто же нальет кофе?',
					'questionType' => 'free',
					'questionTypes' => ['free', 'selectable'],
					'displayType' => 'pieChart',
					'displayTypes' => ['pieChart', 'barChart', 'tagCloud', 'rawOutput'],
				],
				[
					'title' => 'Кто же нальет кофе?',
					'questionType' => 'free',
					'questionTypes' => ['free', 'selectable'],
					'displayType' => 'pieChart',
					'displayTypes' => ['pieChart', 'barChart', 'tagCloud', 'rawOutput'],
				],
				[
					'title' => 'Кто же нальет кофе?',
					'questionType' => 'free',
					'questionTypes' => ['free', 'selectable'],
					'displayType' => 'pieChart',
					'displayTypes' => ['pieChart', 'barChart', 'tagCloud', 'rawOutput'],
				],
			]
		];
	}
}
