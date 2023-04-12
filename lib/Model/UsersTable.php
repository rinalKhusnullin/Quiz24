<?php
namespace Up\Quiz\Model;

use Bitrix\Main\Localization\Loc,
	Bitrix\Main\ORM\Data\DataManager,
	Bitrix\Main\ORM\Fields\IntegerField,
	Bitrix\Main\ORM\Fields\StringField,
	Bitrix\Main\ORM\Fields\Validators\LengthValidator;

Loc::loadMessages(__FILE__);

/**
 * Class UsersTable
 *
 * Fields:
 * <ul>
 * <li> ID int mandatory
 * <li> NAME string(64) mandatory
 * <li> PASSWORD_HASH string(128) mandatory
 * </ul>
 *
 * @package Bitrix\Quiz
 **/

class UsersTable extends DataManager
{
	/**
	 * Returns DB table name for entity.
	 *
	 * @return string
	 */
	public static function getTableName()
	{
		return 'up_quiz_users';
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
			))->configureTitle(Loc::getMessage('USERS_ENTITY_ID_FIELD'))
			  ->configurePrimary(true)
			  ->configureAutocomplete(true),
			(new StringField('NAME',
							 [
								 'validation' => [__CLASS__, 'validateName']
							 ]
			))->configureTitle(Loc::getMessage('USERS_ENTITY_NAME_FIELD'))
			  ->configureRequired(true),
			(new StringField('PASSWORD_HASH',
							 [
								 'validation' => [__CLASS__, 'validatePasswordHash']
							 ]
			))->configureTitle(Loc::getMessage('USERS_ENTITY_PASSWORD_HASH_FIELD'))
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
			new LengthValidator(null, 64),
		];
	}

	/**
	 * Returns validators for PASSWORD_HASH field.
	 *
	 * @return array
	 */
	public static function validatePasswordHash()
	{
		return [
			new LengthValidator(null, 128),
		];
	}
}