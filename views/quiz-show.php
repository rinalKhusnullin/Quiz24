<?php
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/header.php");

$APPLICATION->SetTitle("QuizShow");

$APPLICATION->includeComponent('up:quiz.show', '', []);

require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/footer.php");
?>