export enum State {
    GAMEPLAY,
    GAMEOVER,
    GAEMRESTART_CHECK
}

export enum Player {
    NONE = 0,
    WHITE = 1,
    BLACK = 2
}

export enum PlayResult {
    SUCCESS,
    FAIL,
    OMOK,
    DRAW
}

export class OmokGameSystem {
    private gameState: State;
    private ownerPlayer: Player;
    private playResult: PlayResult;
    private winnerPlayer: Player;

    constructor() {
        this.gameState = State.GAMEPLAY;
        this.ownerPlayer = Player.BLACK;
        this.playResult = PlayResult.SUCCESS;
        this.winnerPlayer = Player.NONE;
    }

    get owner() { return this.ownerPlayer; }
    get state() { return this.gameState; }
    get result() { return this.playResult; }
    get winner() { return this.winnerPlayer; }

    set state(gameState: State) { this.gameState = gameState; }
    set result(playResult: PlayResult) { this.playResult = playResult; }
    set winner(winnerPlayer: Player) { this.winnerPlayer = winnerPlayer; }

    flipOwner() {
        return this.ownerPlayer =
            this.ownerPlayer === Player.WHITE ? Player.BLACK : Player.WHITE;
    }
}