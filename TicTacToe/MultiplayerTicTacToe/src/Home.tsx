import { useAtom } from "jotai";
import { useState } from "react";
import { Link } from "react-router-dom";
import { playerNameAtom } from "./state";

function Home() {
  const [nameInput, setNameInput] = useState("");
  const [playerName, setPlayerName] = useAtom(playerNameAtom);
  return (
    <div className="flex justify-center">
      <div className="flex flex-col">
        <h1 className="text-white">Your Current Username is: {playerName}</h1>
        <h1 className="text-white">Enter New Username?:</h1>
        <input
          type="text"
          placeholder="Type here"
          className="input input-bordered input-primary w-full max-w-xs my-3"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />
        <Link to="/lobby">
          <button
            className="btn m-2 btn-info btn-lg w-44 hover:bg-gray-300 bg-gray-200"
            onClick={() => {
              setPlayerName(nameInput);
            }}
          >
            Play TicTacToe
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
