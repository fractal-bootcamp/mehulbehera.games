import { useEffect, useState } from "react";

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

//async join lobby

function Lobby() {
  //Maybe add functionality to modify lobby
  const [games, setGames] = useState<Game[]>([]);
  //const [poller, setPoller] = useState(0);

  //   useEffect(() => {
  //     async function initializeGame() {
  //       // Go get the game
  //       const data: Game[] = await getAllGames();

  //       // store the game in state
  //       setGames(data);
  //     }

  //     // call the function
  //     initializeGame();

  //     console.log(games);

  //     //refresh gameState every second
  //     setTimeout(() => {
  //       setPoller(poller + 1);
  //     }, 1000);
  //   }, [poller]);

  async function initializeGames() {
    // Go get the game
    const data: Game[] = await getAllGames();

    // store the game in state
    setGames(data);
  }

  // call the function - runs once on render
  useEffect(() => {
    initializeGames();
  }, []);

  //consistently rerenders screen

  return (
    <>
      <div className="flex justify-center">
        <div className="flex-col">
          <button
            className="btn m-2 btn-info btn-lg w-44 hover:bg-gray-300 bg-gray-200"
            onClick={() => {}}
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
                      onClick={() => {}}
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
    </>
  );
}

export default Lobby;
