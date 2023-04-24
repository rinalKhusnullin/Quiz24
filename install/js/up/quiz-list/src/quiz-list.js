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
		this.renderLoading();
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
		return new Promise((resolve, reject) => {
		BX.ajax.runAction(
				'up:quiz.quiz.createQuiz',
				{
					data: {
						title: title,
					},
				})
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
		});
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
										<input id="quiz_title_input" class="input" type="text" placeholder="Введите название опроса">
									</div>
									<p class="help is-danger" id="quiz_title_helper"></p>
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
					<div class="quiz-card__header">
						${this.getHiddenActions(QuizData)}
					</div>
						<div class="quiz-card__content">
							<div class="quiz-card__title">
								<strong class="quiz-card__subtitle is-family-monospace">Название:</strong>
								<div class="quiz-card__title-text has-text-weight-light">
									${BX.util.htmlspecialchars(QuizData.TITLE)}
								</div>
							</div>
						<div class="quiz-card__title">
							<strong class="quiz-card__subtitle is-family-monospace">linkcode:</strong>
							<div class="quiz-card__title-text has-text-weight-light">
								${BX.util.htmlspecialchars(QuizData.CODE)}
							</div>
						</div>
						<div class="quiz-card__title">
							<strong class="quiz-card__subtitle is-family-monospace">Состояние:</strong>
							<div class="quiz-card__title-text has-text-weight-light">
								${(+QuizData.IS_ACTIVE === 1) ? 'Активный' : 'Не активный'}
							</div>
						</div>
					</div>
				</div>
			`;
			QuizContainerNode.appendChild(QuizCard);
		});
		this.rootNode.appendChild(QuizContainerNode);

		const openModalButton = document.getElementById('open_creating_modal_btn');
		openModalButton.addEventListener('click', () =>{
			this.openCreateQuizModal();
		});

		const closeModalElems = document.querySelectorAll('.close-modal');
		closeModalElems.forEach((closeModalElem)=>{
				closeModalElem.addEventListener('click', () => {
					this.closeCreateQuizModal()
			});
		});

		const addButton = document.getElementById('creating_quiz_btn');
		addButton.addEventListener('click', () => {

			let quizTitleHelper = document.getElementById('quiz_title_helper');
			let quizTitleInput = document.getElementById('quiz_title_input');

			addButton.classList.add('is-loading');

			this.createQuiz(quizTitleInput.value).then(result => {
				addButton.classList.remove('is-loading');

				window.open(`/quiz/${result.data}/edit`, '_blank');

				this.closeCreateQuizModal();

				quizTitleInput.value = '';
				quizTitleHelper.textContent = '';

			}, reject => {
				addButton.classList.remove('is-loading');
				quizTitleHelper.textContent = reject.errors[0].message;
				quizTitleInput.oninput = () => {
					quizTitleHelper.textContent = '';
				};
			});
		});
	}

	openCreateQuizModal()
	{
		document.getElementById('quiz_title_helper').textContent = '';
		const modal = document.getElementById('new_quiz_modal');
		modal.classList.add("is-active");
	}

	closeCreateQuizModal()
	{
		const modal = document.getElementById('new_quiz_modal');
		modal.classList.remove("is-active");
	}

	getShareNode(quiz)
	{
		let quizTakeLink = `${location.hostname}/quiz/${quiz.CODE}/take`;

		const shareButton = Tag.render`
			<a class="button hidden-action" >
				<i class="fa-solid fa-link"></i>
				Поделиться
			</a>
		`;

		const shareModal = Tag.render`
			<div class="modal">
				<div class="modal-background to-close"></div>
				<div class="modal-content box">
					<div class="qr mb-4"></div>
					<div>
						<input type="text" class="input mb-2" value="${BX.util.htmlspecialchars(quizTakeLink)}" readonly>
						<button class="button is-success copy">Скопировать</button>
					</div>
				</div>
				<button class="modal-close is-large to-close" aria-label="close"></button>
			</div>
		`;

		shareButton.onclick = () => {
			shareModal.classList.add('is-active');
		};

		let elemsToCloseModal = shareModal.querySelectorAll('.to-close');
		elemsToCloseModal.forEach(elem => {
			elem.onclick = () => {
				shareModal.classList.remove('is-active');
			};
		});

		let copyButton = shareModal.querySelector('.copy');
		copyButton.onclick = () => {
			shareModal.querySelector('.input').select();
			document.execCommand("copy");
		};

		new QRCode(shareModal.querySelector(`.qr`), {
			text: quizTakeLink,
			width: 600,
			height: 600,
			colorDark : "#000000",
			colorLight : "#ffffff",
			correctLevel : QRCode.CorrectLevel.H
		});

		return Tag.render`
			${shareButton}
			${shareModal}
		`;
	}

	getHiddenActions(quiz)
	{
		const showHiddenActions = Tag.render`
			<a class="button quiz-card__more-action-btn">
				<i class="fa-solid fa-bars"></i>
			</a>
		`;

		const stateQuizButton = Tag.render`
			<a class="hidden-action button">
				<i class="fa-solid fa-${(+quiz.IS_ACTIVE === 1) ? 'stop' : 'play'} fa-fw"></i>
				${(+quiz.IS_ACTIVE === 1) ? 'Деактивировать' : 'Активировать'}
			</a>`;
		stateQuizButton.onclick = () => {
			this.changeState(quiz.ID);
		};

		const editQuizButton = Tag.render`
			<a href="/quiz/${quiz.ID}/edit" class="button hidden-action">
				<i class="fa-solid fa-pen fa-fw"></i>
				Редактировать
			</a>`;

		const deleteQuizButton = Tag.render`
			<a class="button delete-quiz-button hidden-action" >
				<i class="fa-sharp fa-solid fa-trash fa-fw"></i>
				Удалить
			</a>`;
		deleteQuizButton.onclick = () => {
			this.deleteQuiz(+quiz.ID);
		};

		const showResultButton = Tag.render`
			<a href="/quiz/${quiz.ID}/show" class="button hidden-action">
				<i class="fa-sharp fa-solid fa-chart-column fa-fw"></i>
				Показать результаты
			</a>`;

		const hiddenActions = Tag.render`
			<div class="quiz-card__hidden-actions hidden">
				${stateQuizButton}
				${editQuizButton}
				${showResultButton}
				${this.getShareNode(quiz)}
				${deleteQuizButton}
			</div>
		`;

		showHiddenActions.onclick = () => {
			hiddenActions.classList.toggle('hidden')
			const icon = showHiddenActions.querySelector('i');
			if (icon.classList.contains('fa-bars'))
			{
				icon.classList.remove('fa-bars');
				icon.classList.add('fa-circle-xmark');
			}
			else
			{
				icon.classList.remove('fa-circle-xmark');
				icon.classList.add('fa-bars');
			}
		};

		return Tag.render`${showHiddenActions}${hiddenActions}`;
	}
}