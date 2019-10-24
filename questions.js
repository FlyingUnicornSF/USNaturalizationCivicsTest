export function pickRandomQ(listOfAnsIndexArr){
    let randomNum = Math.floor(Math.random()*listOfAnsIndexArr.length);
    let randomIndex = listOfAnsIndexArr[randomNum];
    return new Promise((resolve) => {
        chrome.storage.local.get(['questions'], function(result) {
            if(result.questions !== undefined){
                let output = [];
                let questionAnswerSet = result.questions[randomIndex];
                output.push(randomIndex);
                output.push(Object.keys(questionAnswerSet)[0]);
                output.push(Object.values(questionAnswerSet)[0]);
                console.log(output)
                resolve({remining:result.questions.length, question: output});
            } else {
                alert("load questions!")
            };
        });
    });   
};

export function deleteQ(index){
    let indexStr = window.localStorage.getItem('unanswered');
    // alert(index.toString()+',');
    let removeIndexStr = ',' + index.toString()+',';
    let newString = indexStr.replace(removeIndexStr, ',');
    window.localStorage.setItem('unanswered', newString);
};