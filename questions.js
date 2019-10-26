import {AllQuestionsStorage, UnansweredQuestionIndexesStorage} from './persistence.js';
import {allTheQs} from './100q.js';

export async function pickRandomQ(listOfAnsIndexArr){
    let randomNum = Math.floor(Math.random()*listOfAnsIndexArr.length);
    let randomIndex = listOfAnsIndexArr[randomNum];
    let questions = await AllQuestionsStorage.get();
    let questionAnswerSet = questions[randomIndex];
    questionAnswerSet.index= randomIndex;
    return {remining:questions.length, question: questionAnswerSet};
};

export async function resetQuestions(){
    await AllQuestionsStorage.removeAll();
    UnansweredQuestionIndexesStorage.removeAll();
    await AllQuestionsStorage.set(allTheQs);
  };