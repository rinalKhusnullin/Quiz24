<?
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true)
{
	die();
}

return [
	'css' => 'dist/quiz-registration.bundle.css',
	'js' => 'dist/quiz-registration.bundle.js',
	'rel' => [
		'main.core',
	],
	'skip_core' => false,
];