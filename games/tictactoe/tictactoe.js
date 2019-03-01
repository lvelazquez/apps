const SH1 = "O";
const SH2 = "X";
const PLAYER = SH1;
let COMPUTER = PLAYER != SH1 ? SH2 : SH1;

class GameStatus {
  static getHorizontal(grid) {
    for (let row = 0; row < 3; row++) {
      let current = grid[row][0];
      if (current != "") {
        if (current === grid[row][1] && current === grid[row][2]) {
          return [[row, 0], [row, 1], [row, 2]];
        }
      }
    }
    return null;
  }

  static getVertical(grid) {
    for (let col = 0; col < 3; col++) {
      let current = grid[0][col];
      if (current != "") {
        if (current === grid[1][col] && current === grid[2][col]) {
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

class TicTacToe {
  grid = [["", "", ""], ["", "", ""], ["", "", ""]];

  constructor() {
    this.playerCase = "player-1";
    this.initUI();
  }

  initUI() {
    this.mainContainer = document.createElement("main");
    this.mainContainer.setAttribute("class", "container");
    this.mainContainer.addEventListener("click", this.handleClick.bind(this));
    this.grid.forEach(row => {
      row.forEach(col => {
        const squareCase = document.createElement("div");
        squareCase.setAttribute("class", "square-case");
        this.mainContainer.appendChild(squareCase);
      });
    });

    document.body.appendChild(this.mainContainer);
  }

  handleClick(e) {
    const squareClass = e.target.getAttribute("class");
    if (squareClass === "square-case") {
      e.target.classList.add(this.playerCase);
      setTimeout();
    }
  }

  refresh() {}

  updateStatus(grid) {
    const winner = GameStatus.complete(grid);
    if (winner) {
      return `Winner is ${winner.winner}`;
    } else {
      if (GameStatus.isTie(grid)) {
        return "Game is Tied";
      } else {
        return "Game continue";
      }
    }
  }
}

const tictac = new TicTacToe();
