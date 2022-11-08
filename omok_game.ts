//omokGame.ts
import { Omok } from './omok';
import * as readline from 'readline';

class GameOwner {
    private readonly whitePlayer: number = 1;
    private readonly blackPlayer: number = 2;
    private ownerPlayer: number;

    constructor() {
        this.ownerPlayer = this.whitePlayer;
    }

    get owner() { return this.ownerPlayer; }

    changeOwner() {
        return this.ownerPlayer =
            this.ownerPlayer === this.whitePlayer ?
                this.blackPlayer : this.whitePlayer;
    }
}
async function playGame() {

    const readLine = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let inputStr = '';
    const omok = new Omok(15);
    const game = new GameOwner();

    while (inputStr !== 'q') {
        try {
            inputStr = await input(readLine);
            update(inputStr, omok, game);
            render(omok);
        } catch (error) {
            console.log(error + ": 잘못된 입력입니다");
        }
    }

    process.exit(1);
}

function input(readLine: readline.Interface) {
    let questionText = '';

    questionText = '좌표를 입력해주세요(ex: x y) ';

    return new Promise<string>((resolve, reject) => {
        readLine.question(questionText, function (inputStr) {
            if (inputStr === 'q') {
                resolve(inputStr);
            } else if (inputStr.match(/[^0-9\s]/)) {
                reject(inputStr);
            } else if (inputStr.split(' ').length !== 2) {
                reject(inputStr);
            } else {
                resolve(inputStr);
            }
        });
    })
}

function update(inputStr: string, omok: Omok, game: GameOwner) {
    const position = inputStr.split(' ', 2)
        .map((item) => { return parseInt(item); });

    const x = position[0];
    const y = position[1];

    if (omok.canPutStoneOnBoard(x, y)) {
        omok.putStoneOnBoard(x, y, game.owner);
        game.changeOwner();
        if (omok.isCompletedGameEndCondition(x, y)) {
            console.log("오목입니다!");
        }
    } else {
        console.log("해당 자리에는 둘 수 없습니다!");
    }
}

function render(omok: Omok) {
    let omokConsoleBoard: string[] = [];
    for (let i = 0; i < omok.board.length; i++) {
        let boardLine: string = '';
        for (let j = 0; j < omok.board.length; j++) {
            if (omok.board[i][j] > 0) {
                boardLine += getStoneSymbol(omok.board[i][j]);
            } else {
                boardLine += getLineSymbol(j, i, omok.board.length - 1);
            }

            if (j !== omok.board.length - 1) {
                boardLine += '─';
            }
        }
        omokConsoleBoard.push(boardLine);
    }

    for (const str of omokConsoleBoard) {
        console.log(str);
    }
}

function getStoneSymbol(stone: number) {
    return stone === 1 ? '○' : '●';
}

function getLineSymbol(xpos: number, ypos: number, length: number) {
    if (ypos === 0) {
        if (xpos === 0) {
            return '┌';
        } else if (xpos === length) {
            return '┐';
        } else {
            return '┬';
        }
    } else if (ypos === length) {
        if (xpos === 0) {
            return '└';
        } else if (xpos === length) {
            return '┘';
        } else {
            return '┴';
        }
    } else {
        if (xpos === 0) {
            return '├';
        } else if (xpos === length) {
            return '┤';
        } else {
            return '┼';
        }
    }
}

playGame();