let correct_answers = [];

const getCategories = () => {
	fetch('https://opentdb.com/api_category.php')
		.then((response) => response.json())
		.then((data) => printCategories(data.trivia_categories))
}

const printCategories = data => {
	const categoriesContainer = document.getElementById('category');
	data.forEach(category => categoriesContainer.innerHTML += `<option value="${category.id}">${category.name}</option>`)
}

getCategories();

const getQuestions = () => {
	let questions = document.getElementById('number-questions').value;
	let category = document.getElementById('category').value;
	let difficulty = document.getElementById('difficulty').value;
	let type = document.getElementById('type').value;

	category = category === 'any' ? '' : `&category=${category}`;
	difficulty = difficulty === 'any' ? '' : `&difficulty=${difficulty}`;
	type = type === 'any' ? '' : `&type=${type}`;

	fetch(`https://opentdb.com/api.php?amount=${questions}${category}${difficulty}${type}`)
		.then((response) => response.json())
		.then((data) => printQuestions(data.results))
}

const printQuestions = data => {
	const container = document.getElementById('questions-container');
	const button = document.getElementById('questions-button');
	container.innerHTML = '';
	button.innerHTML = '';

	if (data.length === 0) {
		container.innerHTML = `<div class="col-md-6">
									<div class="alert alert-danger no-data">
										<div class="alert-body">
											Sorry... Could not return results 🤷‍♂️.
										</div>
									</div>
								</div>`;
		return;
	}
	let cont = 0;
	data.forEach(question => {
		let options = '';
		let answers = question.incorrect_answers;
		answers.push(question.correct_answer);
		correct_answers.push(question.correct_answer);
		answers.sort(() => Math.random() - 0.5 );
		answers.forEach(val => options += `<option value="${val}">${val}</option>`);
		container.innerHTML += `<div class="col-md-4 mt-4">
									<div class="card h-100">
										<div class="card-body">
											${question.question}
											<select name="" id="answers-${cont}" class='form-control' required >
											<option value="">---</option>
											${options}
											</select>
										</div>
									</div>
								</div>`;
		cont++;
	});
	button.innerHTML += '<div><button type="submit" class="btn btn-primary">Send Responses</button></div>';
}

const getResults = () => {
	const container = document.getElementById('questions-result');
	let corrects = 0;
	for (const i in correct_answers) {
		let value_answer = document.getElementById('answers-' + i).value;
		if (correct_answers[i] === value_answer) {
			corrects++;
		}
	}

	container.innerHTML = `<div class="col-md-6">
								<div class="alert alert-info no-data">
									<div class="alert-body">
										You have ${corrects} correct answers
									</div>
								</div>
							</div>`;
}