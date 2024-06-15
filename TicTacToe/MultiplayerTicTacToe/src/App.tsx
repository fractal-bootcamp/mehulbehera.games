import { MouseEvent, MouseEventHandler, useEffect, useState } from "react";
import "./App.css";
import { Game } from "../server";
import { Link } from "react-router-dom";
import { useAtom } from "jotai";
import { currentGameID, playerNameAtom } from "./state";

const emptyBoard: string[] = ["", "", "", "", "", "", "", "", ""];
const serverPath = "http://localhost:4000";
const gameId = "1";

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

//get game by id
async function getGame(id: string) {
  //get response from fetch (get request) -> same as calling curl http://localhost:4000/game/1
  console.log("id from app.tsx", id);
  const response = await fetch(`${serverPath}/game/${id}`);
  const json = await response.json();
  return json;
}

//make a move
async function makeAMove(id: string, index: number, playerName: string) {
  //get response from fetch (post request) -> same as calling curl curl http://localhost:4000/game/1/move

  console.log("id from MakeAMove, ", id);
  console.log("index from MakeAMove, ", index);

  const response = await fetch(`${serverPath}/game/${id}/move`, {
    method: "POST",
    body: JSON.stringify({ id, index, playerName }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  return json;
}

//reset game
async function resetGame(id: string) {
  const response = await fetch(`${serverPath}/game/${id}/reset`);
  const json = await response.json();
  return json;
}

function App() {
  const [winner, setWinner] = useState("");
  const [playerName, setPlayerName] = useAtom(playerNameAtom);

  const [currentgameID, setCurrentGame] = useAtom(currentGameID);

  //numWins: {X Wins: 0, Ties, O Wins}
  const [numXWins, setXWins] = useState(0);
  const [numOWins, setOWins] = useState(0);
  const [numTies, setTies] = useState(0);

  //progress
  const [progress, setProgress] = useState(0);

  //multiplayer use states
  //gets state of game
  const [game, setGame] = useState(null);
  //refreshes page
  const [poller, setPoller] = useState(0);

  useEffect(() => {
    async function initializeGame() {
      // Go get the game
      const data = await getGame(currentgameID);

      // store the game in state
      setGame(data.game);
      console.log(game);
    }

    // call the function
    initializeGame();

    //set Winner
    if (game?.winPiece !== null && game?.winPiece !== undefined) {
      setWinner(game?.winPiece);
      setProgress(1);
    }

    //refresh gameState every second
    setTimeout(() => {
      setPoller(poller + 1);
    }, 1000);
  }, [poller]);

  useEffect(() => {
    if (winner !== "") {
      document.getElementById("winner_modal")!.showModal();
      if (winner === "X") {
        setXWins(numXWins + 1);
      }
      if (winner === "O") {
        setOWins(numOWins + 1);
      }
      if (winner === null) {
        setTies(numTies + 1);
      }
    }
  }, [winner]);

  const hasWon = winner !== "";

  //let bgColor = "bg-gray-200";

  function getWinner(): { winningPiece: string; winningCoords: number[] } {
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
      const winningCoords = possibleWinnerCoords[i];
      if (
        game?.board[winningCoords[0]] === game?.board[winningCoords[1]] &&
        game?.board[winningCoords[0]] === game?.board[winningCoords[2]] &&
        game?.board[winningCoords[0]] !== ""
      ) {
        //someone won
        //gets X or O
        const winningPiece = game?.board[winningCoords[0]];

        return {
          winningPiece: winningPiece,
          winningCoords: [winningCoords[0], winningCoords[1], winningCoords[2]],
        };
      }
    }

    return { winningPiece: "none", winningCoords: [0, 1, 2] };
  }

  function bgColor(elementInSquare: string, index: number): string {
    if (winner) {
      const output = getWinner();
      const winningCoords = output.winningCoords;
      const winningPiece = output.winningPiece;

      if (winningCoords.includes(index)) {
        if (winningPiece === "X") {
          return "bg-blue-300 hover:bg-blue-400 disabled:bg-green-300";
        } else if (winningPiece === "O") {
          return "bg-red-300 hover:bg-red-400 disabled:bg-green-300";
        }
      }
    }

    if (elementInSquare === "X") {
      return "bg-blue-300 hover:bg-blue-400 disabled:bg-blue-400";
    } else if (elementInSquare === "O") {
      return "bg-red-300 hover:bg-red-400 disabled:bg-red-400";
    }

    return "bg-gray-200 hover:bg-gray-300 disabled:bg-gray-400";
  }

  return (
    <>
      <div className="flex flex-row gap-5">
        <h2>You are Player: {playerName}</h2>
        <div>
          <section className="grid grid-cols-3 gap-1 max-w-2xl aspect-square place-items-center">
            {game?.board.map((tile, index) => (
              <button
                className={
                  " btn border border-black disabled:border disabled:border-black h-full w-full btn-lg text-7xl  disabled:text-black text-black " +
                  bgColor(tile, index)
                }
                id={index.toString()}
                disabled={hasWon}
                onClick={() => {
                  makeAMove(game?.id, index, playerName),
                    setProgress(progress + 1 / 9);
                }}
              >
                {tile}
              </button>
            ))}
          </section>

          <section className="grid grid-cols-3 gap-1 max-w-2xl place-items-center">
            <button
              className="btn m-2 bg-gray-200 hover:bg-gray-200 disabled:bg-gray-200 btn-lg w-44  text-black disabled:text-black "
              id="XWinButton"
              disabled={hasWon}
            >
              {game?.player1} Won: {numXWins}
            </button>
            <button
              className="btn m-2 bg-gray-200 hover:bg-gray-200 disabled:bg-gray-200 btn-lg w-44  text-black disabled:text-black "
              id="Tie"
              disabled={hasWon}
            >
              Ties: {numTies}
            </button>
            <button
              className="btn m-2 bg-gray-200 hover:bg-gray-200 disabled:bg-gray-200 btn-lg w-44  text-black disabled:text-black "
              id="OWinButton"
              disabled={hasWon}
            >
              {game?.player2} Won: {numOWins}
            </button>
          </section>
          <div>
            <progress className="progress w-56" value={progress}></progress>
          </div>
        </div>

        <div className="flex flex-col">
          <button
            className="btn m-2 btn-info btn-lg w-44 hover:bg-gray-300 bg-gray-200"
            onClick={() => {
              resetGame(game?.id);
              setProgress(0);
            }}
          >
            {!winner ? "Reset" : "Next Game"}
          </button>
          <Link to="/lobby">
            <button
              className="btn m-2 btn-info btn-lg w-44 hover:bg-gray-300 bg-gray-200"
              onClick={() => {}}
            >
              Exit
            </button>
          </Link>
        </div>
      </div>

      <dialog id="winner_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">WINNER!</h3>
          <p className="py-4">{game?.winPlayer} won the game!</p>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}

export default App;
