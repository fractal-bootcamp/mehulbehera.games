import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col">
        <h1>Enter Your Username</h1>
        <input className=" w-46" />
        <Link to="/lobby">
          <button
            className="btn m-2 btn-info btn-lg w-44 hover:bg-gray-300 bg-gray-200"
            onClick={() => {}}
          >
            Play TicTacToe
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
