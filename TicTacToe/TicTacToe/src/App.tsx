import { MouseEvent, MouseEventHandler, useState } from "react";
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

    //check winner
    console.log(newBoard);
    const output = checkWinState(newBoard);

    console.log(output);

    const winningOutcome = output.winningOutcome;
    const winningPiece = output.winningPiece;

    //if won - ADD STOP PLAYERS FROM WINNING
    if (winningOutcome === "WIN") {
      setWinner(winningPiece + "    WINS");
    } else if (winningOutcome === "TIE") {
      setWinner("TIE");
    }

    //switch players
    if (currentPlayer === "X") {
      setCurrentPlayer("O");
    } else {
      setCurrentPlayer("X");
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
