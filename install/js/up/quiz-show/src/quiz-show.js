import {Type} from 'main.core';

export class QuizShow
{
	constructor(options = {name: 'QuizShow'})
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