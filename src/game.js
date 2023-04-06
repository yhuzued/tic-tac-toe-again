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
      return gameRecord[1].symbol;
    }

    return gameRecord[0].symbol;
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

// Player Object
function Player(name, symbol) {
  this.name = name;
  this.symbol = symbol;
  this.position = [];
}

// Main module
(function () {
  const table = document.querySelector("table");
  const player1 = new Player("Yusuf", "X");
  const player2 = new Player("Subastian", "O");

  board.add(player1);
  board.add(player2);

  // event listener
  table.addEventListener("click", (action) => {
    isValidClick(action);
  });

  function isValidClick(event) {
    const clickedCell = event.target;

    if (
      clickedCell.tagName !== "TD" ||
      clickedCell.textContent === "X" ||
      clickedCell.textContent === "O" ||
      board.checkWin()
    ) {
      return;
    }

    // check weather this is player one or two (if X player 1, O player 2)
    const latestSymbol = board.latestSymbol();
    const playerIndex = latestSymbol === "O" ? 0 : 1;
    const currentPlayer = board.gameRecord[playerIndex];

    currentPlayer.position.push(clickedCell.getAttribute("id"));
    clickedCell.textContent = board.latestSymbol();
  }
})();
