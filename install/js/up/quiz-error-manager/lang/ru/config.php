<?php
// Quiz Controller
$MESS['UP_QUIZ_ERROR_EMPTY_QUIZ_TITLE'] = 'Название опроса не может быть пустым';
$MESS['UP_QUIZ_ERROR_EXCEEDING_QUIZ_TITLE'] = 'Название опроса не может превышать 256 символов';
$MESS['UP_QUIZ_ERROR_UNAUTHORIZED_USER'] = 'Вы должны быть авторизованы';
$MESS['UP_QUIZ_ERROR_MAX_COUNT_QUIZZES'] = 'Максимальное количество опросов : 11. Купите premium и забудьте об ограничениях!!!!';
$MESS['UP_QUIZ_ERROR_INVALID_QUIZ_CODE'] = 'Длина кода опроса должны быть равна 4 символам';
$MESS['UP_QUIZ_ERROR_INVALID_QUIZ_ID'] = 'ID Опроса должен быть целым числом больше 0';
$MESS['UP_QUIZ_ERROR_INVALID_QUIZ_STATE'] = "Состояния опроса должны быть : 'all' | 'active' | 'notActive'";
$MESS['UP_QUIZ_ERROR_QUIZ_NOT_FOUND'] = 'Опрос не найден';

// Question Controller
$MESS['UP_QUIZ_ERROR_EMPTY_QUESTION'] = 'Вопрос пустой либо равен null';
$MESS['UP_QUIZ_ERROR_EMPTY_QUESTION_TEXT'] = 'Текст вопроса не может быть пустым';
$MESS['UP_QUIZ_ERROR_EXCEEDING_QUESTION_TEXT'] = 'Длина вопроса не может быть больше 256';
$MESS['UP_QUIZ_ERROR_INVALID_QUESTION_ID'] = 'Неверный ID Вопроса';
$MESS['UP_QUIZ_ERROR_INVALID_QUESTION_TYPE_ID'] = 'Неверное значение для типа вопроса';
$MESS['UP_QUIZ_ERROR_INVALID_DISPLAY_TYPE_ID'] = 'Неверное значение для типа отображения результатов вопроса';
$MESS['UP_QUIZ_ERROR_PARSE_OPTIONS'] = 'Ошибка парсинга вариантов ответа';
$MESS['UP_QUIZ_ERROR_MAX_COUNT_OPTIONS'] = 'Максимальное количество вариантов ответа - 20';
$MESS['UP_QUIZ_ERROR_EMPTY_OPTIONS'] = 'В вопросе с несколькими вариантами ответов должен быть хотя бы один вариант ответа';
$MESS['UP_QUIZ_ERROR_EMPTY_OPTION'] = 'Варианты ответа не могут быть пустыми';
$MESS['UP_QUIZ_ERROR_EXCEEDING_OPTION'] = 'Варианты ответа не могут превышать 40 символов';
$MESS['UP_QUIZ_ERROR_QUESTION_NOT_FOUND'] = 'Вопрос не найден';
$MESS['UP_QUIZ_ERROR_MAX_COUNT_QUESTIONS'] = 'Опрос не может иметь больше 20 вопросов';

// Answer Controller
$MESS['UP_QUIZ_ERROR_EMPTY_ANSWER'] = 'Ответ не должен быть пустым';
$MESS['UP_QUIZ_ERROR_EXCEEDING_ANSWER'] = 'Длина ответа не может превышать 128 символов';