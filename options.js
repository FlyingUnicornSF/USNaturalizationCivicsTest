import {allTheQs} from './100q.js';

let message = document.getElementById('message');
let resetButton = document.getElementById('reset');

resetButton.onclick = (event)=>{
  chrome.storage.local.clear(function() {
		var error = chrome.runtime.lastError;
		if (error) {
			console.error(error);
		} else {
			document.getElementById('message').innerText = "Good to re-start!";
		};
  });
  localStorage.removeItem('unanswered');
  chrome.storage.local.set({questions: allTheQs}, function() {
    var error = chrome.runtime.lastError;
    if(error){
      console.log(error);
      message.innterText = error;
    };
    console.log('questions are set');
  });
};
