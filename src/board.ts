import { Vector, UpdateSquareCallback } from "./types";

class Board {
  private boardArray: Array<Array<HTMLDivElement>> = [];
  private pixelSize = 12;
  private food: Vector | null = null;

  board_width = 80;
  board_height = 50;

  highScore: number | null = null;

  render_speed = 100;

  showGrids = false;

  score: number = 0;

  constructor() {
    for (let i = 0; i < this.board_height; i++) {
      this.boardArray.push([]);
      for (let j = 0; j < this.board_width; j++) {
        const square = document.createElement("div");

        this.boardArray[i][j] = square;

        square.style.position = "absolute";

        square.style.left = j * this.pixelSize + "px";
        square.style.top = i * this.pixelSize + "px";

        // square.style.border = "1px solid #aaa";

        square.style.width = this.pixelSize + "px";
        square.style.height = this.pixelSize + "px";
      }
    }
  }

  init(root: HTMLDivElement) {
    this.boardArray.forEach((x) => {
      x.forEach((y) => {
        root.appendChild(y);
      });
    });
    this.getHighScore();
  }

  getHighScore(score?: number) {
    const hs = score || JSON.parse(localStorage.getItem("hs") || "null");
    this.highScore = hs || 0;
  }

  setHighScore() {
    localStorage.setItem("hs", JSON.stringify(this.score));
    this.highScore = this.score;
  }

  getFoodLocation() {
    return this.food;
  }
  createFood() {
    const y = Math.floor(Math.random() * this.board_width);
    const x = Math.floor(Math.random() * this.board_height);
    this.boardArray[x][y].style.backgroundColor = "green";
    this.food = { x: y, y: x };
  }
  updateSquareAtPosition(position: Vector, callback: UpdateSquareCallback) {
    callback(this.boardArray[position.y][position.x]);
  }
  updateAllSquares(callback: UpdateSquareCallback) {
    this.boardArray.forEach((x) => {
      x.forEach((y) => callback(y));
    });
  }
}
export default Board;
