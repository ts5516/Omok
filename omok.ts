export enum Stone {
    BLACK = 1,
    WHITE = 2
}

export class Omok {
    readonly board: number[][] = [];
    private numOfStonePutOnBoard: number;
    private nowStone: Stone;
    constructor(boardSize: number) {
        for (let i = 0; i < boardSize; i++) {
            this.board[i] = [];
            for (let j = 0; j < boardSize; j++) {
                this.board[i][j] = 0;
            }
        }
        this.numOfStonePutOnBoard = 0;
        this.nowStone = Stone.BLACK;
    }

    initialize(boardSize: number): void {
        for (let i = 0; i < boardSize; i++) {
            this.board[i] = [];
            for (let j = 0; j < boardSize; j++) {
                this.board[i][j] = 0;
            }
        }
        this.numOfStonePutOnBoard = 0;
        this.nowStone = Stone.BLACK;
    }

    putStoneOnBoard(xpos: number, ypos: number): void {
        this.board[ypos][xpos] = this.nowStone;
        this.numOfStonePutOnBoard++;
    }

    flipStone(): void {
        this.nowStone =
            this.nowStone === Stone.BLACK ? Stone.WHITE : Stone.BLACK;
    }

    canPutStoneOnBoard(xpos: number, ypos: number): boolean {
        if (this.isOverBoundary(xpos, ypos)) {
            return false;
        } else if (this.isFilledPosition(xpos, ypos)) {
            return false;
        } else if (this.isOverOmok(xpos, ypos)) {
            return false;
        }
        return true;
    }

    private isOverBoundary(xpos: number, ypos: number): boolean {
        return 0 > xpos || xpos >= this.board.length ||
            0 > ypos || ypos >= this.board.length;
    }

    private isFilledPosition(xpos: number, ypos: number): boolean {
        return this.board[ypos][xpos] !== 0;
    }

    private isOverOmok(xpos: number, ypos: number): boolean {
        this.board[ypos][xpos] = this.nowStone;
        const overOmokNum = this.getMaxNumOfConsecutiveStone(xpos, ypos);
        this.board[ypos][xpos] = 0;
        return overOmokNum > 5;
    }

    isFilledFullBoard(): boolean {
        return this.numOfStonePutOnBoard === this.board.length ** 2;
    }

    isOmok(xpos: number, ypos: number): boolean {
        return this.getMaxNumOfConsecutiveStone(xpos, ypos) === 5;
    }

    private getMaxNumOfConsecutiveStone(xpos: number, ypos: number): number {
        return Math.max(
            this.getDiagonalNumOfConsecutiveStone(xpos, ypos),
            this.getHorizontalNumOfConsecutiveStone(xpos, ypos),
            this.getVerticalNumOfConsecutiveStone(xpos, ypos)
        );
    }
    private getDiagonalNumOfConsecutiveStone(xpos: number, ypos: number)
        : number {
        return Math.max(
            this.getUpwardDiagonalNumOfConsecutiveStone(xpos, ypos),
            this.getDownwardDiagonalNumOfConsecutiveStone(xpos, ypos)
        );
    }

    private getUpwardDiagonalNumOfConsecutiveStone(xpos: number, ypos: number)
        : number {
        const moveLength = this.board.length - 1;
        const posAndStartDiff = Math.min(xpos, moveLength - ypos);
        const posAndEndDiff = Math.min(moveLength - xpos, ypos);

        const startX = xpos - posAndStartDiff;
        const startY = ypos + posAndStartDiff;
        const endX = xpos + posAndEndDiff;
        const endY = ypos - posAndEndDiff;

        const posArray =
            this.getPosArrayBetweenStartAndEnd(startX, startY, endX, endY);
        return this.getNumOfConsecutiveStone(posArray);
    }

    private getDownwardDiagonalNumOfConsecutiveStone(xpos: number, ypos: number)
        : number {
        const moveLength = this.board.length - 1;
        const posAndStartDiff = Math.min(xpos, ypos);
        const posAndEndDiff =
            Math.min(moveLength - xpos, moveLength - ypos);

        const startX = xpos - posAndStartDiff;
        const startY = ypos - posAndStartDiff;
        const endX = xpos + posAndEndDiff;
        const endY = ypos + posAndEndDiff;

        const posArray =
            this.getPosArrayBetweenStartAndEnd(startX, startY, endX, endY);
        return this.getNumOfConsecutiveStone(posArray);
    }

    private getHorizontalNumOfConsecutiveStone(xpos: number, ypos: number)
        : number {
        const posArray =
            this.getPosArrayBetweenStartAndEnd(
                0, ypos, this.board.length - 1, ypos);
        return this.getNumOfConsecutiveStone(posArray);
    }

    private getVerticalNumOfConsecutiveStone(xpos: number, ypos: number)
        : number {
        const posArray =
            this.getPosArrayBetweenStartAndEnd(
                xpos, 0, xpos, this.board.length - 1);
        return this.getNumOfConsecutiveStone(posArray);
    }

    private getNumOfConsecutiveStone(posArr: number[][]): number {
        let maxNumOfConsecutiveStone = 1;
        let numOfConsecutiveStone = 0;
        let stone = 0;

        for (const pos of posArr) {
            const y = pos[1];
            const x = pos[0];

            if (stone !== 0 && this.board[y][x] === stone) {
                numOfConsecutiveStone++;
            } else if (stone === 0 && this.board[y][x] > 0) {
                numOfConsecutiveStone++;
                stone = this.board[y][x];
            } else {
                maxNumOfConsecutiveStone =
                    Math.max(maxNumOfConsecutiveStone, numOfConsecutiveStone);
                numOfConsecutiveStone = 0;
                stone = this.board[y][x];
            }
        }
        return maxNumOfConsecutiveStone;
    }

    private getPosArrayBetweenStartAndEnd(startX: number, startY: number,
        endX: number, endY: number): number[][] {
        const arrX = this.getBetweenTwoPos(startX, endX);
        const arrY = this.getBetweenTwoPos(startY, endY);

        const lengthDiff = Math.abs(arrX.length - arrY.length);
        for (let i = 0; i < lengthDiff; i++) {
            if (arrX.length < arrY.length) {
                arrX.push(arrX[0]);
            } else {
                arrY.push(arrY[0]);
            }
        }

        let arrXY = [];
        for (let i = 0; i < arrX.length; i++) {
            arrXY.push([arrX[i], arrY[i]]);
        }

        return arrXY;
    }

    private getBetweenTwoPos(start: number, end: number): number[] {
        let arr = [];
        if (start > end) {
            for (let i = start; i >= end; i--) {
                arr.push(i);
            }
        } else {
            for (let i = start; i <= end; i++) {
                arr.push(i);
            }
        }

        return arr;
    }
}