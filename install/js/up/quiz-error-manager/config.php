<?
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true)
{
	die();
}

return [
	'css' => 'dist/quiz-error-manager.bundle.css',
	'js' => 'dist/quiz-error-manager.bundle.js',
	'rel' => [
		'main.core',
	],
	'skip_core' => false,
];