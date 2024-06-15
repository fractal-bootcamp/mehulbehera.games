import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const serverPath = "http://localhost:4000";

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
                        {"Join Game with:" + userName}
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
