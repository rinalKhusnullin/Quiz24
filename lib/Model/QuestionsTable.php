<?php
namespace Up\Quiz\Model;

use Bitrix\Main\ArgumentException;
use Bitrix\Main\Localization\Loc,
	Bitrix\Main\ORM\Data\DataManager,
	Bitrix\Main\ORM\Fields\IntegerField,
	Bitrix\Main\ORM\Fields\StringField,
	Bitrix\Main\ORM\Fields\Validators\LengthValidator;
use Bitrix\Main\ORM\Fields\Relations\OneToMany;
use Bitrix\Main\ORM\Fields\Relations\Reference;
use Bitrix\Main\ORM\Query\Join;
use Bitrix\Main\SystemException;

Loc::loadMessages(__FILE__);

/**
 * Class QuestionsTable
 *
 * Fields:
 * <ul>
 * <li> ID int mandatory
 * <li> QUIZ_ID int mandatory
 * <li> QUESTION_TEXT string(256) optional
 * <li> CODE string(4) optional
 * <li> QUESTION_TYPE_ID int optional
 * <li> QUESTION_DISPLAY_ID int optional
 * <li> OPTIONS string(1000) optional
 * </ul>
 *
 * @package Bitrix\Quiz
 **/

class QuestionsTable extends DataManager
{
	/**
	 * Returns DB table name for entity.
	 *
	 * @return string
	 */
	public static function getTableName()
	{
		return 'up_quiz_questions';
	}

	/**
	 * Returns entity map definition.
	 *
	 * @return array
	 * @throws ArgumentException
	 * @throws SystemException
	 */
	public static function getMap()
	{
		return [
			(new IntegerField('ID',
							  []
			))->configureTitle(Loc::getMessage('QUESTIONS_ENTITY_ID_FIELD'))
			  ->configurePrimary(true),
			(new IntegerField('QUIZ_ID',
							  []
			))->configureTitle(Loc::getMessage('QUESTIONS_ENTITY_QUIZ_ID_FIELD'))
			  ->configureRequired(true),
			(new StringField('QUESTION_TEXT',
							 [
								 'validation' => [__CLASS__, 'validateQuestionText']
							 ]
			))->configureTitle(Loc::getMessage('QUESTIONS_ENTITY_QUESTION_TEXT_FIELD')),
			(new StringField('CODE',
							 [
								 'validation' => [__CLASS__, 'validateCode']
							 ]
			))->configureTitle(Loc::getMessage('QUESTIONS_ENTITY_CODE_FIELD')),
			(new IntegerField('QUESTION_TYPE_ID',
							  []
			))->configureTitle(Loc::getMessage('QUESTIONS_ENTITY_QUESTION_TYPE_ID_FIELD')),
			(new IntegerField('QUESTION_DISPLAY_ID',
							  []
			))->configureTitle(Loc::getMessage('QUESTIONS_ENTITY_QUESTION_DISPLAY_ID_FIELD')),
			(new StringField('OPTIONS',
							 [
								 'validation' => [__CLASS__, 'validateOptions']
							 ]
			))->configureTitle(Loc::getMessage('QUESTIONS_ENTITY_OPTIONS_FIELD')),

			(new Reference(
				'QUIZZES',
				QuizzesTable::class,
				Join::on('this.QUIZ_ID', 'ref.ID')
			))->configureJoinType('inner'),

			(new OneToMany('ANSWERS', AnswersTable::class, 'QUESTIONS'))->configureJoinType('inner'),
		];
	}

	/**
	 * Returns validators for QUESTION_TEXT field.
	 *
	 * @return array
	 */
	public static function validateQuestionText()
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

	/**
	 * Returns validators for OPTIONS field.
	 *
	 * @return array
	 */
	public static function validateOptions()
	{
		return [
			new LengthValidator(null, 1000),
		];
	}
}