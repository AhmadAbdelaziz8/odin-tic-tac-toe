const initializeGame = (function () {  
  let playerSelection ='';
  function chooseLabel(){
    playerSelection = 
  }
})();

const gameLogic = (function () {
  // Create a 3x3 array with empty strings
  let board = [];
  for (let i = 0; i < 3; i++) {
    board[i] = ["", "", ""];
  }

  // Log the initialized board board immediately
  console.log(board);

  // Add the human choice to the corresponding location
  function humanChoice(x, y, choice) {
    board[x][y] = choice;
  }

  // Add the computer choice to a random location
  function computerChoice(choice) {
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
  let boardContainer = document.querySelector(".gameboard");

  gameLogic.board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      let cellContainer = document.createElement("div");
      cellContainer.classList.add("cell");
      cellContainer.textContent = cell;
      cellContainer.dataset.row = rowIndex;
      cellContainer.dataset.col = colIndex;
      boardContainer.append(cellContainer);
    });
  });
  xButton = document.querySelector('X')
  oButton = document.querySelector('O')
  
})();

// Example usage of computerChoice (optional)
console.log(gameLogic.board);
