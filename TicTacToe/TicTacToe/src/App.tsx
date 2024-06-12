import { MouseEvent, MouseEventHandler, useEffect, useState } from "react";
import "./App.css";

const emptyBoard: string[] = ["", "", "", "", "", "", "", "", ""];

interface player {
  //X or O
  piece: string;
}

interface winnerOutput {
  //X, O, null
  winningPiece: string | null;

  //Win, Draw, null
  winningOutcome: string | null;
}

export function checkWinState(b: typeof emptyBoard): winnerOutput {
  //all possible winning positions
  const possibleWinnerCoords = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < 8; i++) {
    //[0,1,2]
    const winningCoords = possibleWinnerCoords[i];
    if (
      b[winningCoords[0]] === b[winningCoords[1]] &&
      b[winningCoords[0]] === b[winningCoords[2]] &&
      b[winningCoords[0]] !== ""
    ) {
      //someone won
      //gets X or O
      const winningPiece = b[winningCoords[0]];
      const winningOutcome = "WIN";

      return { winningPiece, winningOutcome };
    }
  }

  //no one  won
  const winningPiece = null;
  let winningOutcome = null;

  for (let i = 0; i < 9; i++) {
    if (b[i] === "") {
      //games unfinished
      return { winningPiece, winningOutcome };
    }
  }

  //final outcome: TIE
  winningOutcome = "TIE";

  return { winningPiece, winningOutcome };
}

function App() {
  const [board, setBoard] = useState(emptyBoard);
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [winner, setWinner] = useState("");

  // useEffect(() => {
  //   if (currentPlayer === "O") {
  //     const index = getOpponentRandomMove();
  //     let newBoard = { ...board };

  //     if (newBoard[index] === "") {
  //       newBoard[index] = currentPlayer;
  //       setBoard(newBoard);
  //     } else {
  //       //user put invalid move
  //       return;
  //     }
  //   }
  // }, [board]);

  useEffect(() => {
    console.log("UseEffect Ran");
  }, [board]);

  const togglePlayer = () => {
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  };

  function setPieceOnBoard(index: number) {
    let newBoard = { ...board };
    if (newBoard[index] === "") {
      newBoard[index] = currentPlayer;
      setBoard(newBoard);

      //switch players - for 2 players
      togglePlayer();
    }
  }

  const minimax = (
    board: string[],
    maximize: boolean,
    player: "X" | "O",
    depth: number,
    alpha: number = -Infinity,
    beta: number = Infinity,
    maxDepth: number = 20 // Limiting depth to 10
  ): { score: number; depth: number; winState: winnerOutput } => {
    const winState = checkWinState(board);

    // IF TERMINAL, return a score
    if (winState.winningOutcome !== null) {
      // IF WIN, check if it's the player or the opponent

      if (winState.winningOutcome === "WIN") {
        if (winState.winningPiece === player) {
          // If the player wins, return this positive score (we should do this)
          return { score: maxDepth - depth, depth, winState };
        }

        // If the opponent wins, return this negative score (we should avoid this)
        return { score: depth - maxDepth, depth, winState };
      }
      if (winState.winningPiece === "TIE") {
        return { score: 0, depth, winState };
      }
    }

    // Stop recursion if max depth is reached
    if (depth >= maxDepth) {
      return { score: 0, depth, winState };
    }

    const opponent = player === "X" ? "O" : "X";

    if (maximize) {
      let bestScore = -Infinity;

      for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
          const newBoard = [...board];
          newBoard[i] = opponent;

          // perform minimax on the new board
          const { score } = minimax(
            newBoard,
            false,
            player,
            depth + 1,
            alpha,
            beta,
            maxDepth
          );
          bestScore = Math.max(score, bestScore);

          alpha = Math.max(alpha, bestScore);
          if (beta <= alpha) {
            break; // Beta cut-off
          }
        }
      }
      return { score: bestScore, depth, winState };
    } else {
      let bestScore = Infinity;

      for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
          const newBoard = [...board];
          newBoard[i] = player;
          const { score } = minimax(
            newBoard,
            true,
            player,
            depth + 1,
            alpha,
            beta,
            maxDepth
          );
          bestScore = Math.min(score, bestScore);
          beta = Math.min(beta, bestScore);
          if (beta <= alpha) {
            break; // Alpha cut-off
          }
        }
      }
      return { score: bestScore, depth, winState };
    }
  };

  function getOpponentRandomMove() {
    let arrayEmpty = [];
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        arrayEmpty.push(i);
      }
    }

    const index = arrayEmpty[Math.floor(Math.random() * arrayEmpty.length)];
    return index;
  }

  //Jakes get best move
  function getBestMove(board: string[], player: "X" | "O") {
    const scores: {
      score: number;
      index: number;
      details: {
        score: number;
        depth: number;
        winState: winnerOutput;
      };
    }[] = [];
    for (let i = 0; i < board.length; i++) {
      // Decided who to test

      // if the space is empty
      if (board[i] === "") {
        // create the potential board to score
        const potentialBoard = [...board];

        // assign the player
        potentialBoard[i] = player;

        // score the board
        const score = minimax(potentialBoard, true, player, 0);
        //   console.log(score.score)

        scores.push({ score: score.score, index: i, details: score });
      }
    }
    console.log(
      scores.map((score) => [score.index, score.score, score.details.depth])
    );

    const bestMove =
      scores.length &&
      scores.reduce((acc, curr) => {
        if (acc.score > curr.score) {
          return acc;
        }
        return curr;
      });
    return bestMove;
  }

  function getOpponentMove(): number {
    console.log("ran getOpponent Move");
    const opponentPiece = "O";
    let indexOfMaxScore = -Infinity;
    let maxScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      // Decided who to test

      //Index of Max Score Potential board

      // if the space is empty
      if (board[i] === "") {
        // create the potential board to score
        const potentialBoard = [...board];

        // set piece in board
        potentialBoard[i] = opponentPiece;

        // score the board
        const score = minimax(potentialBoard, true, opponentPiece, 0);
        console.log(score.score);

        if (score.score > maxScore) {
          indexOfMaxScore = i;
          maxScore = score.score;
        }
      }
    }
    console.log(indexOfMaxScore);
    return indexOfMaxScore;
  }

  //play opponent
  // function opponentMove(boardToMove: typeof board) {
  //   console.log("ran opponent Move");
  //   const opponentPiece = "O";
  //   const index = getOpponentMove();

  //   if (boardToMove[index] === "") {
  //     boardToMove[index] = opponentPiece;
  //     setBoard(boardToMove);
  //   } else {
  //     //user put invalid move
  //     return;
  //   }
  // }

  function handlePress(e: MouseEvent<HTMLButtonElement>) {
    //change "ghost board" && checkValid
    let newBoard = { ...board };
    const buttonID = parseInt(e.currentTarget.id);
    if (newBoard[buttonID] === "") {
      newBoard[buttonID] = currentPlayer;
      setBoard(newBoard);
    } else {
      //user put invalid move
      return;
    }

    togglePlayer();

    //check winner
    let output = checkWinState(newBoard);

    let winningOutcome = output.winningOutcome;
    let winningPiece = output.winningPiece;

    //if won - ADD STOP PLAYERS FROM WINNING
    if (winningOutcome === "WIN") {
      setWinner(winningPiece + "    WINS");
    } else if (winningOutcome === "TIE") {
      setWinner("TIE");
    }

    //For one player - AI Move

    //check winner
    output = checkWinState(board);

    winningOutcome = output.winningOutcome;
    winningPiece = output.winningPiece;

    //if won - ADD STOP PLAYERS FROM WINNING
    if (winningOutcome === "WIN") {
      setWinner(winningPiece + "    WINS");
    } else if (winningOutcome === "TIE") {
      setWinner("TIE");
    }
  }

  const hasWon = winner !== "";

  return (
    <>
      <div>
        <div id="row1">
          <button id="0" disabled={hasWon} onClick={(e) => handlePress(e)}>
            {board[0]}
          </button>
          <button id="1" disabled={hasWon} onClick={(e) => handlePress(e)}>
            {board[1]}
          </button>
          <button id="2" disabled={hasWon} onClick={(e) => handlePress(e)}>
            {board[2]}
          </button>
        </div>
        <div id="row2">
          <button id="3" disabled={hasWon} onClick={(e) => handlePress(e)}>
            {board[3]}
          </button>
          <button id="4" disabled={hasWon} onClick={(e) => handlePress(e)}>
            {board[4]}
          </button>
          <button id="5" disabled={hasWon} onClick={(e) => handlePress(e)}>
            {board[5]}
          </button>
        </div>
        <div id="row3">
          <button id="6" disabled={hasWon} onClick={(e) => handlePress(e)}>
            {board[6]}
          </button>
          <button id="7" disabled={hasWon} onClick={(e) => handlePress(e)}>
            {board[7]}
          </button>
          <button id="8" disabled={hasWon} onClick={(e) => handlePress(e)}>
            {board[8]}
          </button>
        </div>
      </div>
      <button
        onClick={() => {
          setBoard(emptyBoard), setWinner("");
        }}
      >
        Clear
      </button>
      <div>Outcome: {winner}</div>
    </>
  );
}

export default App;
