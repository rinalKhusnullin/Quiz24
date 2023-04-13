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
					<a class="is-success is-button quiz-card__new-quiz-btn" id="open_creating_modal_btn">
						<i class="fa-solid fa-plus"></i>
					</a>
					<div class="modal" id="new_quiz_modal">
						<div class="modal-background close-modal"></div>
						<div class="modal-card">
							<header class="modal-card-head">
								<p class="modal-card-title">Создание опроса</p>
								<button class="delete close-modal" aria-label="close"></button>
							</header>
							<section class="modal-card-body is-dark">
								<div class="field">
									<label class="label">Название опроса</label>
									<div class="control">
										<input id="quizTitle" class="input" type="text" placeholder="Введите название опроса">
									</div>
								</div>
							</section>
							<footer class="modal-card-foot">
								<button class="button is-success" id="creating_quiz_btn">Создать</button>
								<button class="button close-modal">Cancel</button>
							</footer>
						</div>
					</div>
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
						<a href="/quiz/${QuizData.ID}/show" class="button">
							<i class="fa-sharp fa-solid fa-chart-column"></i>
						</a>
						<a class="button delete-quiz-button" >
							<i class="fa-sharp fa-solid fa-trash"></i>
						</a>
					</div>
				</div>
			`;
			QuizContainerNode.appendChild(QuizCard);
		});
		this.rootNode.appendChild(QuizContainerNode);

		const openModalButton = document.getElementById('open_creating_modal_btn');
		openModalButton.addEventListener('click', () =>{
			this.openCreatingQuizModal();
		});

		const closeModalElems = document.querySelectorAll('.close-modal');
		closeModalElems.forEach((closeModalElem)=>{
				closeModalElem.addEventListener('click', () => {
					this.closeCreatingQuizModal();
			});
		});

		const addButton = document.getElementById('creating_quiz_btn');
		addButton.addEventListener('click', () => {
			let quizTitle = document.getElementById('quizTitle').value;
			this.createQuiz(quizTitle);
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

	openCreatingQuizModal()
	{
		const modal = document.getElementById('new_quiz_modal');
		modal.classList.add("is-active");
	}

	closeCreatingQuizModal()
	{
		const modal = document.getElementById('new_quiz_modal');
		modal.classList.remove("is-active");
	}
}