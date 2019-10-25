import {allTheQs} from './100q.js';

export function pickRandomQ(listOfAnsIndexArr){
    let randomNum = Math.floor(Math.random()*listOfAnsIndexArr.length);
    let randomIndex = listOfAnsIndexArr[randomNum];
    return new Promise((resolve) => {
        chrome.storage.local.get(['questions'], function(result) {
            if(result.questions !== undefined){
                let questionAnswerSet = result.questions[randomIndex];
                let output = questionAnswerSet;
                output.index= randomIndex;
                resolve({remining:result.questions.length, question: output});
            } else {
                alert("load questions!")
            };
        });
    });   
};

export function deleteQ(index){
    let indexStr = window.localStorage.getItem('unanswered');
    let removeIndexStr = ',' + index.toString()+',';
    if(!indexStr.includes(removeIndexStr)){
        removeIndexStr = index.toString()+',';
        if(!indexStr.includes(removeIndexStr)){
            removeIndexStr = ',' + index.toString();
        };
    };
    
    if(indexStr === removeIndexStr){
        localStorage.removeItem('unanswered');
    } else {
        let newString = indexStr.replace(removeIndexStr, ',');
        window.localStorage.setItem('unanswered', newString);
    }
};

export function resetQuestions(){
    chrome.storage.local.clear(function() {
      var error = chrome.runtime.lastError;
          if (error) {
            console.error(error);
          };
    });
    localStorage.removeItem('unanswered');
    chrome.storage.local.set({questions: allTheQs}, function() {
      var error = chrome.runtime.lastError;
      if(error){
        console.log(error);
      };
      alert('questions are set!');
    });
  };