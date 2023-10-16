class Game {
    constructor(turn, gameWidth, gameHeight) {
        this.turn = turn;
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.players = [];
        this.board = [];
        this.finished = false;
    }

    createBoard() {
        var documentBoard = document.getElementById("board");
        var table = document.createElement("table");
        documentBoard.appendChild(table);

        for (let i = 0; i < this.gameHeight; i++) {
            var row = document.createElement("tr");
            table.appendChild(row);
            for (let j = 0; j < this.gameWidth; j++) {
                var cell = document.createElement("td");
                row.appendChild(cell);

                cell.setAttribute("data-x", j);
                cell.setAttribute("data-y", i);

                cell.addEventListener("click", function(cell) {
                    return function() {
                        var x = parseInt(cell.getAttribute("data-x"));
                        var y = parseInt(cell.getAttribute("data-y"));

                        handleClick(x, y);
                    };
                }(cell));
            }
        }

        for (var i = 0; i < this.gameWidth; i++) {
            this.board[i] = [];

            for (var j = 0; j < this.gameHeight; j++) {
                this.board[i][j] = 0;
            }
        }
    }

    updateBoard() {
        var cells = document.querySelectorAll("td");

        for (let cell of cells) {
            var x = parseInt(cell.getAttribute("data-x"));
            var y = parseInt(cell.getAttribute("data-y"));
            if (this.board[x][y] != 0) {
                cell.textContent = this.players[this.board[x][y]].symbol;
            } else {
                cell.textContent = '';
            }
        }
    }

    checkBoard() {
        let winnerId;
        for (var i = 0; i < this.gameWidth; i++) {
            for (var j = 0; j < this.gameHeight; j++) {
                if (this.board[i][j] != 0) {
                    let checkResult = this.checkWinningCell(i, j)
                    if (checkResult != false) {
                        this.finished = true;
                        winnerId = checkResult;
                    }
                }
            }
        }
        if (this.finished) {
            this.declareVictory(winnerId);
        }
    }



    checkWinningCell(x, y) {
        // we check that we are still in the array limits
        if (x < 0 || x >= this.gameWidth || y < 0 || y >= this.gameHeight) {
            return null;
        }

        let ownerToCheck = this.board[x][y];
        let winningCombination = true;

        // Horizontal line
        if (x + 3 < this.gameWidth) { // we make sure that the combination is within the array limits
            for (let i = 1; i <= 3; i++) {
                if (this.board[x + i][y] !== ownerToCheck) {
                    winningCombination = false;
                    break;
                }
            }
        } else {
            winningCombination = false;
        }

        if (winningCombination) {
            return ownerToCheck;
        }

        winningCombination = true;

        // Vertical line
        if (y + 3 < this.gameHeight) { // we make sure that the combination is within the array limits
            for (let i = 1; i <= 3; i++) {
                if (this.board[x][y + i] !== ownerToCheck) {
                    winningCombination = false;
                    break;
                }
            }
        } else {
            winningCombination = false;
        }

        if (winningCombination) {
            return ownerToCheck;
        }

        winningCombination = true;

        // Lower diagonal
        if (x + 3 < this.gameWidth && y + 3 < this.gameHeight) { // we make sure that the combination is within the array limits
            for (let i = 1; i <= 3; i++) {
                if (this.board[x + i][y + i] !== ownerToCheck) {
                    winningCombination = false;
                    break;
                }
            }
        } else {
            winningCombination = false;
        }

        if (winningCombination) {
            return ownerToCheck;
        }

        winningCombination = true;

        // Upper diagonal
        if (x + 3 < this.gameWidth && y - 3 >= 0) { // we make sure that the combination is within the array limits
            for (let i = 1; i <= 3; i++) {
                if (this.board[x + i][y - i] !== ownerToCheck) {
                    winningCombination = false;
                    break;
                }
            }
        } else {
            winningCombination = false;
        }

        if (winningCombination) {
            return ownerToCheck;
        }

        return false; // no winning combination
    }


    declareVictory(winnerId) {
        var info = document.getElementById("info");
        info.textContent = "Victoire du joueur " + winnerId +" ("+this.players[winnerId].symbol+"). Cliquez ici pour recommencer le jeu.";
        info.addEventListener("click", function() {
            resetGame();
        });
    }

    clearBoard() {

        for (var i = 0; i < this.gameWidth; i++) {
            this.board[i] = [];

            for (var j = 0; j < this.gameHeight; j++) {
                this.board[i][j] = 0;
            }
        }

        this.updateBoard();
        this.updateInfo();
        this.finished = false;

    }


    addPlayer(playerToAdd) {
        this.players[playerToAdd.id] = playerToAdd;
    }

    updateInfo() {
        var info = document.getElementById("info");
        info.textContent = "C'est au joueur " + this.turn +" ("+this.players[this.turn].symbol+") de jouer";
    }




    placeToken(player, xTarget) {
        let currentHeight = this.gameHeight - 1;

        while (this.board[xTarget][currentHeight] != 0 && currentHeight >= 0) {
            currentHeight = currentHeight - 1;
        }

        if (this.board[xTarget][currentHeight] == 0) {
            this.board[xTarget][currentHeight] = player.id;
            this.turn = player.nextPlayer;
        } else if (currentHeight < 0) {

        }
    }
}

class Player {
    constructor(id, symbol) {
        this.id = id;
        this.symbol = symbol;
        this.nextPlayer = null;
    }
}

let game = new Game(1, 7, 6);
let player1 = new Player(1, "X");
let player2 = new Player(2, "O");

player1.nextPlayer = player2.id;
player2.nextPlayer = player1.id;

// functions called by listeners

function handleClick(x, y) {

    if (!game.finished) {
        game.placeToken(game.players[game.turn], x);
        game.updateInfo();
        game.updateBoard();
        game.checkBoard();
    }

}

function resetGame() {
    game.clearBoard();
}

function init() {

    game.addPlayer(player1);
    game.addPlayer(player2);
    game.createBoard();
    game.updateInfo();
}