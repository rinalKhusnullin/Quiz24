<?php

return [
	'controllers' => [
		'value' => [
			'namespaces' => [
				'\\Up\\Quiz\\Controller' => 'api',
			],
			'defaultNamespace' => '\\Up\\Quiz\\Controller',
		],
		'readonly' => true,
	],
	'modules' => array(
		'push' => array(
			'class_name' => 'CPushManager',
			'modules' => array('pull'),
		),
	),
];