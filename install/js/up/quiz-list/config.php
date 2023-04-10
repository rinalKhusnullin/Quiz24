<?
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true)
{
	die();
}

return [
	'css' => 'dist/quiz-list.bundle.css',
	'js' => 'dist/quiz-list.bundle.js',
	'rel' => [
		'main.core',
	],
	'skip_core' => false,
];