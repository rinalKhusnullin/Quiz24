<?php
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

/**
 * @var CallMain|CMain $APPLICATION
 */

require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/header.php");

$APPLICATION->SetTitle("Registration");

$APPLICATION->includeComponent('up:quiz.registration', '', []);

require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/footer.php");