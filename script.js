let board = ["","","","","","","","",""];
let human = "X";
let ai = "O";
let currentPlayer = human;
let gameOver = false;

const winCombos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

const boardDiv = document.getElementById("board");
const message = document.getElementById("message");

function createBoard() {
    boardDiv.innerHTML = "";
    board.forEach((cell, idx) => {
        const div = document.createElement("div");
        div.classList.add("cell");
        if(cell) div.classList.add(cell);
        div.textContent = cell;
        div.addEventListener("click", () => makeMove(idx));
        boardDiv.appendChild(div);
    });
}

function makeMove(idx) {
    if(board[idx]==="" && !gameOver && currentPlayer===human) {
        board[idx] = human;
        if(checkWinner(human)) {
            message.textContent = "You win!";
            gameOver = true;
        } else if(board.every(c=>c!=="")) {
            message.textContent = "It's a draw!";
            gameOver = true;
        } else {
            currentPlayer = ai;
            createBoard();
            setTimeout(aiMove, 200); // small delay for realism
        }
        createBoard();
    }
}

function aiMove() {
    let bestMoveIdx = minimax(board, ai).index;
    board[bestMoveIdx] = ai;
    if(checkWinner(ai)) {
        message.textContent = "AI wins!";
        gameOver = true;
    } else if(board.every(c=>c!=="")) {
        message.textContent = "It's a draw!";
        gameOver = true;
    } else {
        currentPlayer = human;
    }
    createBoard();
}

// Minimax function
function minimax(newBoard, player) {
    let availSpots = newBoard.map((c,i)=>c===""?i:null).filter(v=>v!==null);

    if(checkWinnerMinimax(newBoard, human)) return {score: -10};
    else if(checkWinnerMinimax(newBoard, ai)) return {score: 10};
    else if(availSpots.length === 0) return {score: 0};

    let moves = [];

    for(let i=0;i<availSpots.length;i++) {
        let move = {};
        move.index = availSpots[i];
        newBoard[availSpots[i]] = player;

        if(player===ai) {
            let result = minimax(newBoard, human);
            move.score = result.score;
        } else {
            let result = minimax(newBoard, ai);
            move.score = result.score;
        }

        newBoard[availSpots[i]] = "";
        moves.push(move);
    }

    let bestMove;
    if(player===ai) {
        let bestScore = -10000;
        for(let i=0;i<moves.length;i++) {
            if(moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = moves[i];
            }
        }
    } else {
        let bestScore = 10000;
        for(let i=0;i<moves.length;i++) {
            if(moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = moves[i];
            }
        }
    }
    return bestMove;
}

// Check winner for Minimax (without modifying board)
function checkWinnerMinimax(boardState, player) {
    return winCombos.some(combo => combo.every(idx => boardState[idx]===player));
}

function checkWinner(player) {
    return winCombos.some(combo => combo.every(idx => board[idx]===player));
}

function resetGame() {
    board = ["","","","","","","","",""];
    currentPlayer = human;
    gameOver = false;
    message.textContent = "";
    createBoard();
}

createBoard();
