<?
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true)
{
	die();
}

return [
	'css' => 'dist/quiz-edit.bundle.css',
	'js' => 'dist/quiz-edit.bundle.js',
	'rel' => [
		'main.core',
	],
	'skip_core' => false,
];