<?php
namespace Up\Quiz\Model;

use Bitrix\Main\Localization\Loc,
	Bitrix\Main\ORM\Data\DataManager,
	Bitrix\Main\ORM\Fields\IntegerField,
	Bitrix\Main\ORM\Fields\StringField,
	Bitrix\Main\ORM\Fields\Validators\LengthValidator;

Loc::loadMessages(__FILE__);

/**
 * Fields:
 *
 * @package Bitrix\Tasks
 **/

class quiz extends DataManager
{
	/**
	 * Returns DB table name for entity.
	 *
	 * @return string
	 */
	public static function getTableName()
	{
		return 'up_quiz_quizzes';
	}

	/**
	 * Returns entity map definition.
	 *
	 * @return array
	 */
	public static function getMap()
	{
		return [
			(new IntegerField('ID',
							  []
			))->configureTitle(Loc::getMessage('TASKS_ENTITY_ID_FIELD'))
			  ->configurePrimary(true),
			(new StringField('NAME',
							 [
								 'validation' => [__CLASS__, 'validateName']
							 ]
			))->configureTitle(Loc::getMessage('TASKS_ENTITY_NAME_FIELD'))
			  ->configureRequired(true),
		];
	}

	/**
	 * Returns validators for NAME field.
	 *
	 * @return array
	 */
	public static function validateName()
	{
		return [
			new LengthValidator(null, 255),
		];
	}
}
