const PLAYER_ID = "player";
const COMPUTER_ID = "computer";
const PLAYER_CLASS_A = "player-color-a";
const PLAYER_CLASS_B = "player-color-b";

// TODO
// computer needs to be smarter
// add level of difficulty?
class TicTacToe {
  state = {
    gameGrid: [["", "", ""], ["", "", ""], ["", "", ""]],
    playerScore: 0,
    computerScore: 0,
    playerClass: ""
  };

  constructor() {
    this.playerClass = PLAYER_CLASS_A;
    this.computerClass = PLAYER_CLASS_B;
    this.mainContainer = document.getElementById("game-container");
    this.choosePlayerModal = document.getElementById("choose-player-modal");
    this.winnerModal = document.getElementById("winner-modal");
    this.score = document.getElementById("score");

    document.querySelector("#play-again-btn").addEventListener("click", () => {
      this.winnerModal.classList.add("hidden");
      this.reset();
    });

    this.choosePlayerList = document.querySelectorAll(
      ".modal .choose-player-list > li"
    );

    this.setup();
    this.reset();

    this.choosePlayerModal.classList.remove("hidden");
  }

  setup() {
    this.state.gameGrid.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        const tile = document.createElement("div");
        tile.setAttribute("class", "tile fade-color");
        tile.setAttribute("data-key", `${rowIndex},${colIndex}`);
        this.mainContainer.appendChild(tile);
      });
    });

    this.tileList = document.querySelectorAll(".tile");

    [...this.choosePlayerList].forEach(option => {
      option.addEventListener("click", e => this.handleInitClick(e.target));
    });
  }

  reset() {
    [...this.tileList].forEach(tile => {
      tile.classList.remove(this.playerClass);
      tile.classList.remove(this.computerClass);
      tile.removeEventListener("click", e => this.handleTileClick(e.target));
    });
    this.state.gameGrid = this.state.gameGrid.map(a => a.fill(""));
  }

  handleTileClick(target) {
    target.classList.add(this.playerClass);
    // is there a better way to do this? can we find the position in 2d grid by 0-9
    // 0 = 0 0, 0 1, 3 = 1, 0
    // colIndex = childIndex%3 + childIndex
    const pos = target.getAttribute("data-key").split(",");
    this.state.gameGrid[pos[0]][pos[1]] = PLAYER_ID;
    const gameStatus = this.updateStatus();
    if (!gameStatus) setTimeout(this.computerPlay.bind(this), 200);
  }

  handleInitClick(target) {
    this.playerClass = target.getAttribute("class");
    this.computerClass =
      this.playerClass === PLAYER_CLASS_A ? PLAYER_CLASS_B : PLAYER_CLASS_A;
    this.choosePlayerModal.classList.add("hidden");
    this.score.classList.remove("hidden");
    [...this.tileList].forEach(tile =>
      tile.addEventListener("click", e => this.handleTileClick(e.target))
    );
  }

  computerPlay() {
    const { gameGrid } = this.state;
    for (var i = 0; i < gameGrid.length; i++) {
      const colIndex = gameGrid[i].indexOf("");
      if (colIndex > -1) {
        gameGrid[i][colIndex] = COMPUTER_ID;
        this.updateStatus();
        document
          .querySelector(`.tile[data-key="${i},${colIndex}"]`)
          .classList.add(this.computerClass);
        break;
      }
    }
    this.updateStatus();
  }

  updateStatus() {
    const { gameGrid, playerScore, computerScore } = this.state;
    const playMoves = document.querySelectorAll(
      `#game-container .${this.playerClass}`
    ).length;
    if (playMoves < 3) return;
    const result = this.getStatus(gameGrid);
    if (result) {
      const winner = gameGrid[result[0][0]][result[0][1]];
      document.querySelector(".winner-text").innerHTML =
        winner === PLAYER_ID ? "You Win!" : "Computer Wins!";
      if (winner === PLAYER_ID) {
        this.state.playerScore = playerScore + 1;
        document.querySelector(
          `#score .${this.playerClass}`
        ).innerHTML = this.state.playerScore;
      } else {
        this.state.computerScore = computerScore + 1;
        document.querySelector(
          `#score .${this.computerClass}`
        ).innerHTML = this.state.computerScore;
      }
      this.winnerModal.classList.remove("hidden");
      return true;
    } else if (playMoves === 6 && this.isTie()) {
      document.querySelector(".winner-text").innerHTML = "Game is Tied!";
      this.winnerModal.classList.remove("hidden");
      return true;
    } else {
      return false;
    }
  }

  getStatus() {
    const { gameGrid } = this.state;
    const middle = gameGrid[1][1];
    if (middle !== "") {
      if (gameGrid[0][0] === middle && middle === gameGrid[2][2]) {
        return [[0, 0], [1, 1], [2, 2]];
      } else if (gameGrid[0][2] === middle && middle === gameGrid[2][0]) {
        return [[0, 2], [1, 1], [2, 0]];
      }
    }

    for (let i = 0; i < 3; i++) {
      let currentRow = gameGrid[i][0];
      if (currentRow != "") {
        if (currentRow === gameGrid[i][1] && currentRow === gameGrid[i][2]) {
          return [[i, 0], [i, 1], [i, 2]];
        }
      }
      let currentCol = gameGrid[0][i];
      if (currentCol != "") {
        if (currentCol === gameGrid[1][i] && currentCol === gameGrid[2][i]) {
          return [[0, i], [1, i + 1], [2, i + 2]];
        }
      }
    }

    return null;
  }

  isTie() {
    var tie = false;
    for (let i = 0; i < this.state.gameGrid.length; i++) {
      tie = this.state.gameGrid[i].every(sq => sq !== "");
      if (!tie) return false;
    }
    return tie;
  }
}

window.onload = function() {
  tictac = new TicTacToe();
};
