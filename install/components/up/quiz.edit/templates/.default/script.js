window.addEventListener('load', function() {
	//Показ выбираемых опций для вопроса
	let questionType = document.getElementById('questionType');
	questionType.addEventListener('change', function (){
		let selectedValue = questionType.value;
		let selectableOptions = document.getElementById('selectableOptions');
		if (selectedValue === 'free'){
			selectableOptions.classList.add('hidden')
		}
		else{
			selectableOptions.classList.remove('hidden')
		}
	});

	let addOptionButton = document.getElementById('addOptionButton');
	addOptionButton.addEventListener('click', function() {
		let option = document.createElement('input');
		option.type = 'text';
		option.classList.add('question-settings__selectable-inputs');
		let optionList =  document.getElementById('selectableOptionsContainer');
		optionList.appendChild(option);
	});
})