<?php
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

/**
 * @var CMain $APPLICATION
 */
?>
<!DOCTYPE html>
<html lang=<?= LANGUAGE_ID; ?>>

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title> <?php $APPLICATION->ShowTitle(); ?></title>
    <?php $APPLICATION->ShowHead(); ?>
</head>

<body>
    <!-- HEADER -->
        <nav class="navbar mb-5" role="navigation" aria-label="main navigation">
            <div class="container">
            <div class="navbar-brand">
                <a class="navbar-item is-size-3 is-link navbar-brand__logo" href="/">
					<i class="fa-solid fa-q fa-lg"></i>
					<i class="fa-solid fa-u fa-2xs"></i>
					<i class="fa-solid fa-i fa-2xs"></i>
					<i class="fa-solid fa-z fa-2xs"></i>
                </a>
            </div>
			<div class="navbar-end">
				<div class="navbar-item">
					<div class="buttons">
						<a class="button is-primary" href="/login/">
							<strong>Войти</strong>
						</a>
						<a class="button is-light" href="/reg/">
							Регистрация
						</a>
					</div>
				</div>
			</div>
        </nav>
    <div class="wrapper">
    <section class="section is-medium px-0 pt-0 pb-0 main-content">
        <div class="container">
        <!-- MAIN CONTENT -->