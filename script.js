const initializeGame = (function () {
  const xButton = document.querySelector(".X");
  const oButton = document.querySelector(".O");
  const buttonsContainer = document.querySelector(".choose");
  let playerSelection = "";

  function chooseLabel(label) {
    // console.log(gameLogic.board);
    playerSelection = label; // Update the playerSelection
    if (label) {
      buttonsContainer.style.display = "none"; // Hide buttons after selection
    }
  }

  function getPlayerSelection() {
    return playerSelection;
  }

  xButton.addEventListener("click", () => chooseLabel("X"));
  oButton.addEventListener("click", () => chooseLabel("O"));

  return { chooseLabel, getPlayerSelection };
})();

const gameLogic = (function () {
  // initial game board
  let board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  return { board, humanChoice, computerChoice };

  // set the Human choice function
  function humanChoice(row, col) {
    let choice = initializeGame.getPlayerSelection();
    // if (board[row][col] === "") {
    board[row][col] = choice;
    console.log(board);
    // }
  }

  // generate a Random Computer choice
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

// create Module concerned with rendering the board
const render = (function () {
  // get the HTML buttons and container
  let boardContainer = document.querySelector(".gameboard");
  let resultContainer = document.querySelector(".result");
  let chooseContainer = document.querySelector(".choose");
  let resetButton = document.querySelector(".reset");

  function updateBoard() {
    boardContainer.innerHTML = "";
    gameLogic.board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        let cellContainer = document.createElement("div");
        cellContainer.classList.add("cell");
        cellContainer.textContent = cell;
        cellContainer.dataset.row = rowIndex;
        cellContainer.dataset.col = colIndex;

        cellContainer.addEventListener("click", () => {
          let selection = initializeGame.getPlayerSelection();
          if (selection === "") {
            alert("Please choose X or O to start!");
            return;
          }

          // Always check the latest state of the board
          if (gameLogic.board[rowIndex][colIndex] === "" && !isGameOver()) {
            gameLogic.humanChoice(rowIndex, colIndex); // Update the board
            updateBoard();

            if (!isGameOver()) {
              gameLogic.computerChoice(); // Computer makes a move
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
    chooseContainer.style.display = "flex"; // Show the selection buttons again
    resultContainer.textContent = ""; // Clear the result text

    // Remove existing event listeners
    let cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.removeEventListener("click", () => {});
      console.log("Event listener removed from cell:", cell);
    });

    gameLogic.board.forEach((row) => {
      row.forEach((cell) => {
        cell = "";
      });
    });

    // updateBoard();
  }

  updateBoard();

  return { updateBoard, resetGame };
})();
