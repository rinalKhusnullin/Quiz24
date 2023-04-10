import {Type} from 'main.core';

export class QuizList
{
	constructor(options = {name: 'QuizList'})
	{
		this.name = options.name;
	}

	setName(name)
	{
		if (Type.isString(name))
		{
			this.name = name;
		}
	}

	getName()
	{
		return this.name;
	}
}