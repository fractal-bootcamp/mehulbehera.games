import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const serverPath = "http://localhost:4000";
const emptyBoard: string[] = ["", "", "", "", "", "", "", "", ""];

//interfaces
interface winnerOutput {
  //X, O, null
  winningPiece: string | null;

  //Win, Draw, null
  winningOutcome: string | null;
}

interface player {
  token: string;
  id: string;
}

type Game = {
  id: number;
  board: string[];
  currentPlayer: "X";
  winnerOutput: winnerOutput;
  player1: player;
  player2: player;
};

//Server Function

//***********Lobby Functions ***************** */
async function getAllGames(): Promise<Game[]> {
  //get response from fetch (get request)
  const response = await fetch(`${serverPath}/games/`);
  const json = await response.json();
  const allGames: Game[] = [];
  for (const [key, value] of Object.entries(json.games)) {
    allGames.push(value);
  }

  return allGames;
}

//async create game
async function createAGame(id: string, name: string) {
  //get response from fetch (post request) -> same as calling curl curl http://localhost:4000/game/1/move
  const response = await fetch(`${serverPath}/game/create`, {
    method: "POST",
    body: JSON.stringify({ id, name }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  console.log(json);
  return json;
}
//***********Lobby Functions ***************** */

//***********Game Functions ***************** */

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
  const response = await fetch(`${serverPath}/game/${id}`);
  const json = await response.json();
  return json;
}

//make a move
async function makeAMove(id: string, index: number) {
  //get response from fetch (post request) -> same as calling curl curl http://localhost:4000/game/1/move

  console.log("id from MakeAMove, ", id);
  console.log("index from MakeAMove, ", index);

  const response = await fetch(`${serverPath}/game/${id}/move`, {
    method: "POST",
    body: JSON.stringify({ id, index }),
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

//***********Game Functions ***************** */

function Play() {
  //stores username
  const [userName, setUserName] = useState("");

  //disables submit username button
  const [disabled, setDisabled] = useState(false);

  //get games for lobby
  const [games, setGames] = useState<Game[]>([]);

  //keeping track of game IDS for lobby
  const [gameIdLobby, setGameIdLobby] = useState(1);

  //***********Lobby Functions ***************** */
  async function initializeGames() {
    // Go get the game
    const data: Game[] = await getAllGames();
    console.log("games :", data);
    // store the game in state
    setGames(data);
  }

  //call the function - runs once on render
  //   useEffect(() => {
  //     initializeGames();
  //   }, []);

  //consistently rerenders screen
  initializeGames();
  //***********Lobby Functions ***************** */

  //***********Game Functions ***************** */

  //***********Game Functions ***************** */

  return (
    <div className="justify-start">
      <div className="flex flex-col">
        <input
          type="text"
          placeholder="Enter"
          className="input input-bordered input-primary w-full max-w-xs my-3"
          disabled={disabled}
          onChange={(e) => {
            setUserName(e.target.value);
          }}
        />
        <button
          className="btn m-2 btn-info btn-lg w-44 hover:bg-gray-300 bg-gray-200"
          onClick={() => {
            setDisabled(true);
          }}
        >
          Submit
        </button>
        <div className="flex">
          <div className="flex-col">
            <button
              className="btn m-2 btn-info btn-lg w-44 hover:bg-gray-300 bg-gray-200"
              onClick={() => {
                createAGame(gameIdLobby.toString(), userName);
                setGameIdLobby(gameIdLobby + 1);
              }}
            >
              Create Game
            </button>

            <div>
              {games.map((game, index) => (
                <div className="collapse collapse-arrow bg-base-200">
                  <input type="radio" name="my-accordion-2" defaultChecked />
                  <div className="collapse-title text-xl font-medium">
                    {"Game " + (index + 1)}
                  </div>
                  <div className="collapse-content">
                    <div className="flex flex-row items-center">
                      <div className="flex align-middle">{game.id}</div>
                      <button
                        className="btn m-2 btn-info btn-sm w-34 hover:bg-gray-300 bg-gray-200"
                        onClick={() => {
                          <Link to={"/game/:gameId"}></Link>;
                        }}
                      >
                        {"Join Game with:" + game.player1}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Play;
