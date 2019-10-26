import {AllQuestionsStorage, UnansweredQuestionIndexesStorage} from './persistence.js';

chrome.runtime.onInstalled.addListener(async function() {
	await AllQuestionsStorage.removeAll();
	UnansweredQuestionIndexesStorage.removeAll();
});
