<?php
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

/**
 * @var CallMain|CMain $APPLICATION
 * @var CUser $USER
 */

require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/header.php");

$APPLICATION->SetTitle("404");

$APPLICATION->includeComponent('up:quiz.404', '', []);

require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/footer.php");


