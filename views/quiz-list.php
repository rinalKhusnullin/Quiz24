<?php 
  if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

/**
 * @var CallMain|CMain $APPLICATION
 * @var CUser $USER
 */

  require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/header.php");

  $APPLICATION->SetTitle("Quiz");

  if ($USER->IsAuthorized())
	  $APPLICATION->includeComponent('up:quiz.list', '', []);
  else
	  $APPLICATION->includeComponent('up:quiz.not-auth', '', []);

  require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/footer.php");