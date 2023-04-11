import {Type, Tag} from 'main.core';
import './quiz-list.css';
export class QuizList
{
	constructor(options = {})
	{
		if (Type.isStringFilled(options.rootNodeId))
		{
			this.rootNodeId = options.rootNodeId;
		}
		else
		{
			throw new Error('QuizList: options.rootNodeId required');
		}

		this.rootNode = document.getElementById(this.rootNodeId);
		if (!this.rootNode)
		{
			throw new Error(`QuizList: element with id "${this.rootNodeId}" not found`);
		}

		this.quizList = [];
		this.reload();
	}

	reload()
	{
		this.loadList()
			.then(quizList => {
				this.quizList = quizList;
				this.render();
			});
	}

	loadList()
	{
		return new Promise((resolve, reject) => {
			BX.ajax.runAction(
					'up:quiz.quiz.getList',
				)
				.then((response) => {
					const quizList = response.data.quizList;
					resolve(quizList);
				})
				.catch((error) => {
					console.error(error);
					reject(error);
				})
			;
		});
	}

	createQuiz(title)
	{
		let UserId = 1;
		BX.ajax.runAction(
				'up:quiz.quiz.createQuiz',
				{
					data: {
						title: title,
						id: UserId
					},
				})
			.then((response) => {
				if (response.data != null)
				{
					//check response
					console.error('errors:', response.data);
				}
				else
				{
					this.reload();
				}
			})
			.catch((error) => {
				console.error(error);
			})
		;
	}

	deleteQuiz(id){
		BX.ajax.runAction(
				'up:quiz.quiz.deleteQuiz',
				{
					data: {
						id: id,
					},
				})
			.then((response) => {
				if (response.data != null)
				{
					console.error('errors:', response.data);
				}
				else
				{
					this.reload();
				}

			})
			.catch((error) => {
				console.error(error);
			})
		;
	}

	render()
	{
		this.rootNode.innerHTML = ``;

		const QuizContainerNode = Tag.render`
			<div class="quiz-container">
				<div class="quiz-card quiz-card__add-new">
					<a class="is-success is-button quiz-card__new-quiz-btn" id="quiz-card__new-quiz-btn">
						<i class="fa-solid fa-plus"></i>
					</a>
				</div>
			</div>
		`;

		this.quizList.forEach(QuizData => {
			const QuizCard = Tag.render`
				<div class="quiz-card" data-quiz-id="${QuizData.ID}">
					<div class="quiz-card__header"></div>
						<div class="quiz-card__content">
							<div class="quiz-card__title">
								<strong class="quiz-card__subtitle is-family-monospace">Название:</strong>
								<div class="quiz-card__title-text has-text-weight-light">
									${QuizData.TITLE}
								</div>
							</div>
						<div class="quiz-card__title">
							<strong class="quiz-card__subtitle is-family-monospace">linkcode:</strong>
							<div class="quiz-card__title-text has-text-weight-light">
								${QuizData.CODE}
							</div>
						</div>
					</div>
					<div class="quiz-card__hidden-btns">
						<a href="/quiz/${QuizData.ID}/edit" class="button">
							<i class="fa-solid fa-pen"></i>
						</a>
						<a href="##" class="button">
							<i class="fa-sharp fa-solid fa-chart-column"></i>
						</a>
						<a href="##" class="button delete-quiz-button" >
							<i class="fa-sharp fa-solid fa-trash"></i>
						</a>
					</div>
				</div>
			`;
			QuizContainerNode.appendChild(QuizCard);
		});
		this.rootNode.appendChild(QuizContainerNode);

		const addButton = document.getElementById('quiz-card__new-quiz-btn');
		addButton.addEventListener('click', () => {
				this.createQuiz("New Quiz");
		});

		const deleteButtons = document.querySelectorAll('.delete-quiz-button');
		deleteButtons.forEach(button => {
			button.addEventListener('click', () => {
				let quizId = parseInt(button.closest('.quiz-card').getAttribute('data-quiz-id'));
				if (!isNaN(quizId))
				{
					this.deleteQuiz(quizId);
				}
				else
				{
					console.error('Attribute data-quiz-id of this element is not a number ');
				}
			});
		});
	}
}