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

		this.userId = 1;

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
		this.renderLoading();
		let UserId = 1;
		return new Promise((resolve, reject) => {
			BX.ajax.runAction(
					'up:quiz.quiz.getList',{
						data : {
							userId : UserId,
						}
					}
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
		BX.ajax.runAction(
				'up:quiz.quiz.createQuiz',
				{
					data: {
						title: title,
						userId: this.userId,
					},
				})
			.then((response) => {
				if (Number.isInteger(response.data)){
					window.location.href = `/quiz/${response.data}/edit`;
				}
			})
			.catch((error) => {
				let errors = error.errors;
				errors.forEach(error => {
					if (error.code === 'invalid_user_id'){
						alert('TODO:НЕПРАВИЛЬНЫЙ USER_ID');
					}
				});

				console.log(error);
			})
		;
	}

	deleteQuiz(id){
		this.renderLoading();
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

	renderLoading()
	{
		if (!(this.rootNode.innerHTML === '<div class="donut"></div>'))
			this.rootNode.innerHTML = `<div class="donut"></div>`;
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
									<p class="help" id="creating-quiz-helper"></p>
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
			let isActive = (+QuizData.IS_ACTIVE === 1) ? 'Включен' : 'Выключен';
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
						<div class="quiz-card__title">
							<strong class="quiz-card__subtitle is-family-monospace">Состояние:</strong>
							<div class="quiz-card__title-text has-text-weight-light">
								${isActive}
							</div>
						</div>
					</div>
					<div class="quiz-card__hidden-btns">
						${this.getStateButton(QuizData)}
						<a href="/quiz/${QuizData.ID}/edit" title="Редактировать опрос">
							<i class="fa-solid fa-pen fa-fw"></i>
						</a>
						<a href="/quiz/${QuizData.ID}/show" title="Показать результаты">
							<i class="fa-sharp fa-solid fa-chart-column fa-fw"></i>
						</a>
						<a href="/quiz/${QuizData.ID}/show" title="Поделиться">
							<i class="fa-solid fa-link fa-fw"></i>
						</a>
						<a class="delete-quiz-button" title="Удалить опрос">
							<i class="fa-sharp fa-solid fa-trash fa-fw"></i>
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
			if (quizTitle !== '') this.createQuiz(quizTitle);
		});

		const QuizTitleInput = document.getElementById('quizTitle');
		QuizTitleInput.addEventListener('input', () => {
			const QuizTitleInputHelper = document.getElementById('creating-quiz-helper');
			if (QuizTitleInput.value === ''){ //todo Я знаю, что это ужасно! Думаю вынести в отдельную функцию
				QuizTitleInput.classList.add('is-danger');
				QuizTitleInput.classList.remove('is-success');
				QuizTitleInputHelper.textContent = 'Название опроса не может быть пустым!'
				QuizTitleInputHelper.classList.add('is-danger');
				QuizTitleInputHelper.classList.remove('is-success');
			}
			else
			{
				QuizTitleInput.classList.add('is-success');
				QuizTitleInput.classList.remove('is-danger');
				QuizTitleInputHelper.textContent = 'Все кул!'
				QuizTitleInputHelper.classList.remove('is-danger');
				QuizTitleInputHelper.classList.add('is-success');
			}
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

	getStateButton(quiz)
	{
		const button = Tag.render`<a></a>`;
		if (+quiz.IS_ACTIVE === 0)
		{
			button.title = 'Запустить опрос';
			button.appendChild(Tag.render`<i class="fa-sharp fa-regular fa-circle-play fa-fw"></i>`);
		}
		else
		{
			button.title = 'Выключить опрос';
			button.appendChild(Tag.render`<i class="fa-sharp fa-regular fa-circle-stop fa-fw"></i>`);
		}

		button.onclick = () => {
			this.changeState(quiz.ID);
		};

		return button;
	}

	changeState(id)
	{
		BX.ajax.runAction(
				'up:quiz.quiz.changeState',
				{
					data: {
						id : id
					},
				})
			.then((response) => {
				if (response.data.quizId === null)
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
}