<?php

class QuizEditComponent extends CBitrixComponent
{
	public function executeComponent()
	{
		global $USER;
		if ($USER->IsAuthorized())
		{
			$this->includeComponentTemplate();
		}
    }
}
