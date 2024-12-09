document.addEventListener("DOMContentLoaded", () => {
  const boardContainer = document.querySelector(".gameboard");
  const resultContainer = document.querySelector(".result");
  const resetButton = document.querySelector(".reset");
  const chooseButtons = document.querySelectorAll(".choose button");

  let board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  let currentPlayer = "";
  let gameOver = false;

  // Initialize game
  function initializeGame() {
    // Set event listeners for "X" and "O" buttons
    chooseButtons.forEach((button) => {
      button.addEventListener("click", () => {
        currentPlayer = button.textContent;
        document.querySelector(".choose").style.display = "none"; // Hide choice buttons
        renderBoard();
      });
    });

    // Reset button listener
    resetButton.addEventListener("click", resetGame);

    renderBoard();
  }

  // Render the board
  function renderBoard() {
    boardContainer.innerHTML = ""; // Clear previous board
    
    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellElement = document.createElement("div");
        cellElement.classList.add("cell");
        cellElement.textContent = cell;
        cellElement.dataset.row = rowIndex;
        cellElement.dataset.col = colIndex;

        // Add click event for empty cells
        cellElement.addEventListener("click", () => {
          if (!gameOver && cell === "") {
            makeMove(rowIndex, colIndex);
          }
        });

        boardContainer.appendChild(cellElement);
      });
    });
  }

  // Handle a player's move
  function makeMove(row, col) {
    board[row][col] = currentPlayer;
    renderBoard();

    if (checkWinner()) {
      resultContainer.textContent = `Player ${currentPlayer} wins!`;
      gameOver = true;
    } else if (isTie()) {
      resultContainer.textContent = "It's a tie!";
      gameOver = true;
    } else {
      // Switch to the computer's move
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      if (!gameOver) {
        computerMove();
      }
    }
  }

  // Simulate the computer's move
  function computerMove() {
    const emptyCells = [];

    // Collect all empty cells
    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === "") {
          emptyCells.push([rowIndex, colIndex]);
        }
      });
    });

    // Randomly select one empty cell
    if (emptyCells.length > 0) {
      const [row, col] =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];
      board[row][col] = currentPlayer;
      renderBoard();

      if (checkWinner()) {
        resultContainer.textContent = `Player ${currentPlayer} wins!`;
        gameOver = true;
      } else if (isTie()) {
        resultContainer.textContent = "It's a tie!";
        gameOver = true;
      } else {
        // Switch back to the player's turn
        currentPlayer = currentPlayer === "X" ? "O" : "X";
      }
    }
  }

  // Check for a winner
  function checkWinner() {
    // Check rows, columns, and diagonals
    for (let i = 0; i < 3; i++) {
      if (
        board[i][0] &&
        board[i][0] === board[i][1] &&
        board[i][1] === board[i][2]
      ) {
        return true;
      }

      if (
        board[0][i] &&
        board[0][i] === board[1][i] &&
        board[1][i] === board[2][i]
      ) {
        return true;
      }
    }

    if (
      board[0][0] &&
      board[0][0] === board[1][1] &&
      board[1][1] === board[2][2]
    ) {
      return true;
    }

    if (
      board[0][2] &&
      board[0][2] === board[1][1] &&
      board[1][1] === board[2][0]
    ) {
      return true;
    }

    return false;
  }

  // Check for a tie
  function isTie() {
    return board.flat().every((cell) => cell !== "");
  }

  // Reset the game
  function resetGame() {
    board = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
    currentPlayer = "";
    gameOver = false;
    resultContainer.textContent = "";
    document.querySelector(".choose").style.display = "flex"; // Show choice buttons again
    renderBoard();
  }

  // Start the game
  initializeGame();
});
