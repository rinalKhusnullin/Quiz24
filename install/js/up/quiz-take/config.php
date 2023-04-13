<?
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true)
{
	die();
}

return [
	'css' => 'dist/quiz-take.bundle.css',
	'js' => 'dist/quiz-take.bundle.js',
	'rel' => [
		'main.core',
	],
	'skip_core' => false,
];