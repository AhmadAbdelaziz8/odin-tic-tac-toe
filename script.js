const initializeGame = (function () {
  const xButton = document.querySelector(".X");
  const oButton = document.querySelector(".O");
  const buttonsContainer = document.querySelector(".choose");
  let playerSelection = "";

  function chooseLabel(label) {
    playerSelection = label;
    buttonsContainer.style.display = "none"; // Hide the buttons after selection
  }

  function getPlayerSelection() {
    return playerSelection;
  }

  xButton.addEventListener("click", () => chooseLabel("X"));
  oButton.addEventListener("click", () => chooseLabel("O"));

  return { chooseLabel, getPlayerSelection };
})();

const gameLogic = (function () {
  let board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  return { board, humanChoice, computerChoice };

  function humanChoice(row, col) {
    const choice = initializeGame.getPlayerSelection();
    if (board[row][col] === "") {
      board[row][col] = choice;
    }
  }

  function computerChoice() {
    const choice = initializeGame.getPlayerSelection() === "X" ? "O" : "X";
    let emptyCells = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === "") {
          emptyCells.push([i, j]);
        }
      }
    }
    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const [row, col] = emptyCells[randomIndex];
      board[row][col] = choice;
    }
  }
})();

const render = (function () {
  const boardContainer = document.querySelector(".gameboard");
  const resultContainer = document.querySelector(".result");
  const chooseContainer = document.querySelector(".choose");
  const resetButton = document.querySelector(".reset");

  function updateBoard() {
    boardContainer.innerHTML = "";
    gameLogic.board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellContainer = document.createElement("div");
        cellContainer.classList.add("cell");
        cellContainer.textContent = cell;
        cellContainer.dataset.row = rowIndex;
        cellContainer.dataset.col = colIndex;

        cellContainer.addEventListener("click", () => {
          // Check if player has chosen a label
          if (initializeGame.getPlayerSelection() === "") {
            return; // Don't allow move if no label chosen
          }

          if (cell === "" && !isGameOver()) {
            gameLogic.humanChoice(rowIndex, colIndex);
            updateBoard();
            if (!isGameOver()) {
              gameLogic.computerChoice();
              updateBoard();
            }
            if (isGameOver()) {
              displayResult();
            }
          }
        });
        boardContainer.appendChild(cellContainer);
      });
    });
  }

  function displayResult() {
    const winner = checkWinner();
    resultContainer.textContent = winner
      ? `Player ${winner} wins!`
      : "It's a tie!";
  }

  function checkWinner() {
    const board = gameLogic.board;
    for (let i = 0; i < 3; i++) {
      if (
        board[i][0] &&
        board[i][0] === board[i][1] &&
        board[i][0] === board[i][2]
      )
        return board[i][0];
      if (
        board[0][i] &&
        board[0][i] === board[1][i] &&
        board[0][i] === board[2][i]
      )
        return board[0][i];
    }
    if (
      board[0][0] &&
      board[0][0] === board[1][1] &&
      board[0][0] === board[2][2]
    )
      return board[0][0];
    if (
      board[0][2] &&
      board[0][2] === board[1][1] &&
      board[0][2] === board[2][0]
    )
      return board[0][2];
    return null;
  }

  function isGameOver() {
    return (
      checkWinner() ||
      gameLogic.board.every((row) => row.every((cell) => cell !== ""))
    );
  }

  resetButton.addEventListener("click", resetGame);

  function resetGame() {
    gameLogic.board = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
    initializeGame.chooseLabel(""); // Reset player selection
    chooseContainer.style.display = "flex"; // Show the choose container again
    resultContainer.textContent = "";
    // getPlayerSelection();
    updateBoard();
  }

  updateBoard();

  return { updateBoard, resetGame };
})();
