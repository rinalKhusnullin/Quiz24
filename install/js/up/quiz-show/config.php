<?
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true)
{
	die();
}

return [
	'css' => 'dist/quiz-show.bundle.css',
	'js' => 'dist/quiz-show.bundle.js',
	'rel' => [
		'main.core',
	],
	'skip_core' => false,
];