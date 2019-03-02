const SH1 = "player";
const SH2 = "computer";
const PLAYER = SH1;
const COMPUTER = PLAYER === SH1 ? SH2 : SH1;

class GameStatus {
  // consolidate into one
  static getHorizontal(grid) {
    for (let row = 0; row < 3; row++) {
      let currentRow = grid[row][0];
      if (currentRow != "") {
        if (currentRow === grid[row][1] && currentRow === grid[row][2]) {
          return [[row, 0], [row, 1], [row, 2]];
        }
      }
    }
    return null;
  }

  static getVertical(grid) {
    for (let col = 0; col < 3; col++) {
      let currentCol = grid[0][col];
      if (currentCol != "") {
        if (currentCol === grid[1][col] && currentCol === grid[2][col]) {
          return [[0, col], [1, col + 1], [2, col + 2]];
        }
      }
    }
    return null;
  }

  static getDiagonal(grid) {
    const middle = grid[1][1];
    if (middle !== "") {
      if (grid[0][0] === middle && middle === grid[2][2]) {
        return [[0, 0], [1, 1], [2, 2]];
      } else if (grid[0][2] === middle && middle === grid[2][0]) {
        return [[0, 2], [1, 1], [2, 0]];
      } else {
        return null;
      }
    }
    return null;
  }

  static isTie(grid) {
    var tie = false;
    for (let i = 0; i < grid.length; i++) {
      tie = grid[i].every(sq => sq !== "");
      if (!tie) {
        return false;
      }
    }
    return tie;
  }

  // this can just return one type
  static complete(grid) {
    const horizontal = this.getHorizontal(grid);
    if (horizontal) {
      return {
        winner: grid[horizontal[0][0]][horizontal[0][1]],
        combo: horizontal
      };
    }
    const vertical = this.getVertical(grid);
    if (vertical) {
      return { winner: grid[vertical[0][0]][vertical[0][1]], combo: vertical };
    }
    const diagonal = this.getDiagonal(grid);
    if (diagonal) {
      return { winner: grid[diagonal[0][0]][diagonal[0][1]], combo: diagonal };
    }
  }
}
// keeps game score on localStorage
// choose different
// game config, keeps score in localStorage
// score and time
class TicTacToe {
  state = {
    gameGrid: [["", "", ""], ["", "", ""], ["", "", ""]],
    playerClassA: "player-color-a",
    playerClassB: "player-color-b",
    playerClass: ""
  };

  // jquery selector decorator for document.querySelector $ use regexp to ^.#.test(selector) or createElement?

  constructor() {
    const { gameGrid, playerClassA, playerClassB } = this.state;
    this.playerId = playerClassA;
    this.computerId = playerClassB;

    this.mainContainer = document.getElementById("game-container");
    this.choosePlayerModal = document.getElementById("choose-player-modal");
    this.winnerModal = document.getElementById("winner-modal");

    gameGrid.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        const squareCase = document.createElement("div");
        squareCase.setAttribute("class", "square-case");
        squareCase.setAttribute("data-key", `${rowIndex},${colIndex}`);
        this.mainContainer.appendChild(squareCase);
      });
    });

    this.mainContainer.addEventListener("click", this.handleClick.bind(this));
    this.initGame();
  }

  // TODO add level of difficulty?
  // game starts, timer starts while player is playing
  initGame() {
    this.choosePlayerList = document.querySelectorAll(
      ".modal .choose-player-list > li"
    );
    Array.from(this.choosePlayerList).forEach(option => {
      option.addEventListener("click", e => {
        e.preventDefault();
        this.playerId = e.target.getAttribute("class");
        this.computerId =
          this.playerId === this.state.playerClassA
            ? this.state.playerClassB
            : this.state.playerClassA;
        this.choosePlayerModal.classList.add("hidden");
      });
    });
    this.choosePlayerModal.classList.remove("hidden");
  }

  handleClick(e) {
    const target = e.target;
    const squareClass = target.getAttribute("class");
    const { gameGrid } = this.state;

    if (squareClass === "square-case") {
      target.classList.add(this.playerId);
      // might be able to fix this with querySelectorAll
      const pos = target.getAttribute("data-key").split(",");
      gameGrid[pos[0]][pos[1]] = PLAYER;

      const gameStatus = this.updateStatus(gameGrid);
      if (!gameStatus) {
        setTimeout(this.computerPlay.bind(this), 200);
      } else {
        console.log(gameStatus);
      }
    }
  }

  // needs to be smarter
  computerPlay() {
    const { gameGrid } = this.state;
    for (var i = 0; i < gameGrid.length; i++) {
      const colIndex = gameGrid[i].indexOf("");
      if (colIndex > -1) {
        gameGrid[i][colIndex] = COMPUTER;
        const gameStatus = this.updateStatus(gameGrid);
        document
          .querySelector(`.square-case[data-key="${i},${colIndex}"]`)
          .classList.add(this.computerId);

        break;
      }
    }
    this.updateStatus(gameGrid);
  }

  updateStatus(grid) {
    const winner = GameStatus.complete(grid);
    if (winner) {
      return `Winner is ${winner.winner}`;
    } else {
      if (GameStatus.isTie(grid)) {
        return "Game is Tied";
      } else {
        return false;
      }
    }
  }
}

window.onload = function() {
  tictac = new TicTacToe();
};
