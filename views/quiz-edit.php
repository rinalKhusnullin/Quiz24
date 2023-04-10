<?php
  if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

  require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/header.php");

  $APPLICATION->SetTitle("QuizEdit");

  $APPLICATION->includeComponent('up:quiz.edit', '', []);

  require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/footer.php");
?>

