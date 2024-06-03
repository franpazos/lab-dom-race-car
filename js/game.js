class Game {
  constructor() {
    this.startScreen = document.getElementById("game-intro");
    this.gameScreen = document.getElementById("game-screen");
    this.gameEndScreen = document.getElementById("game-end");

    this.player = new Player(
      this.gameScreen,
      200,
      500,
      100,
      150,
      "./images/car.png"
    );

    this.gameScreenDimensions = {
      height: 600,
      width: 500,
    };

    this.obstacles = [];

    this.gameStats = {
      score: 0,
      lives: 3,
      gameIsOver: false,
    };

    this.gameIntervalId;
    this.gameLoopFrequency = Math.round(1000 / 60);
  }

  start() {
    this.gameScreen.style.height = `${this.gameScreenDimensions.height}px`;
    this.gameScreen.style.width = `${this.gameScreenDimensions.width}px`;
    this.startScreen.style.display = "none";
    this.gameScreen.style.display = "block";
    this.gameIntervalId = setInterval(() => {
      this.gameLoop();
    }, this.gameLoopFrequency);
  }

  gameLoop() {
    this.update();
    this.updateGameStats();

    if (this.gameStats.gameIsOver) {
      clearInterval(this.gameIntervalId);
    }
  }

  update() {
    this.player.move();

    for (let obstacle of this.obstacles) {
      obstacle.move();

      if (this.player.didCollide(obstacle)) {
        this.gameStats.lives--;
        obstacle.element.remove();
        this.obstacles.splice(this.obstacles.indexOf(obstacle), 1);
      } else if (obstacle.top > this.gameScreenDimensions.height) {
        this.gameStats.score++;
        console.log(`Your score now is: ${this.gameStats.score}`);
        obstacle.element.remove();
        this.obstacles.splice(this.obstacles.indexOf(obstacle), 1);
      }
    }

    if (this.gameStats.lives <= 0) {
      this.endGame();
    }

    if (Math.random() > 0.95 && this.obstacles.length < 1) {
      console.log("Creating new obstacle");
      this.obstacles.push(new Obstacle(this.gameScreen));
    }
  }

  updateGameStats() {
    document.getElementById("score").innerText = this.gameStats.score;
    document.getElementById("lives").innerText = this.gameStats.lives;
  }

  endGame() {
    console.log(`Game Over! Your score: ${this.gameStats.score}`);
    this.gameStats.gameIsOver = true;
    this.player.element.remove();
    this.gameScreen.style.display = "none";
    this.gameEndScreen.style.display = "block";
  }
}
