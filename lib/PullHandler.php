<?php
namespace Up\Quiz;

use Bitrix\Main\Localization\Loc;
use Bitrix\Pull\Event;
use Bitrix\Pull\Model\ChannelTable;

Loc::loadMessages(__FILE__);

class PullHandler
{
	public static function onGetDependentModule()
	{
		return [
			'MODULE_ID' => 'up.quiz',
			'USE' => ['PUBLIC_SECTION']
		];
	}

	public static function onGetDependentModuleEvents()
	{
		return [
			[
				'MODULE_ID' => 'up.quiz',
				'EVENT' => 'onMessageReceived',
				'CALLBACK' => ['\up.quiz\PullHandler', 'onMessageReceived']
			]
		];
	}

	public static function onMessageReceived(Event $event)
	{
		// Обработка полученного события
		$data = $event->getParameters();

		// Отправка ответного сообщения
		$channel = ChannelTable::getList([
			 'filter' => [
				 '=CHANNEL_TYPE' => 'private',
				 '=USER_ID' => $data['FROM_USER_ID'],
				 '=ENTITY_TYPE' => $data['ENTITY_TYPE'],
				 '=ENTITY_ID' => $data['ENTITY_ID']
			 ]
		 ])->fetch();

		if ($channel)
		{
			\Bitrix\Pull\PushTable::add([
				'APP_ID' => 1,
				'USER_ID' => $channel['USER_ID'],
				'DEVICE_TYPE' => \CPushManager::DEVICE_TYPE_ANDROID,
				'DEVICE_TOKEN' => $channel['DEVICE_TOKEN'],
				'MESSAGE' => 'Ответ на сообщение'
			]);
		}
	}
}