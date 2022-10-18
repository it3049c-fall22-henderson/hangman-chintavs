class Hangman {

  constructor(_canvas) {
    if (!_canvas) {
      throw new Error(`invalid canvas provided`);
    }

    this.canvas = _canvas;
    this.ctx = this.canvas.getContext(`2d`);
    this.word = ``;
    this.isOver = false;
    this.didWin = false;
    this.guesses = [];
    this.wrongGuesses = 0;
  }

  /**
   * This function takes a difficulty string as a parameter
   * would use the Fetch API to get a random word from the Hangman
   * To get an easy word: https://hangman-micro-service.herokuapp.com/?difficulty=easy
   * To get an medium word: https://hangman-micro-service.herokuapp.com/?difficulty=medium
   * To get an hard word: https://hangman-micro-service.herokuapp.com/?difficulty=hard
   * The results is a json object that looks like this:
   *    { word: "book" }
   * */
  getRandomWord(difficulty) {
    return fetch(
      `https://hangman-micro-service.herokuapp.com/?difficulty=${difficulty}`
    )
      .then((r) => r.json())
      .then((r) => r.word);
  }

  /**
   *
   * @param {string} difficulty a difficulty string to be passed to the getRandomWord Function
   * @param {function} next callback function to be called after a word is reveived from the API.
   */
  async start(difficulty, next) {
    // get word and set it to the class's this.word
    this.word = await this.getRandomWord(difficulty);
    console.log(this.word);
    // clear canvas
    this.clearCanvas();
    // draw base
    this.drawBase();
    // reset this.guesses to empty array
    this.guesses = [];
    // reset this.isOver to false
    this.isOver = false;
    // reset this.didWin to false
    this.didWin = false;

    next.call();
  }

  /**
   *
   * @param {string} letter the guessed letter.
   */
  guess(letter) {
    // Check if nothing was provided and throw an error if so
    if (letter === ``) {
      alert(`Error: No Input Provided`);
      throw new Error(`Error: No Input Provided`);
    } 
    // Check for invalid cases (numbers, symbols, ...) throw an error if it is
    else if (!/^[a-zA-Z]+$/.test(letter)) {
      alert(`Error: Non-alphabetic Character`);
      throw new Error(`Error: Non-alphabetic Character`);
    }
    // Check if more than one letter was provided. throw an error if it is.
    else if (letter.length >= 2) {
      alert(`Error: Provide only one letter`);
      throw new Error(`Error: Provide only one letter`);
    }
    else {
      // if it's a letter, convert it to lower case for consistency.
      letter = letter.toLowerCase();

      // check if this.guesses includes the letter. Throw an error if it has been guessed already.
      if (this.guesses.includes(letter)) {
        alert(`Warning: Letter has been Guessed`);
        throw new Error(`Warning: Letter has been Guessed`);
      }
      else {
        // add the new letter to the guesses array.
        this.guesses.push(letter);

        // check if the word includes the guessed letter:
        if (this.word.includes(letter)) {
          // if it's is call checkWin()
          this.checkWin();
        }
        else {
          // if it's not call onWrongGuess()
          this.onWrongGuess();
        }
      }
    }
  }

  checkWin() {
    let remainingLetters = this.word.length;
    
    // using the word and the guesses array, figure out how many remaining unknowns.
    for (let i = 0; i < this.word.length; i++) {
      for (let j = 0; j < this.guesses.length; j++) {
        if (this.guesses[j] === this.word.charAt(i)) {
          remainingLetters--;
          break;
        }
      }
    }
    
    // if zero, set both didWin, and isOver to true
    if (remainingLetters == 0) {
      this.didWin = true;
      this.isOver = true;
    }

  }

  /**
   * Based on the number of wrong guesses, this function would determine and call the appropriate drawing function
   * drawHead, drawBody, drawRightArm, drawLeftArm, drawRightLeg, or drawLeftLeg.
   * if the number wrong guesses is 6, then also set isOver to true and didWin to false.
   */
  onWrongGuess() {
    this.wrongGuesses++;

    switch (this.wrongGuesses) {
    case 1:
      this.drawHead();
      break;
    case 2:
      this.drawBody();
      break;
    case 3:
      this.drawRightArm();
      break;
    case 4:
      this.drawLeftArm();
      break;
    case 5:
      this.drawRightLeg();
      break;
    case 6:
      this.drawLeftLeg();
      this.isOver = true;
      this.didWin = false;
      break;
    }
  }

  /**
   * This function will return a string of the word placeholder
   * It will have underscores in the correct number and places of the unguessed letters.
   * i.e.: if the word is BOOK, and the letter O has been guessed, this would return _ O O _
   */
  getWordHolderText() {
    let wordHolderArray = [];

    for (let i = 0; i < this.word.length; i++) {
      wordHolderArray.push(`-`);
    }

    for (let i = 0; i < this.word.length; i++) {
      for (let j = 0; j < this.guesses.length; j++) {
        if (this.word.charAt(i) === this.guesses[j]) {
          wordHolderArray[i] = this.word.charAt(i);
        }
      }
    }

    return wordHolderArray.join(` `);
  }

  /**
   * This function returns a string of all the previous guesses, seperated by a comma
   * This would return something that looks like
   * (Guesses: A, B, C)
   * Hint: use the Array.prototype.join method.
   */
  getGuessesText() {
    return `Guesses: ` + this.guesses.join(`, `);
  }

  /**
   * Clears the canvas
   */
  clearCanvas() {
    return this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draws the hangman base
   */
  drawBase() {
    this.ctx.fillRect(95, 10, 150, 10); // Top
    this.ctx.fillRect(245, 10, 10, 50); // Noose
    this.ctx.fillRect(95, 10, 10, 400); // Main beam
    this.ctx.fillRect(10, 410, 175, 10); // Base
  }

  drawHead() {
    this.ctx.beginPath(); 
    this.ctx.arc(250,80,20,0,Math.PI*2,false); 
    this.ctx.closePath(); 
    this.ctx.stroke(); }

  drawBody() {this.ctx.moveTo(250,100); 
    this.ctx.lineTo(250,205); 
    this.ctx.stroke(); }

  drawLeftArm() {this.ctx.moveTo(250,120); 
    this.ctx.lineTo(210,135); 
    this.ctx.stroke(); }

  drawRightArm() {this.ctx.moveTo(250,120); 
    this.ctx.lineTo(290,135); 
    this.ctx.stroke(); }

  drawLeftLeg() {this.ctx.moveTo(250,205); 
    this.ctx.lineTo(215,240); 
    this.ctx.stroke(); }

  drawRightLeg() {this.ctx.moveTo(250,205); 
    this.ctx.lineTo(285,240); 
    this.ctx.stroke(); }
}
