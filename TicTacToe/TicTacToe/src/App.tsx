import { MouseEvent, MouseEventHandler, useEffect, useState } from "react";
import "./App.css";

const emptyBoard: string[] = ["", "", "", "", "", "", "", "", ""];

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

  useEffect(() => {
    if (currentPlayer === "O" && winner === "") {
      const index = getOpponentMove(board, currentPlayer);
      setPieceOnBoard(index);
    }
  }, [board]);

  const togglePlayer = () => {
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  };

  function setPieceOnBoard(index: number) {
    let newBoard = [...board];

    if (newBoard[index] === "") {
      newBoard[index] = currentPlayer;
      setBoard(newBoard);

      //switch players - for 2 players
      togglePlayer();

      const output = checkWinState(newBoard);

      const winningOutcome = output.winningOutcome;
      const winningPiece = output.winningPiece;

      //if won - ADD STOP PLAYERS FROM WINNING
      if (winningOutcome === "WIN") {
        setWinner(winningPiece + "    WINS");
      } else if (winningOutcome === "TIE") {
        setWinner("TIE");
      }
    }
  }

  //params: board, depth(how many layers deep), maxmize (boolean whether or not to max), player ("X"|"O")
  //returns score of a board in a terminal case
  function minMax(
    boardToMinMax: typeof board,
    depth: number,
    maximize: boolean,
    player: string
  ): number {
    //Base Case: If game is in terminal state evaluate board and return a score
    const output = checkWinState(boardToMinMax);

    const winningOutcome = output.winningOutcome;
    const winningPiece = output.winningPiece;

    if (winningOutcome !== null) {
      if (winningOutcome === "WIN") {
        //player wins - return a positive score based on how many layers deep they win
        if (winningPiece === player) {
          return 10 - depth;
        }
        //opponent wins - return a negative score based on how many layers deep
        else {
          return depth - 10;
        }
      }
      //if a tie - return 0
      if (winningOutcome === "TIE") {
        return 0;
      }
    }

    //Recursive Function

    //set opponent
    const opponent = player === "X" ? "O" : "X";

    //maximizing half
    if (maximize) {
      let bestScore = -Infinity;

      //for all empty spots on board
      for (let i = 0; i < boardToMinMax.length; i++) {
        if (boardToMinMax[i] === "") {
          //set piece on potential board
          const newBoard = [...boardToMinMax];
          newBoard[i] = opponent;

          //get minMaxScore on potential board
          const score = minMax(newBoard, depth + 1, false, player);
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    }
    //minimizing half
    else {
      let bestScore = Infinity;

      //get all potential boards from empty spots
      for (let i = 0; i < boardToMinMax.length; i++) {
        if (boardToMinMax[i] === "") {
          const newBoard = [...boardToMinMax];
          newBoard[i] = player;

          const score = minMax(newBoard, depth + 1, true, player);
          bestScore = Math.min(score, bestScore);
        }
      }

      return bestScore;
    }
  }

  //params: Takes in current board and current player(opponent)
  //returns: index of best Move
  function getOpponentMove(boardToMoveOn: string[], player: string): number {
    let scores: { score: number; index: number }[] = [];
    //get the scores of all potential terminal states based on params
    for (let i = 0; i < boardToMoveOn.length; i++) {
      if (boardToMoveOn[i] === "") {
        const potentialBoard = [...boardToMoveOn];
        potentialBoard[i] = player;
        const scoreFromMinMax = minMax(potentialBoard, 0, true, player);
        //console.log("scoreFrom MinMax", scoreFromMinMax);
        scores.push({ score: scoreFromMinMax, index: i });
      }
    }

    // console.log("scores: ", scores);

    //get the index of the highest score - best move
    let maxIndex = -1;
    let maxScore = -Infinity;

    for (let i = 0; i < scores.length; i++) {
      const scoreToEval = scores[i].score;
      const indexToEval = scores[i].index;

      if (maxScore < scoreToEval) {
        maxScore = scoreToEval;
        maxIndex = indexToEval;
      }
    }

    return maxIndex;
  }

  function handlePress(e: MouseEvent<HTMLButtonElement>) {
    const buttonID = parseInt(e.currentTarget.id);
    //add user piece
    setPieceOnBoard(buttonID);

    togglePlayer();
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
