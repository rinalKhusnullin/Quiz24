<?
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true)
{
	die();
}

return [
	'css' => 'dist/quiz-start.bundle.css',
	'js' => 'dist/quiz-start.bundle.js',
	'rel' => [
		'main.core',
	],
	'skip_core' => false,
];