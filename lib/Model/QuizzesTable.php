<?php
namespace Up\Quiz\Model;

use Bitrix\Main\Localization\Loc,
	Bitrix\Main\ORM\Data\DataManager,
	Bitrix\Main\ORM\Fields\IntegerField,
	Bitrix\Main\ORM\Fields\StringField,
	Bitrix\Main\ORM\Fields\Validators\LengthValidator;

Loc::loadMessages(__FILE__);

/**
 * Class QuizzesTable
 *
 * Fields:
 * <ul>
 * <li> ID int mandatory
 * <li> TITLE string(256) mandatory
 * <li> CODE string(4) mandatory
 * <li> USER_ID int mandatory
 * </ul>
 *
 * @package Bitrix\Quiz
 **/

class QuizzesTable extends DataManager
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
			))->configureTitle(Loc::getMessage('QUIZZES_ENTITY_ID_FIELD'))
			  ->configurePrimary(true)
			  ->configureAutocomplete(true),
			(new StringField('TITLE',
							 [
								 'validation' => [__CLASS__, 'validateTitle']
							 ]
			))->configureTitle(Loc::getMessage('QUIZZES_ENTITY_TITLE_FIELD'))
			  ->configureRequired(true),
			(new StringField('CODE',
							 [
								 'validation' => [__CLASS__, 'validateCode']
							 ]
			))->configureTitle(Loc::getMessage('QUIZZES_ENTITY_CODE_FIELD'))
			  ->configureRequired(true),
			(new IntegerField('USER_ID',
							  []
			))->configureTitle(Loc::getMessage('QUIZZES_ENTITY_USER_ID_FIELD'))
			  ->configureRequired(true),
		];
	}

	/**
	 * Returns validators for TITLE field.
	 *
	 * @return array
	 */
	public static function validateTitle()
	{
		return [
			new LengthValidator(null, 256),
		];
	}

	/**
	 * Returns validators for CODE field.
	 *
	 * @return array
	 */
	public static function validateCode()
	{
		return [
			new LengthValidator(null, 4),
		];
	}
}