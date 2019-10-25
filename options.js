import { resetQuestions } from './questions.js';

let resetButton = document.getElementById('reset');

window.onload = ()=>{
  let resetButton = document.getElementById('reset');
  resetButton.onclick = resetQuestions;
}