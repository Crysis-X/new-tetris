const FIGURES = [
  [[1, 1, 1, 1]], // I
  [
    [1, 1],
    [1, 1],
  ], // O
  [
    [0, 1, 0],
    [1, 1, 1],
  ], // T
  [
    [1, 1, 0],
    [0, 1, 1],
  ], // S
  [
    [0, 1, 1],
    [1, 1, 0],
  ], // Z
  [
    [1, 1, 1],
    [1, 0, 0],
  ], // L
  [
    [1, 1, 1],
    [0, 0, 1],
  ], // J
];

export type Board = number[][];

export class Tetris {
  private board: Board;
  private score: number = 0;
  private speed = 500;
  private update: (board: Board) => void;
  private figure: { figure: number[][]; x: number; y: number };
  private intervalId: number | null = null;
  private w: number;
  private h: number;
  constructor(w: number, h: number, update: (board: Board) => void) {
    this.w = w;
    this.h = h;
    this.board = Array.from({ length: this.h }, () => Array(this.w).fill(0));
    this.update = update;
    this.figure = this.spawn();
  }
  getSpeed = () => this.speed;
  setSpeed = (speed: number) => {
    this.speed = speed;
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = this.createInterval(this.intervalCallback);
  };
  private intervalCallback = () => this.fall();
  private createInterval = (fn: Function) => {
    const id = setInterval(() => fn(), this.speed);
    return id;
  };
  start() {
    this.updateGameState();
    this.intervalId = this.createInterval(this.intervalCallback);
    addEventListener("keydown", this.handle);
  }

  stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    removeEventListener("keydown", this.handle);
  }
  getScore = () => this.score;
  private spawn() {
    const figure = FIGURES[Math.floor(Math.random() * FIGURES.length)];
    return { figure, x: Math.floor(this.w / 2) - 1, y: 0 };
  }

  private handle = (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowLeft":
        this.move(-1);
        break;
      case "ArrowRight":
        this.move(1);
        break;
      case "ArrowDown":
        this.fall();
        break;
      case "ArrowUp":
        this.rotate();
        break;
    }
  };
  private fall() {
    if (
      !this.isCollision(this.figure.figure, this.figure.x, this.figure.y + 1)
    ) {
      this.figure.y++;
    } else {
      this.lockFigure();
      this.figure = this.spawn();
      this.clearFullLines();
    }
    this.updateGameState();
  }

  private move(direction: number) {
    if (
      !this.isCollision(
        this.figure.figure,
        this.figure.x + direction,
        this.figure.y,
      )
    ) {
      this.figure.x += direction;
      this.updateGameState();
    }
  }

  private rotate() {
    const rotated = this.figure.figure[0].map((_, i) =>
      this.figure.figure.map((line) => line[i]).reverse(),
    );

    if (!this.isCollision(rotated, this.figure.x, this.figure.y)) {
      this.figure.figure = rotated;
      this.updateGameState();
    }
  }

  private isCollision(figure: number[][], x: number, y: number): boolean {
    return figure.some((line, rowIndex) =>
      line.some(
        (cell, colIndex) =>
          cell &&
          (x + colIndex < 0 ||
            x + colIndex >= this.w ||
            y + rowIndex >= this.h ||
            this.board[y + rowIndex]?.[x + colIndex]),
      ),
    );
  }

  private lockFigure() {
    this.figure.figure.forEach((line, rowIndex) =>
      line.forEach((cell, colIndex) => {
        if (cell) {
          this.board[this.figure.y + rowIndex][this.figure.x + colIndex] = 1;
        }
      }),
    );
  }

  private clearFullLines() {
    this.board = this.board.filter((line) => line.includes(0));
    this.score += (this.h - this.board.length) * 100;
    while (this.board.length < this.h) {
      this.board.unshift(Array(this.w).fill(0));
    }
  }

  private updateGameState() {
    const displayBoard = this.board.map((line) => [...line]);

    this.figure.figure.forEach((line, rowIndex) =>
      line.forEach((cell, colIndex) => {
        if (cell) {
          displayBoard[this.figure.y + rowIndex][this.figure.x + colIndex] =
            cell;
        }
      }),
    );

    this.update(displayBoard);
  }
}
