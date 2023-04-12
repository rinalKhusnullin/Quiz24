window.addEventListener('load', function() {
	//Экранирование в js
	function escapeHtml(text) {
		var map = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#039;'
		};

		return text.replace(/[&<>"']/g, function(m) { return map[m]; });
	}

	//Отображение написанного вопроса
	let questionInput = document.getElementById('questionText');
	questionInput.addEventListener('input', function (){
		let questionPreview = document.getElementById('questionTextPreview');
		questionPreview.innerHTML = escapeHtml(questionInput.value);
	});

	//Отображение типа вопроса
	let questionTypeSelect = document.getElementById('questionType');
	questionTypeSelect.addEventListener('change', function (){
		let questionTypes = [];

		[...questionTypeSelect].forEach(function (questionType) {
			questionTypes.push(questionType.value);
		});
		let selectedQuestionType = questionTypeSelect.value;

		questionTypes.forEach(function (questionType) {
			let questionTypePreview = document.getElementById(questionType + 'Preview');
			if (selectedQuestionType + 'Preview' === questionTypePreview.id){
				questionTypePreview.classList.remove('hidden');
			}
			else{
				questionTypePreview.classList.add('hidden');
			}
		});
	});

	//Показ выбираемых опций для вопроса
	let questionType = document.getElementById('questionType');
	questionType.addEventListener('change', function (){
		let selectedValue = questionType.value;
		let selectableAnswers = document.getElementById('selectableAnswers');
		if (selectedValue === 'free'){
			selectableAnswers.classList.add('hidden')
		}
		else{
			selectableAnswers.classList.remove('hidden')
		}
	});

	//Отображение выбранной диаграммы
	let displayTypesSelect = document.getElementById('displayType');
	displayTypesSelect.addEventListener('change', function (){
		let displayTypesId = [];

		[...displayTypesSelect].forEach(function (displayType) {
			displayTypesId.push(displayType.value);
		});

		let selectedDisplayType = displayTypesSelect.value;

		displayTypesId.forEach(function (displayTypeId) {
			let displayTypePreview = document.getElementById(displayTypeId + 'Preview');
			if (selectedDisplayType + 'Preview' === displayTypePreview.id){
				displayTypePreview.classList.remove('hidden');
			}
			else{
				displayTypePreview.classList.add('hidden');
			}
		});
	});

	//Добавление выбираемых ответов
	let addAnswerButton = document.getElementById('addAnswerButton');
	addAnswerButton.addEventListener('click', function() {
		let answer = document.createElement('input');
		answer.type = 'text';
		answer.classList.add('question-settings__selectable-inputs');
		answer.classList.add('input');
		let answersList =  document.getElementById('answersContainer');
		answersList.appendChild(answer);
	});

	let answersContainer = document.getElementById('answersContainer');
	answersContainer.addEventListener('click', function(){
		// Считывать количество ответов -> рендерить их
		console.log(answersContainer.childElementCount);
	});
})