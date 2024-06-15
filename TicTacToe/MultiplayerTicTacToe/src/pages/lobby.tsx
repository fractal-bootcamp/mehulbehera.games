import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { currentGameID, playerNameAtom } from "../state";
import { gameIDToAdd } from "../state";

const serverPath = "http://localhost:4000";

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

//join game
async function joinAGame(id: string, name: string) {
  //get response from fetch (post request) -> same as calling curl curl http://localhost:4000/game/1/move
  const response = await fetch(`${serverPath}/game/join`, {
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

//async join lobby

function Lobby() {
  //Maybe add functionality to modify lobby
  const [games, setGames] = useState<Game[]>([]);

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

  const [playerName, setPlayerName] = useAtom(playerNameAtom);
  const [gameToAddID, setGameToAddID] = useAtom(gameIDToAdd);

  const [currentgameID, setCurrentGame] = useAtom(currentGameID);
  const params = useParams();
  console.log(params);

  //consistently rerenders screen
  initializeGames();

  return (
    <>
      YOU ARE: {playerName}
      <div className="flex justify-center">
        <div className="flex-col">
          <Link to={`/game/${gameToAddID}`}>
            <button
              className="btn m-2 btn-info btn-lg w-44 hover:bg-gray-300 bg-gray-200"
              onClick={() => {
                createAGame(gameToAddID.toString(), playerName);
                setCurrentGame(gameToAddID.toString());
                setGameToAddID(gameToAddID + 1);
              }}
            >
              Create Game
            </button>
          </Link>
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
                  </div>
                  <Link to={`/game/${game?.id}`}>
                    <button
                      className="btn m-2 btn-info btn-sm w-34 hover:bg-gray-300 bg-gray-200"
                      onClick={() => {
                        setCurrentGame(game?.id);
                        joinAGame(game?.id, playerName);
                      }}
                    >
                      {"Join Game with:" + game?.player1}
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Lobby;
