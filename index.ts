import { checkWinState } from "./TicTacToe/TicTacToe/src/App";


const empty = ["", "", "", "", "", "", "", "", ""];
const tie = ["O", "O", "X", "X", "O", "O", "O", "X", "X"];
const XWinsDiagonal1 = ["X", "", "", "", "X", "", "", "", "X"];
const OWinsDiagonal1 = ["O", "", "", "", "O", "", "", "", "O"];


const XWinsDiagonal2 = ["", "", "X", "", "X", "", "X", "", ""];
const OWinsDiagonal2 = ["", "", "O", "", "O", "", "O", "", ""];

const XWinsRow1 = ["X", "X", "X", "", "", "", "", "", ""];
const OWinsRow1 = ["O", "O", "O", "", "", "", "", "", ""];


const XWinsColumn1 = ["X", "", "", "X", "", "", "X", "", ""];
const OWinsColumn1 = ["O", "", "", "O", "", "", "O", "", ""];


const XWinsRow2 = ["", "", "", "X", "X", "X", "", "", ""];
const OWinsRow2 = ["", "", "", "O", "O", "O", "", "", ""];


const XWinsColumn2 = ["", "X", "", "", "X", "", "", "X", ""];
const OWinsColumn2 = ["", "O", "", "", "O", "", "", "O", ""];


const XWinsRow3 = ["", "", "", "", "", "", "X", "X", "X"];
const OWinsRow3 = ["", "", "", "", "", "", "O", "O", "O"];


const XWinsColumn3 = ["", "", "X", "", "", "X", "", "", "X"];
const OWinsColumn3 = ["", "", "O", "", "", "O", "", "", "O"];

const testAllWinners = [empty, tie, XWinsDiagonal1, XWinsDiagonal2, XWinsRow1, XWinsRow2, XWinsRow3, XWinsColumn1, XWinsColumn2, XWinsColumn3, OWinsDiagonal1, OWinsDiagonal2, OWinsRow1, OWinsRow2, OWinsRow3, OWinsColumn1, OWinsColumn2, OWinsColumn3]

testAllWinners.forEach((boardToTest) => (console.log(boardToTest.toString(), checkWinState(boardToTest))))


console.log(Object.values(tie).length)