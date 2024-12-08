const initializeGame = (function () {
  // choose the label and delte buttons
  const xButton = document.querySelector(".X");
  const oButton = document.querySelector(".O");
  const buttonsContainer = document.querySelector(".choose");
  let playerSelection = "";

  function chooseLabel(label) {
    playerSelection = label;
    buttonsContainer.remove();
  }

  function getPlayerSelection() {
    return playerSelection;
  }
  xButton.addEventListener("click", () => {
    chooseLabel(xButton.textContent);
  });

  oButton.addEventListener("click", () => {
    chooseLabel(oButton.textContent);
  });
  return { chooseLabel, getPlayerSelection };
})();

const gameLogic = (function () {
  // Create a 3x3 array with empty strings
  let board = [];
  for (let i = 0; i < 3; i++) {
    board[i] = ["", "", ""];
  }

  // Add the human choice to the corresponding location
  function humanChoice(row, col) {
    const choice = initializeGame.getPlayerSelection();
    gameLogic.board[row][col] = choice;
  }

  // Add the computer choice to a random location
  function computerChoice() {
    const choice = initializeGame.getPlayerSelection() === "X" ? "O" : "X";
    let x, y;
    do {
      x = Math.floor(Math.random() * 3);
      y = Math.floor(Math.random() * 3);
    } while (board[x][y] !== ""); // Ensure the cell is empty

    board[x][y] = choice;
  }

  // Return the humanChoice and computerChoice functions
  return {
    humanChoice,
    computerChoice,
    board,
  };
})();

const render = (function () {
  // render the board
  // let boardContainer = document.querySelector(".gameboard");
  let resultContainer = document.querySelector(".result");

  function updateBoard() {
    const boardContainer = document.querySelector(".gameboard");
    boardContainer.innerHTML = ""; // Clear previous rendering

    gameLogic.board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        // Create a cell element
        const cellContainer = document.createElement("div");
        cellContainer.classList.add("cell");
        cellContainer.textContent = cell; // Display current value ("X", "O", or "")

        // Attach data attributes for indexing
        cellContainer.dataset.row = rowIndex;
        cellContainer.dataset.col = colIndex;

        // Add event listener for click
        cellContainer.addEventListener("click", () => {
          // Ensure the cell is empty before assigning
          if (gameLogic.board[rowIndex][colIndex] === "" && !isGameOver()) {
            // Assign player's choice
            gameLogic.humanChoice(rowIndex, colIndex);
            render.updateBoard(); // Re-render the updated board

            // Handle computer's move (if game not over)
            if (!isGameOver()) {
              gameLogic.computerChoice();
              render.updateBoard();
            }

            // Display result if the game ends
            if (isGameOver()) {
              displayResult();
            }
          }
        });

        // Append the cell to the board container
        boardContainer.append(cellContainer);
      });
    });
  }

  // Function to display the game result
  function displayResult() {
    const winner = checkWinner();
    if (winner) {
      resultContainer.textContent = `Player ${winner} wins!`;
    } else {
      resultContainer.textContent = "It's a tie!";
    }
  }

  updateBoard(); // Initial rendering of the board

  // Function to check if there's a winner
  function checkWinner() {
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (
        gameLogic.board[i][0] !== "" &&
        gameLogic.board[i][0] === gameLogic.board[i][1] &&
        gameLogic.board[i][1] === gameLogic.board[i][2]
      ) {
        return gameLogic.board[i][0];
      }
    }

    // Check columns
    for (let j = 0; j < 3; j++) {
      if (
        gameLogic.board[0][j] !== "" &&
        gameLogic.board[0][j] === gameLogic.board[1][j] &&
        gameLogic.board[1][j] === gameLogic.board[2][j]
      ) {
        return gameLogic.board[0][j];
      }
    }

    // Check diagonals
    if (
      gameLogic.board[0][0] !== "" &&
      gameLogic.board[0][0] === gameLogic.board[1][1] &&
      gameLogic.board[1][1] === gameLogic.board[2][2]
    ) {
      return gameLogic.board[0][0];
    }
    if (
      gameLogic.board[0][2] !== "" &&
      gameLogic.board[0][2] === gameLogic.board[1][1] &&
      gameLogic.board[1][1] === gameLogic.board[2][0]
    ) {
      return gameLogic.board[0][2];
    }

    return null; // No winner
  }

  // Function to check if the game is over
  function isGameOver() {
    // Check for a winner
    if (checkWinner()) {
      return true;
    }

    // Check for a tie (board full)
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (gameLogic.board[i][j] === "") {
          return false; // Empty cell found, game not over
        }
      }
    }

    return true; // No empty cells, game is a tie
  }

  return { updateBoard };
})();