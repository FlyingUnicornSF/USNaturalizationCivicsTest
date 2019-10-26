import {AllQuestionsStorage, UnansweredQuestionIndexesStorage} from './persistence.js';
import { pickRandomQ, resetQuestions } from './questions.js';
import { allTheQs } from './100q.js';

const submit = document.getElementById('submit');
const nextQ = document.getElementById('next-q');
const answerInContainer = document.getElementById('answer-input-container');
const answerInputs = document.getElementsByClassName('answer-input');
const notification = document.getElementById('notification');
const giveUp = document.getElementById('give-up');
const displayAnswers = document.getElementById('display-answers');
const remaining = document.getElementById('remaining');

let answerArray;
let answerSet;
let questionIndex;

async function load() {
	// check if there is any questions are
	// if not, load all of the questions to the storage
	let questions = await AllQuestionsStorage.get();
	if (questions.length === 0) {
		await AllQuestionsStorage.set(allTheQs);
		setUpIndex(allTheQs.length);
	}
}

window.onload = load;

/**
 * generate a string which consists all of the index of questions
 * and store in UnansweredQuestionIndexesStorage
 * this function is a part of window.load
 * when setup is complete, loads the first question
 * @param {number} numOfQuestions
 */
function setUpIndex(numOfQuestions) {
	let listOfAnsIndexArr = UnansweredQuestionIndexesStorage.get();
	if (listOfAnsIndexArr.length === 0) {
		listOfAnsIndexArr = new Array(numOfQuestions);
		for (let i = 0; i < numOfQuestions; i += 1) {
			listOfAnsIndexArr.push(i);
		}
		UnansweredQuestionIndexesStorage.set(listOfAnsIndexArr);
	}
	loadNextQestion(listOfAnsIndexArr);
}

// event handlers
submit.onclick = function(event) {
	event.preventDefault();
	checkAnswer();
};
/**
 *  - clear the answer field
 * - clear the answer input field
 * - retrieve answer index string from window local storage
 * - and convert to an array
 * - call loadNextQustions
 */
nextQ.onclick = function(event) {
	showAnswers.innerHTML = '';
	answerInContainer.innerHTML = '';
	let listOfAnsIndexArr = UnansweredQuestionIndexesStorage.get();
	loadNextQestion(listOfAnsIndexArr);
};

giveUp.onclick = function() {
	if (!answerArray) {
		alert(
			'You already answered that correctly. Move on to the next question.'
		);
	} else {
		showAnswers(answerArray);
	}
};

function allDone() {
	answerInContainer.innerHTML = '';
	displayAnswers.innerHTML = '';
	let reloadButton = document.createElement('button');
	reloadButton.classList = 'pretty-button';
	let closeButton = reloadButton.cloneNode();
	reloadButton.innerText = 'Reset questions';
	reloadButton.onclick = resetQuestions;
	closeButton.innerText = 'Close';
	closeButton.onclick = () => {
		window.close();
	};
	let congrats = document.createElement('h3');
	congrats.innerText = "Congratulations! You're all done!";
	answerInContainer.appendChild(congrats);
	answerInContainer.appendChild(reloadButton);
	answerInContainer.appendChild(closeButton);
	let buttons = document.getElementById('button-group');
	buttons.setAttribute('hidden', '');
}

/**
 * populates answer field
 * @param {Array<string>} answerArray
 */
function showAnswers(answerArray) {
	displayAnswers.innerHTML = '';
	let answerWrapper = document.createElement('ul');
	answerArray.map(answer => {
		let newDiv = document.createElement('li');
		newDiv.innerText = answer;
		answerWrapper.appendChild(newDiv);
	});
	displayAnswers.appendChild(answerWrapper);
}

/**
 * - check input against answers
 * - show the entire set of correct answers
 * - reset the answer set, answer array, and question index
 */
function checkAnswer() {
	// console.log(answerInputs);
	for (let i = 0; i < answerInputs.length; i += 1) {
		let input = answerInputs[i].value.trim().toLowerCase();
		if (!answerSet.has(input)) {
			console.log('oh no!');
			notification.innerText = 'try again';
			return;
		}
	}
	notification.innerText = 'Correct!';
	displayAnswers.innerHTML = '';
    UnansweredQuestionIndexesStorage.remove(questionIndex);
	showAnswers(answerArray);
	let foo = UnansweredQuestionIndexesStorage.get();
	if (foo.length === 0) {
		allDone();
	}
	answerArray = undefined;
	answerSet = new Set();
	questionIndex = undefined;
}

async function loadNextQestion(listOfAnsIndexArr) {
	// clear answers
	displayAnswers.innerHTML = '';
	// change notifcation to questio
	notification.innerText = '< Question >';
	// pick a ramdom question
	let result = await pickRandomQ(listOfAnsIndexArr);
	// save which question was asked in index
	questionIndex = result.question.index;
	// update reminder # of questions
	remaining.innerText = listOfAnsIndexArr.length;
	// display question
	let questionDisplay = document.getElementById('queston');
	questionDisplay.innerText = result.question.question;
	// save answers
	answerArray = result.question.answers;
	// populate input fields
	let text = document.createElement('p');
	text.innerText = '< Answer >';
	answerInContainer.appendChild(text);
	for (let i = 0; i < result.question.answerInputCount; i += 1) {
		let newDiv = document.createElement('input');
		newDiv.type = 'text';
		newDiv.className = 'answer-input';
		answerInContainer.appendChild(newDiv);
	}
	// save answer in a set for checking answers
	answerSet = new Set();
	for (let i = 0; i < answerArray.length; i += 1) {
		answerSet.add(answerArray[i].toLowerCase());
	}
}
