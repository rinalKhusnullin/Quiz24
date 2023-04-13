<?php
namespace Up\Quiz\Model;

use Bitrix\Main\ArgumentException;
use Bitrix\Main\Localization\Loc,
	Bitrix\Main\ORM\Data\DataManager,
	Bitrix\Main\ORM\Fields\IntegerField,
	Bitrix\Main\ORM\Fields\StringField,
	Bitrix\Main\ORM\Fields\Validators\LengthValidator;
use Bitrix\Main\ORM\Fields\Relations\Reference;
use Bitrix\Main\ORM\Query\Join;

Loc::loadMessages(__FILE__);

/**
 * Class AnswersTable
 *
 * Fields:
 * <ul>
 * <li> ID int mandatory
 * <li> QUESTION_ID int mandatory
 * <li> ANSWER string(128) optional
 * </ul>
 *
 * @package Bitrix\Quiz
 **/

class AnswersTable extends DataManager
{
	/**
	 * Returns DB table name for entity.
	 *
	 * @return string
	 */
	public static function getTableName()
	{
		return 'up_quiz_answers';
	}

	/**
	 * Returns entity map definition.
	 *
	 * @return array
	 * @throws ArgumentException
	 */
	public static function getMap()
	{
		return [
			(new IntegerField('ID',
							  []
			))->configureTitle(Loc::getMessage('ANSWERS_ENTITY_ID_FIELD'))
			  ->configurePrimary(true),
			(new IntegerField('QUESTION_ID',
							  []
			))->configureTitle(Loc::getMessage('ANSWERS_ENTITY_QUESTION_ID_FIELD'))
			  ->configureRequired(true),
			(new StringField('ANSWER',
							 [
								 'validation' => [__CLASS__, 'validateAnswer']
							 ]
			))->configureTitle(Loc::getMessage('ANSWERS_ENTITY_ANSWER_FIELD')),

			(new Reference(
				'QUESTIONS',
				QuestionsTable::class,
				Join::on('this.QUESTION_ID', 'ref.ID')
			))->configureJoinType('inner'),
		];
	}

	/**
	 * Returns validators for ANSWER field.
	 *
	 * @return array
	 */
	public static function validateAnswer()
	{
		return [
			new LengthValidator(null, 128),
		];
	}
}