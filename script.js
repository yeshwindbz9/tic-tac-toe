function createBoard() {
  let board = new Array(9).fill(null);

  const canPlayPiece = (index) => {
    if (index < 0 || index > 8) return false;
    return board[index] === null;
  };

  const playPiece = (player, index) => {
    board[index] = player;
    return;
  };

  const checkBoard = () => {
    // Check columns
    if (
      (board[0] !== null && board[0] === board[3] && board[3] === board[6]) ||
      (board[1] !== null && board[1] === board[4] && board[4] === board[7]) ||
      (board[2] !== null && board[2] === board[5] && board[5] === board[8])
    ) {
      return "Win";
    }
    // Check rows
    if (
      (board[0] !== null && board[0] === board[1] && board[1] === board[2]) ||
      (board[3] !== null && board[3] === board[4] && board[4] === board[5]) ||
      (board[6] !== null && board[6] === board[7] && board[7] === board[8])
    ) {
      return "Win";
    }
    // Check diagonals
    if (
      (board[0] !== null && board[0] === board[4] && board[4] === board[8]) ||
      (board[2] !== null && board[2] === board[4] && board[4] === board[6])
    ) {
      return "Win";
    }

    // Check board full
    if (!board.includes(null)) {
      return "Draw";
    }

    return null;
  };

  const getBoardState = () => {
    return `
        ${board[0]} ${board[1]} ${board[2]}\n
        ${board[3]} ${board[4]} ${board[5]}\n
        ${board[6]} ${board[7]} ${board[8]}`;
  };

  const resetBoard = () => {
    board = new Array(9).fill(null);
  };

  return { canPlayPiece, playPiece, checkBoard, getBoardState, resetBoard };
}

function createPlayer(name, symbol) {
  let pName = name;
  let pSymbol = symbol;

  const getSymbol = () => {
    return pSymbol;
  };

  const getPlayer = () => {
    return pName;
  };

  return { getPlayer, getSymbol };
}

function createGame() {
  const playerOne = createPlayer("playerUno", "X");
  const playerTwo = createPlayer("playerDos", "O");

  let isGameOver = false;
  let currentPlayer = playerOne;

  const gameBoard = createBoard();

  const canTakeTurn = (index) => {
    return gameBoard.canPlayPiece(index);
  };

  const takeTurn = (index) => {
    // put piece into board
    gameBoard.playPiece(currentPlayer.getSymbol(), index);
    // check if game has ended
    let gameStatus = gameBoard.checkBoard();
    if (gameStatus !== null) {
      isGameOver = true;
      return gameStatus;
    }
    return null;
  };

  const swapTurn = () => {
    if (currentPlayer === playerOne) currentPlayer = playerTwo;
    else currentPlayer = playerOne;
  };

  const getCurrentPlayer = () => {
    return currentPlayer;
  };

  const getIsGameOver = () => {
    return isGameOver;
  };

  const resetGame = () => {
    currentPlayer = playerOne;
    isGameOver = false;
    gameBoard.resetBoard();
  };

  const printBoardState = () => {
    console.log(gameBoard.getBoardState());
  };

  return {
    canTakeTurn,
    takeTurn,
    getCurrentPlayer,
    swapTurn,
    printBoardState,
    getIsGameOver,
    resetGame,
  };
}

function displayHandler() {
  const mainGame = createGame();
  const gameButtons = document.querySelectorAll(".grid-ele");
  const statusMessage = document.querySelector(".ctrl-status");
  const resetButton = document.querySelector("#reset-btn");

  resetButton.addEventListener("click", (e) => {
    resetGame();
  });

  const resetGame = () => {
    mainGame.resetGame();
    gameButtons.forEach((ele) => {
      ele.textContent = "";
      ele.classList.add("clickable");
      ele.addEventListener("click", (e) => {
        takeTurn(e.target);
      });
    });
    statusMessage.textContent = `Who's ${mainGame
      .getCurrentPlayer()
      .getSymbol()}? start the game! `;
  };

  const takeTurn = (square) => {
    let index = square.dataset.index;
    if (mainGame.canTakeTurn(index - 1) && !mainGame.getIsGameOver()) {
      let result = mainGame.takeTurn(index - 1);
      square.textContent = mainGame.getCurrentPlayer().getSymbol();
      if (result !== null) {
        handleGameEnd(result);
        return;
      }
      mainGame.swapTurn();
      statusMessage.textContent = `Player ${mainGame
        .getCurrentPlayer()
        .getSymbol()}, it's your turn! `;
      square.classList.remove("clickable");
      square.removeEventListener("click", takeTurn);
    }
  };

  const handleGameEnd = (res) => {
    if (res === "Draw") {
      statusMessage.textContent = "It's a tick-tac-tie ";
    } else {
      statusMessage.textContent = `${mainGame
        .getCurrentPlayer()
        .getSymbol()} has won! `;
    }

    gameButtons.forEach((ele) => {
      ele.classList.remove("clickabel");
      ele.removeEventListener("click", takeTurn);
    });
  };

  resetGame();
}

let start = displayHandler();
