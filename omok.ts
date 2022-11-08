// omok.ts

class Omok {
    readonly blackStone: number = 1;
    readonly whiteStone: number = 2;
    readonly board: number[][] = [];
    private numOfStonePutOnBoard: number = 0;

    constructor(boardSize: number) {
        for (let i = 0; i < boardSize; i++) {
            this.board[i] = [];
            for (let j = 0; j < boardSize; j++) {
                this.board[i][j] = 0;
            }
        }
    }

    putStoneOnBoard(xpos: number, ypos: number, stone: number) {
        this.board[ypos][xpos] = stone;
        this.numOfStonePutOnBoard++;
    }

    canPutStoneOnBoard(xpos: number, ypos: number) {
        if (this.isOverBoundary(xpos, ypos)) {
            return false;
        } else if (this.isFilledPosition(xpos, ypos)) {
            return false;
        }
        return true;
    }

    private isOverBoundary(xpos: number, ypos: number) {
        return 0 > xpos || xpos >= this.board.length ||
            0 > ypos || ypos >= this.board.length;
    }

    private isFilledPosition(xpos: number, ypos: number) {
        return this.board[ypos][xpos] !== 0;
    }

    isCompletedGameEndCondition(xpos: number, ypos: number) {
        if (this.isDiagonalLineOmok(xpos, ypos)) {
            return true;
        } else if (this.isHorizontalLineOmok(xpos, ypos)) {
            return true;
        } else if (this.isVerticalLineOmok(xpos, ypos)) {
            return true;
        } else if (this.cannotPutStoneOnBoard()) {
            return true;
        }
        return false;
    }

    private isDiagonalLineOmok(xpos: number, ypos: number) {
        if (this.isUpwardDiagonalLineOmok(xpos, ypos)) {
            return true;
        } else if (this.isDownwardDiagonalLineOmok(xpos, ypos)) {
            return true;
        }
        return false;
    }

    private isUpwardDiagonalLineOmok(xpos: number, ypos: number) {
        const moveToStart = Math.min(xpos, this.board.length - ypos) - 1;
        const startX = xpos - moveToStart;
        const startY = ypos + moveToStart;

        const moveToEnd = Math.min(this.board.length - xpos, ypos) - 1;
        const endX = xpos + moveToEnd;
        const endY = ypos - moveToEnd;

        let numOfConsecutiveStoneOfSameColor = 0;
        let stone = 0;
        for (let x = startX, y = startY; x <= endX && y >= endY; x++, y--) {
            if (stone !== 0 && this.board[y][x] === stone) {
                numOfConsecutiveStoneOfSameColor++;
            } else if (stone === 0 && this.board[y][x] > 0) {
                numOfConsecutiveStoneOfSameColor++;
                stone = this.board[y][x];
            } else {
                numOfConsecutiveStoneOfSameColor = 0;
                stone = this.board[y][x];
            }

            if (numOfConsecutiveStoneOfSameColor === 5) {
                return true;
            }
        }
        return false;
    }

    private isDownwardDiagonalLineOmok(xpos: number, ypos: number) {
        const moveToStart = Math.min(xpos, ypos) - 1;
        const startX = xpos - moveToStart;
        const startY = ypos - moveToStart;

        const moveToEnd =
            Math.min(this.board.length - xpos, this.board.length - ypos) - 1;
        const endX = xpos + moveToEnd;
        const endY = ypos + moveToEnd;

        let numOfConsecutiveStoneOfSameColor = 0;
        let stone = 0;
        for (let x = startX, y = startY; x <= endX && y <= endY; x++, y++) {
            if (stone !== 0 && this.board[y][x] === stone) {
                numOfConsecutiveStoneOfSameColor++;
            } else if (stone === 0 && this.board[y][x] > 0) {
                numOfConsecutiveStoneOfSameColor++;
                stone = this.board[y][x];
            } else {
                numOfConsecutiveStoneOfSameColor = 0;
                stone = this.board[y][x];
            }

            if (numOfConsecutiveStoneOfSameColor === 5) {
                return true;
            }
        }
        return false;
    }

    private isHorizontalLineOmok(xpos: number, ypos: number) {
        let numOfConsecutiveStoneOfSameColor = 0;
        let stone = 0;

        for (let x = 0, y = ypos; x <= this.board.length - 1; x++) {
            if (stone !== 0 && this.board[y][x] === stone) {
                numOfConsecutiveStoneOfSameColor++;
            } else if (stone === 0 && this.board[y][x] > 0) {
                numOfConsecutiveStoneOfSameColor++;
                stone = this.board[y][x];
            } else {
                numOfConsecutiveStoneOfSameColor = 0;
                stone = this.board[y][x];
            }

            if (numOfConsecutiveStoneOfSameColor === 5) {
                return true;
            }
        }

        return false;
    }

    private isVerticalLineOmok(xpos: number, ypos: number) {
        let numOfConsecutiveStoneOfSameColor = 0;
        let stone = 0;

        for (let x = xpos, y = 0; y <= this.board.length - 1; y++) {
            if (stone !== 0 && this.board[y][x] === stone) {
                numOfConsecutiveStoneOfSameColor++;
            } else if (stone === 0 && this.board[y][x] > 0) {
                numOfConsecutiveStoneOfSameColor++;
                stone = this.board[y][x];
            } else {
                numOfConsecutiveStoneOfSameColor = 0;
                stone = this.board[y][x];
            }

            if (numOfConsecutiveStoneOfSameColor === 5) {
                return true;
            }
        }

        return false;
    }

    private cannotPutStoneOnBoard() {
        return this.numOfStonePutOnBoard === this.board.length ** 2;
    }

    //todo: will delete
    printBoard() {
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                process.stdout.write("" + this.board[i][j]);
            }
            console.log("");
        }
    }
}

export { Omok };