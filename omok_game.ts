import { Omok } from './omok';
import * as Game from './omok_game_system';
import * as readline from 'readline';
import * as dotenv from 'dotenv';

async function run(): Promise<void> {
    const omokGameObject = initGame();
    await playGame(
        omokGameObject.omok, omokGameObject.game, omokGameObject.readLine);
    endGame(omokGameObject.readLine);
}

function initGame(): {
    omok: Omok;
    game: Game.OmokGameSystem;
    readLine: readline.Interface;
} {
    dotenv.config();

    const omok = new Omok(Number(process.env.BOARD_SIZE));
    const game = new Game.OmokGameSystem();
    const readLine = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    formatToConsoleOmokBoard(omok);

    return { omok, game, readLine };
}

async function playGame(
    omok: Omok, game: Game.OmokGameSystem, readLine: readline.Interface)
    : Promise<void> {
    while (game.state !== Game.State.GAMEOVER) {
        try {
            const inputStr = await input(readLine, game);
            update(inputStr, omok, game);
            render(omok, game);
        } catch (error) {
            console.log(error + ": 잘못된 입력입니다");
        }
    }
}

function endGame(readLine: readline.Interface) {
    readLine.close();
}

function input(readLine: readline.Interface, game: Game.OmokGameSystem)
    : Promise<string> {
    switch (game.state) {
        case Game.State.GAEMRESTART_CHECK:
            return inputToGameRestartCheck(readLine, game);

        default:
            return inputToGamePlay(readLine, game);
    }
}

function update(inputStr: string, omok: Omok, game: Game.OmokGameSystem): void {
    switch (game.state) {
        case Game.State.GAEMRESTART_CHECK:
            gameRestartOrEnd(inputStr, omok, game);
            break;

        default: //gameplay
            gamePlayUpdate(inputStr, omok, game);
            break;
    }
}

function render(omok: Omok, game: Game.OmokGameSystem): void {
    switch (game.state) {
        case Game.State.GAMEOVER:
            console.log('오목 게임이 완전히 종료되었습니다.');
            break;

        default: //gameplay
            formatToConsoleOmokBoard(omok);
            printGameMessage(game);
    }
}

function inputToGameRestartCheck(
    readLine: readline.Interface, game: Game.OmokGameSystem): Promise<string> {
    const questionText = '게임이 종료되었습니다. 다시 시작하시겠습니까? (y/n)';

    return new Promise<string>((resolve, reject) => {
        readLine.question(questionText, function (inputStr) {
            if (inputStr.match(/[^yn]/)) {
                reject(inputStr);
            } else if (inputStr.length !== 1) {
            } else {
                resolve(inputStr);
            }
        });
    })
}

function inputToGamePlay(
    readLine: readline.Interface, game: Game.OmokGameSystem)
    : Promise<string> {
    const questionText = (game.owner === Game.Player.BLACK ?
        '검은 돌 차례입니다.' : '흰 돌 차례입니다.') +
        '\n좌표를 입력해주세요 (x y) ';

    return new Promise<string>((resolve, reject) => {
        readLine.question(questionText, function (inputStr) {
            if (inputStr.match(/[^0-9\s]/)) {
                reject(inputStr);
            } else if (inputStr.split(' ').length !== 2) {
                reject(inputStr);
            } else {
                resolve(inputStr);
            }
        });
    })
}



function gameRestartOrEnd(inputStr: string, omok: Omok, game: Game.OmokGameSystem): void {
    if (inputStr === 'n') {
        game.state = Game.State.GAMEOVER;
    } else {
        game.initialize();
        omok.initialize(omok.board.length);
    }
}

function gamePlayUpdate(inputStr: string, omok: Omok, game: Game.OmokGameSystem)
    : void {
    const position = inputStr.split(' ', 2)
        .map((item) => { return parseInt(item); });

    const x = position[0];
    const y = position[1];

    if (omok.canPutStoneOnBoard(x, y)) {
        omok.putStoneOnBoard(x, y);
        gameSystemUpdate(Game.PlayResult.SUCCESS, omok, game, x, y);
    } else {
        gameSystemUpdate(Game.PlayResult.FAIL, omok, game, x, y);
    }
}

function gameSystemUpdate(
    result: Game.PlayResult,
    omok: Omok,
    game: Game.OmokGameSystem,
    xpos: number,
    ypos: number): void {
    if (omok.isOmok(xpos, ypos)) {
        game.result = Game.PlayResult.OMOK;
        game.winner = game.owner;
        game.state = Game.State.GAEMRESTART_CHECK;
    } else if (omok.isFilledFullBoard()) {
        game.result = Game.PlayResult.DRAW;
        game.state = Game.State.GAEMRESTART_CHECK;
    } else {
        game.result = result;
    }

    if (game.result !== Game.PlayResult.FAIL) {
        game.flipOwner();
        omok.flipStone();
    }
}

function formatToConsoleOmokBoard(omok: Omok): void {
    let omokConsoleBoard: string[] = [];
    for (let i = 0; i < omok.board.length; i++) {
        let boardLine: string = '';
        for (let j = 0; j < omok.board.length; j++) {
            if (omok.board[i][j] > 0) {
                boardLine += getPlayerStoneSymbol(omok.board[i][j]);
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

function getPlayerStoneSymbol(player: Game.Player): string {
    return player === Game.Player.BLACK ? '○' : '●';
}

function getLineSymbol(xpos: number, ypos: number, length: number): string {
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

function printGameMessage(game: Game.OmokGameSystem): void {
    switch (game.result) {
        case Game.PlayResult.SUCCESS:
            break;

        case Game.PlayResult.FAIL:
            console.log('잘못된 값을 입력하였습니다.');
            break;

        case Game.PlayResult.OMOK:
            console.log('오목입니다!');
            const winnerPlayer =
                game.winner === Game.Player.BLACK ? '검은 돌' : '흰 돌';
            console.log('승자는 \'' + winnerPlayer + '\' 입니다!');
            break;

        case Game.PlayResult.DRAW:
            console.log('더 이상 게임을 진행할 수 없습니다.');
            console.log('비겼습니다!');
            break;
    }
}

run();