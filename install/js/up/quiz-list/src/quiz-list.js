import {Type, Tag} from 'main.core';
import './quiz-list.css';


export class QuizList
{

	config = {
		MAX_QUIZ_TITLE_LENGTH : 38,
	}





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

		if (Type.isStringFilled(options.filterNodeId))
		{
			this.filterNodeId = options.filterNodeId;
		}
		else
		{
			throw new Error('QuizList: options.filterNodeId required');
		}

		this.rootNode = document.getElementById(this.rootNodeId);
		if (!this.rootNode)
		{
			throw new Error(`QuizList: element with id "${this.rootNodeId}" not found`);
		}
		this.filterNode = document.getElementById(this.filterNodeId);
		if (!this.filterNode)
		{
			throw new Error(`QuizList: element with id "${this.filterNodeId}" not found`);
		}

		this.LinkIsCopyNotify = null;

		this.getFilterNode().forEach(node => {
			this.filterNode.appendChild(node);
		});

		this.query = '';
		this.quizState = 'all';
		this.quizList = [];
		this.reload();
	}

	reload()
	{
		if (this.query === '' && this.quizState === 'all')
			this.loadList()
				.then(quizList => {
					this.quizList = quizList;
					this.render();
				});
		else
			this.loadQuizzesByFilters()
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

	loadQuizzesByFilters()
	{
		this.renderLoading();
		return new Promise((resolve, reject) => {
			BX.ajax.runAction(
					'up:quiz.quiz.getQuizzesByFilters',{
						data: {
							query : this.query,
							state : this.quizState,
						}
					}
				)
				.then((response) => {
					resolve(response.data.quizList);
				})
				.catch((error) => {
					reject(error);
				})
			;
		});
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
						<span class="quiz-card__add-new-title mobile">Создать опрос</span>
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
								<button class="button is-dark" id="creating_quiz_btn">Создать</button>
								<button class="button close-modal">Назад</button>
							</footer>
						</div>
					</div>
				</div>
			</div>
		`;

		this.quizList.forEach(QuizData => {
			let shortQuizTitle = this.truncateText(QuizData.TITLE, this.config.MAX_QUIZ_TITLE_LENGTH);
			const QuizCard = Tag.render`
				<div class="quiz-card" data-quiz-id="${QuizData.ID}">
					<div class="quiz-card__header">
						${this.getHiddenActions(QuizData)}
					</div>
						<div class="quiz-card__content">
							<div class="quiz-card__title">
								<strong class="quiz-card__subtitle is-family-monospace">Название:</strong>
								<div class="quiz-card__title-text has-text-weight-light">
									${BX.util.htmlspecialchars(shortQuizTitle)}
									${(QuizData.TITLE.length > 50) ? `<div class="quiz-card__title-show-more">${BX.util.htmlspecialchars(QuizData.TITLE)}</div>` : ''}
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
								${(+QuizData.IS_ACTIVE === 1) ? 'Активный' : 'Неактивный'}
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
		let MaxCountQuizzesNotify = new BX.UI.Notification.Balloon({
			stack : new BX.UI.Notification.Stack({position: 'bottom-center'}),
			content : 'Количество создаваемых опросов - 11. Купите Premium и забудьте об ограничениях!',
			autoHide: true,
			autoHideDelay: 5000,
		});
		addButton.addEventListener('click', () => {

			let quizTitleHelper = document.getElementById('quiz_title_helper');
			let quizTitleInput = document.getElementById('quiz_title_input');

			addButton.classList.add('is-loading');

			this.createQuiz(quizTitleInput.value).then(result => {
				addButton.classList.remove('is-loading');
				window.location.replace(`/quiz/${result.data}/edit`);

			}, reject => {
				if (reject.errors[0].code === 'max_count_quizzes')
				{
					addButton.classList.remove('is-loading');
					this.closeCreateQuizModal();
					MaxCountQuizzesNotify.show();
					return;
				}
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
				<div class="modal-content box qr-modal">
					<div class="qr mb-4"></div>
					<div>
						<input type="text" class="input mb-2" value="${BX.util.htmlspecialchars(quizTakeLink)}" readonly>
						<button class="button is-dark copy">Скопировать</button>
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
		let CopyLinkIsSuccess = new BX.UI.Notification.Balloon({
			stack : new BX.UI.Notification.Stack({position: 'bottom-center'}),
			content : 'Ссылка на опрос успешно скопирована!',
			autoHide: true,
			autoHideDelay: 1000,
			blinkOnUpdate: true,
		});
		copyButton.onclick = () => {
			shareModal.querySelector('.input').select();
			document.execCommand("copy");
			CopyLinkIsSuccess.show();
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
		const showHiddenActionsButton = Tag.render`
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

		const goToTakeQuizButton = Tag.render`
			<a href="/quiz/${quiz.CODE}/take" class="button hidden-action">
				<i class="fa-sharp fa-solid fa-arrow-up-right-from-square fa-fw"></i>
				Перейти к прохождению опроса
			</a>`;

		const hiddenActionsNode = Tag.render`
			<div class="quiz-card__hidden-actions hidden">
				${stateQuizButton}
				${editQuizButton}
				${showResultButton}
				${this.getShareNode(quiz)}
				${goToTakeQuizButton}
				${deleteQuizButton}
			</div>
		`;



		showHiddenActionsButton.onclick = () => {
			hiddenActionsNode.classList.toggle('hidden')
			const icon = showHiddenActionsButton.querySelector('i');
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

		return Tag.render`${showHiddenActionsButton}${hiddenActionsNode}`;
	}

	getFilterNode()
	{
		let ShowAllQuizzesButton = Tag.render`<button class="button is-dark is-selected" value="all"><span>Все</span></button>`;
		let ShowActiveQuizzesButton = Tag.render`<button class="button" value="active"><span>Активные</span></button>`;
		let ShowNotActiveQuizzesButton = Tag.render`<button class="button" value="notActive"><span>Неактивные</span></button>`;

		let filterButtons = [ShowNotActiveQuizzesButton, ShowAllQuizzesButton, ShowActiveQuizzesButton];

		filterButtons.forEach(button => {
			button.onclick = () => {
				if (button.classList.contains('is-dark') && button.classList.contains('is-selected')) return;
				button.classList.add('is-dark', 'is-selected');
				this.quizState = button.value;
				filterButtons.forEach(otherButton => {
					if (button !== otherButton)
					{
						otherButton.classList.remove('is-dark', 'is-selected');
					}
				});
				this.loadQuizzesByFilters().then(quizList => {
					this.quizList = quizList;
					this.render();
				})
			};
		});

		let SearchInput = Tag.render`<input class="input" type="text" placeholder="Найти опрос" id="search-input">`;
		let SearchButton = Tag.render`<button class="button" id="search-button">Поиск</button>`;

		SearchInput.oninput = () => {this.query = SearchInput.value;}
		SearchButton.onclick = () => {
			this.loadQuizzesByFilters().then(quizList => {
				this.quizList = quizList;
				this.render();
			})
		}

		const FilterNode = Tag.render`
			<div class="level-left">
				<div class="level-item">
					<div class="field has-addons">
						<p class="control">
							${SearchInput}
						</p>
						<p class="control">
							${SearchButton}
						</p>
					</div>
				</div>
			</div>

	<!-- Right side -->
			<div class="level-right">
				<div class="field has-addons">
					<p class="control">
						${ShowAllQuizzesButton}
					</p>
					<p class="control">
						${ShowActiveQuizzesButton}
					</p>
					<p class="control">
						${ShowNotActiveQuizzesButton}
					</p>
				</div>
			</div>`;

		return FilterNode;
	}

	truncateText(text, length)
	{
		if (text.length < length)
		{
			return text;
		}
		return text.slice(0, length - 3) + '...';
	}
}