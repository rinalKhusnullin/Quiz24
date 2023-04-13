import {Type} from 'main.core';

export class QuizTake
{
	constructor(options = {name: 'QuizTake'})
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