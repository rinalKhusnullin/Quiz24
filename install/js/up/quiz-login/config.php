<?
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true)
{
	die();
}

return [
	'css' => 'dist/quiz-login.bundle.css',
	'js' => 'dist/quiz-login.bundle.js',
	'rel' => [
		'main.core',
	],
	'skip_core' => false,
];