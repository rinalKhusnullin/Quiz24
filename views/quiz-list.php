<?php 
  if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

  require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/header.php");

  $APPLICATION->SetTitle("Quiz");

  $APPLICATION->includeComponent('up:quiz.list', '', []);

  require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/footer.php"); 
?>