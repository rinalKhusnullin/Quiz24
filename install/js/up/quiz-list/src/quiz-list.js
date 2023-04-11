import {Type} from 'main.core';
import './quiz-list.css';
export class QuizList
{
	constructor(options = {})
	{
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

	createTask(title)
	{
		BX.ajax.runAction(
				'up:quiz.quiz.createQuiz',
				{
					data: {
						title: title,
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

	render()
	{

	}

}