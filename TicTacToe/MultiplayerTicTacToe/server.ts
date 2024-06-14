//express server

import express from "express"
import cors from "cors"
const app = express();

app.use(express.json())
app.use(cors())

const PORT = 4000;// || process.env.PORT;

const emptyBoard = ["", "", "", "", "", "", "", "", ""];

interface winnerOutput {
    //X, O, null
    winningPiece: string | null;

    //Win, Draw, null
    winningOutcome: string | null;
}

interface player {

    token: string, id: string

}

// export type Game = {
//     id: number,
//     board: string[],
//     currentPlayer: "X",
//     winnerOutput: winnerOutput,
//     player1: player,
//     player2: player,
// }

let games = {
    ["1"]: {
        id: "1",
        board: emptyBoard,
        currentPlayer: "X",
        winnerOutput: { winningPiece: null, winningOutcome: null }, // { outcome: "WIN" | "TIE" | null, winner: "X" | "O" | null },
        winPiece: "",
        winOutcome: "",
        winPlayer: "",
        player1: { token: "X", id: "" },
        player2: { token: "O", id: "" },
    },
};

app.get("/", (req, res) => {
});

//get game
app.get("/game/:id", (req, res) => {
    //get game parameters and find game
    const id = req.params.id;
    const game = games[id];

    // If no game is found returnan error
    if (!game) {
        return res.status(404).send("Game not found");
    }

    res.json({ game: game });
})

interface winnerOutput {
    //X, O, null
    winningPiece: string | null;

    //Win, Draw, null
    winningOutcome: string | null;
}

function checkWinState(b: typeof emptyBoard): winnerOutput {
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
    //winningOutcome = "TIE";

    //return { winningPiece, "TIE" };

    return { winningPiece, winningOutcome };
}

app.post("/game/:id/move", (req, res) => {
    //get game
    const id = req.params.id;
    const game = games[id];

    //get index of move
    const { index } = req.body;


    // If no game is found
    if (!game) {
        return res.status(404).send("Game not found");
    }

    //place player on square
    const player = game.currentPlayer;
    game.board[index] = player;

    //toggle player
    game.currentPlayer = player === "X" ? "O" : "X";

    const output = checkWinState(game.board);

    //Check if there was a winner - gameState to winningoutput
    game.winnerOutput = output
    game.winPiece = game.winnerOutput.winningPiece
    game.winOutcome = game.winnerOutput.winningOutcome
    console.log(game.winPiece)
    if (game.winnerOutput.winningOutcome === "WIN") {
        if (game.winPiece === "X") {

            game.winPlayer = "Player 1"

        }
        else {
            game.winPlayer = "Player 2"

        }

    }
    console.log("game.winplayer, ", game.winPlayer)

    //return game state
    res.json({ game });
});

app.get("/game/:id/reset", (req, res) => {

    //get game
    const id = req.params.id;
    const game = games[id];

    // If no game is found
    if (!game) {
        return res.status(404).send("Game not found");
    }

    //reset game board
    for (let i = 0; i < game.board.length; i++) {

        game.board[i] = "";

    }
    game.currentPlayer = "X"
    game.winningOutcome = { winningPiece: null, winningOutcome: null }
    game.winPiece = ""
    game.winOutcome = ""
    game.winPlayer = ""

    //return game state
    res.json({ game });

})

app.listen(PORT, () => {
    console.log("listening on port " + PORT);
});



// const gameState = {

//     board: [],
//     player1: "X",
//     player2: "O",
//     currentPlayer: "X" || "O",
//     winOutcome:{
//         winningPiece: string | null;
//         winningOutcome: string | null;
//       }

// }