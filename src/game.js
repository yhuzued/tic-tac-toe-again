// Player Object
function Player(name, symbol) {
  this.name = name;
  this.symbol = symbol;
  this.position = [];
}

// module reveal pattern for board
const board = (function () {
  const gameRecord = [];

  function add(player) {
    gameRecord.push(player);
  }

  function latestSymbol() {
    const player1 = gameRecord[0].position; // array
    const player2 = gameRecord[1].position; // array

    if (player1.length === player2.length) {
      return gameRecord[0].symbol;
    }

    return gameRecord[1].symbol;
  }

  function checkWin() {
    const player1 = gameRecord[0];
    const player2 = gameRecord[1];

    return (
      checkHorizontal(player1, player2) ||
      checkVertical(player1, player2) ||
      checkDiagonal(player1, player2)
    );
  }

  function checkLine(rows, player1, player2) {
    const counts = rows.map((row) => {
      const player1Count = row.filter((coordinate) =>
        player1.position.includes(coordinate)
      ).length;
      const player2Count = row.filter((coordinate) =>
        player2.position.includes(coordinate)
      ).length;
      return [player1Count, player2Count];
    });

    return counts.flat().includes(3);
  }

  function checkHorizontal(player1, player2) {
    const rows = [
      ["a1", "a2", "a3"],
      ["b1", "b2", "b3"],
      ["c1", "c2", "c3"],
    ];

    return checkLine(rows, player1, player2);
  }

  function checkVertical(player1, player2) {
    const rows = [
      ["a1", "b1", "c1"],
      ["a2", "b2", "c2"],
      ["a3", "b3", "c3"],
    ];

    return checkLine(rows, player1, player2);
  }

  function checkDiagonal(player1, player2) {
    const rows = [
      ["a1", "b2", "c3"],
      ["c1", "b2", "a3"],
    ];

    return checkLine(rows, player1, player2);
  }

  return { add, latestSymbol, checkWin, gameRecord };
})();

// display controller module
const display = (function () {
  function validClick(event) {
    const clickedCell = event.target;

    if (isInvalidClick(clickedCell)) {
      return;
    }

    const currentPlayer = latestPlayer();

    // Add coordinate to board and update display
    currentPlayer.position.push(clickedCell.getAttribute("id"));
    clickedCell.textContent = currentPlayer.symbol;
  }

  function latestPlayer() {
    return board.gameRecord[board.latestSymbol() === "O" ? 1 : 0];
  }

  function isInvalidClick(clickedCell) {
    const isNotTableCell = clickedCell.tagName !== "TD";
    const hasBeenSelected =
      clickedCell.textContent === "X" || clickedCell.textContent === "O";
    const gameIsOver = board.checkWin();
    return isNotTableCell || hasBeenSelected || gameIsOver;
  }

  function isDraw() {
    const player1 = board.gameRecord[0].position.length;
    const player2 = board.gameRecord[1].position.length;

    return player1 + player2 === 9 && !board.checkWin();
  }

  return { validClick, latestPlayer, isDraw };
})();

// Main module
(function () {
  const table = document.querySelector("table");
  const player1 = new Player("Player 1", "X");
  const player2 = new Player("Player 2", "O");
  const button = document.querySelector("button");
  const popup = document.getElementById("pop-up");

  board.add(player1);
  board.add(player2);

  // event listener
  table.addEventListener("click", (action) => {
    display.validClick(action);

    if (board.checkWin()) {
      showPopUp();
    }

    if (display.isDraw()) {
      showPopUp();
    }
  });

  button.addEventListener("click", () => {
    removePopUp();
  });

  // function
  function showPopUp() {
    popup.classList.remove("hidden");
    winnerOrDraw();
  }

  function removePopUp() {
    popup.classList.add("hidden");
    resetBoard();
  }

  function resetBoard() {
    board.gameRecord[0].position = [];
    board.gameRecord[1].position = [];
    document.querySelectorAll("td").forEach((td) => (td.innerHTML = ""));
  }

  function winnerOrDraw() {
    const player = display.latestPlayer().name;
    const winner =
      board.gameRecord[0].name === player
        ? board.gameRecord[1].name
        : board.gameRecord[0].name;

    if (display.isDraw()) {
      document.getElementById("winner").textContent = "The game is draw";
      return;
    }

    document.getElementById("winner").textContent = "The winner is " + winner;
  }
})();
