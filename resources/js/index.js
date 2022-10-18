// START + DIFFICULTY SELECTION
const startWrapper = document.getElementById(`startWrapper`);
const difficultySelectForm = document.getElementById(`difficultySelect`);
const difficultySelect = document.getElementById(`difficulty`);

// GAME
const gameWrapper = document.getElementById(`gameWrapper`);
const guessesText = document.getElementById(`guesses`);
const wordHolderText = document.getElementById(`wordHolder`);

// GUESSING FORM
const guessForm = document.getElementById(`guessForm`);
const guessInput = document.getElementById(`guessInput`);
const guessButton = document.getElementById(`guessSubmitButton`);

// GAME RESET BUTTON
const resetGame = document.getElementById(`resetGame`);

// CANVAS
let canvas = document.getElementById(`hangmanCanvas`);

// The following Try-Catch Block will catch the errors thrown
try {
  // Instantiate a game Object using the Hangman class.
  let game;
  
  // add a submit Event Listener for the to the difficultySelectionForm
  difficultySelectForm.addEventListener(`submit`, function (event) {
    event.preventDefault();
    // eslint-disable-next-line no-undef
    game = new Hangman(canvas);
    
    // get the difficulty input
    let difficulty = difficultySelect.options[difficultySelect.selectedIndex].value;
    
    //call the game start() method, the callback function should do the following
    game.start(difficulty, function setGame() {
      // hide the startWrapper
      startWrapper.classList.add(`hidden`);
      // show the gameWrapper
      gameWrapper.classList.remove(`hidden`);
      // enable input
      guessInput.disabled = false;
      // enable button
      guessButton.disabled = false;
      // call the game getWordHolderText and set it to the wordHolderText
      wordHolderText.innerHTML = game.getWordHolderText();
      // call the game getGuessessText and set it to the guessesText
      guessesText.innerHTML = game.getGuessesText();
    });
  });

  // add a submit Event Listener to the guessForm
  guessForm.addEventListener(`submit`, function (e) {
    e.preventDefault();
    // get the guess input
    let input = guessInput.value;
    // call the game guess() method
    game.guess(input);
    // set the wordHolderText to the game.getHolderText
    wordHolderText.innerHTML = game.getWordHolderText();
    // set the guessesText to the game.getGuessesText
    guessesText.innerHTML = game.getGuessesText();
    // clear the guess input field
    guessInput.value = ``;
    // Given the Guess Function calls either the checkWin or the onWrongGuess methods
    // the value of the isOver and didWin would change after calling the guess() function.
    // Check if the game isOver:
    if (game.isOver) {
      // 1. disable the guessInput
      guessInput.disabled = true;
      // 2. disable the guessButton
      guessButton.disabled = true;
      // 3. show the resetGame button
      resetGame.classList.remove(`hidden`);
      resetGame.classList.add(`btn`);

      // if the game is won or lost, show an alert.
      if (game.didWin) {
        alert(`You won`);
      }
      else
      {
        alert(`You Lost - Word was: ` + game.word);
      }
    }
  });

  // add a click Event Listener to the resetGame button
  resetGame.addEventListener(`click`, function (e) {
    e.preventDefault();
    // show the startWrapper
    startWrapper.classList.remove(`hidden`);
    // hide the gameWrapper
    gameWrapper.classList.add(`hidden`);
    // hide reset button
    resetGame.classList.remove(`btn`);
    resetGame.classList.add(`hidden`);
  });
} catch (error) {
  console.error(error);
  alert(error);
}
