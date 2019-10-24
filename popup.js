import { pickRandomQ, deleteQ } from './questions.js';
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
	chrome.storage.local.get(['questions'], function(result) {
		notification.innerText = 'this works';
		if (!result.question || result.question.length === 0) {
			chrome.storage.local.set({ questions: allTheQs }, function() {
				var error = chrome.runtime.lastError;
				if (error) {
					console.log(error);
					message.innterText = error;
				}
				setUpIndex(allTheQs.length);
				// console.log('questions are set');
			});
		} else {
			setUpIndex(result.question.length);
		};
	});
};

window.onload = load;

function setUpIndex(numOfQuestions) {
	let listOfAnsIndexStr = '';
	let listOfAnsIndexArr = [];
	if (window.localStorage.getItem('unanswered')) {
		let listOfAnsIndexStr = window.localStorage.getItem('unanswered');
		listOfAnsIndexArr = listOfAnsIndexStr.split(',');
	} else {
		for (let i = 0; i < numOfQuestions; i += 1) {
			listOfAnsIndexStr = listOfAnsIndexStr + i.toString() + ',';
			listOfAnsIndexArr.push(i);
		};
		// make sure to get rid of the last ","
		// store string of indexes to localStorage
		window.localStorage.setItem('unanswered',listOfAnsIndexStr.slice(0, -1));
		// console.log(listOfAnsIndexArr)
	}
	loadNextQestion(listOfAnsIndexArr);
}

// event handlers
submit.onclick = function(event) {
	event.preventDefault();
	checkAnswer();
};

nextQ.onclick = function(event) {
	showAnswers.innerHTML = '';
	answerInContainer.innerHTML = '';
	let listOfAnsIndexStr = window.localStorage.getItem('unanswered');
	let listOfAnsIndexArr = listOfAnsIndexStr.split(',');
	loadNextQestion(listOfAnsIndexArr);
};

giveUp.onclick = function() {
	if (!answerArray) {
		alert(
			'You already answered that correctly. Move on to the next question.'
		);
	} else {
		showAnswers(answerArray);
	};
};

function showAnswers(answerArray) {
  displayAnswers.innerHTML = '';
	let answerWrapper = document.createElement('ul');
	answerArray.map(answer => {
		let newDiv = document.createElement('li');
		newDiv.innerText = answer;
		answerWrapper.appendChild(newDiv);
	});
	displayAnswers.appendChild(answerWrapper);
};

/**
 * - check input against answers
 * - call deleteQ function to delete correctly answered queston
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
		};
	};
	notification.innerText = 'Correct!';
	displayAnswers.innerHTML = '';
	deleteQ(questionIndex);
	showAnswers(answerArray);
	answerArray = undefined;
	answerSet = new Set();
	questionIndex = undefined;
};

async function loadNextQestion(listOfAnsIndexArr) {
	displayAnswers.innerHTML = '';
	// console.log(listOfAnsIndexArr)
	notification.innerText = '< Question >';
  let result = await pickRandomQ(listOfAnsIndexArr);
  console.log(result)
	// remaining.innerText = listOfAnsIndexArr.length;
	// let questionDisplay = document.getElementById('queston');
	// let answerQuestionSet = result.question;
	// // console.log(answerQuestionSet)
	// questionIndex = answerQuestionSet[0]; // reminder of questions in number
	// questionDisplay.innerText = answerQuestionSet[1]; // Question
	// answerArray = answerQuestionSet[2]; // first index is the number of answers it requires
	// let text = document.createElement('p');
	// text.innerText = '< Answer >';
	// answerInContainer.appendChild(text);
	// for (let i = 0; i < answerArray[0]; i += 1) {
	// 	let newDiv = document.createElement('input');
	// 	newDiv.type = 'text';
	// 	newDiv.className = 'answer-input';
	// 	answerInContainer.appendChild(newDiv);
	// };
	// answerArray.splice(0, 1);
	// answerSet = new Set();
	// for (let i = 0; i < answerArray.length; i += 1) {
	// 	// console.log(answerArray[i].toLowerCase());
	// 	answerSet.add(answerArray[i].toLowerCase());
	// };
};
