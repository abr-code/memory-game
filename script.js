//Imports
let overlayTexts = Array.from(document.getElementsByClassName("overlay-text"));
let cards = Array.from(document.getElementsByClassName("card"));

overlayTexts.forEach((overlayText) => {
  overlayText.addEventListener("click", () => {
    overlayText.classList.remove("visible");
    MixOrMatch.startGame();
  });
});

cards.forEach((card) => {
  card.addEventListener("click", () => {
    MixOrMatch.flip(card);
  });
});

class AudioControler {
  constructor() {
    this.bgMusic = new Audio("./assets/Audio/infected-vives.mp3");
    this.flipSound = new Audio("./assets/Audio/flip.wav");
    this.gameOverSound = new Audio("./assets/Audio/gameOver.wav");
    this.victorySound = new Audio("./assets/Audio/victory.wav");
    this.matchSound = new Audio("./assets/Audio/match.wav");
    this.bgMusic.volume = 0.5;
    this.bgMusic.loop = true;
  }
  playMusic() {
    this.bgMusic.play();
  }
  stopMusic() {
    this.bgMusic.pause();
    this.bgMusic.currentTime = 0;
  }
  flip() {
    this.flipSound.play();
  }
  match() {
    this.matchSound.play();
  }
  gameOver() {
    this.gameOverSound.play();
  }
  victory() {
    this.victorySound.play();
  }
}

class GameControler {
  constructor(totalTime, cards) {
    this.cards = cards;
    this.totalTime = totalTime;
    this.timeRemaining = totalTime;
    this.flips = document.getElementById("game-flips");
    this.flipNumber = 0;
    this.cardToCompare = null;
    this.busy = false;
    this.matchedCards = [];
    this.timer = document.getElementById("game-time");
    this.timer.textContent = totalTime;
    this.audiocontroler = new AudioControler();
    this.countdown;
  }

  startGame() {
    this.shuffle(this.cards);
    setTimeout(() => {
      this.flipBackAll();
      this.countdown = this.startCountdown();
      this.audiocontroler.playMusic();
    }, 500);
  }
  startCountdown() {
    return setInterval(() => {
      this.timeRemaining -= 1;
      this.timer.textContent = this.timeRemaining;
      if (this.timeRemaining <= 0) {
        this.gameOver();
      }
    }, 1000);
  }
  flip(card) {
    if (this.canFlipcard(card)) {
      this.audiocontroler.flip();
      this.flips.textContent = this.flipNumber += 1;
      card.classList.add("visible");

      if (this.cardToCompare) {
        if (this.isMatch(this.cardToCompare, card))
          this.match(this.cardToCompare, card);
        else this.flipBack(this.cardToCompare, card);

        this.cardToCompare = null;
      } else {
        this.cardToCompare = card;
      }
    }
  }
  flipBack(card1, card2) {
    this.busy = true;
    setTimeout(() => {
      card1.classList.remove("visible");
      card2.classList.remove("visible");
      this.busy = false;
    }, 1000);
  }
  flipBackAll() {
    this.busy = true;
    this.cards.forEach((card) => {
      card.classList.remove("visible");
      this.removeMatchedAnimation(card);
    });
    this.busy = false;
  }
  isMatch(card1, card2) {
    return (
      card1.getElementsByClassName("card-figure")[0].src ===
      card2.getElementsByClassName("card-figure")[0].src
    );
  }
  match(card1, card2) {
    this.matchedCards.push(card1);
    this.matchedCards.push(card2);
    this.audiocontroler.match();

    card1.classList.add("matched");
    card2.classList.add("matched");
    if (this.matchedCards.length === this.cards.length) {
      this.victory();
    }
  }
  removeMatchedAnimation(card) {
    card.classList.remove("matched");
  }
  shuffle(cardsArray) {
    for (let i = cardsArray.length - 1; i > 0; i--) {
      let randIndex = Math.floor(Math.random() * (i + 1));
      cardsArray[randIndex].style.order = i;
      cardsArray[i].style.order = randIndex;
    }
  }

  canFlipcard(card) {
    return (
      !this.busy &&
      !this.matchedCards.includes(card) &&
      this.cardToCompare !== card
    );
  }
  victory() {
    let victoryTittle = document.getElementById("game-victory-text");
    victoryTittle.classList.add("visible");
    this.audiocontroler.victory();
    this.restart();
  }
  restart() {
    this.timeRemaining = this.totalTime;
    this.timer.textContent = this.totalTime;
    this.flipNumber = 0;
    this.matchedCards = [];
    this.flips.textContent = this.flipNumber;
    this.cardToCompare = null;
    this.audiocontroler.stopMusic();
    //stop countdown
    clearInterval(this.countdown);
  }
  gameOver() {
    let victoryTittle = document.getElementById("game-over-text");
    victoryTittle.classList.add("visible");
    this.audiocontroler.gameOver();
    this.restart();
  }
}

let MixOrMatch = new GameControler(100, cards);

//startGame();

/* let audiocontroler = new AudioControler();
let MixOrMatch = new GameControler(100, cards);
 */
