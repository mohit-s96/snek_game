import Board from "./board";
import Snake from "./snake";
import "./style.css";
import { Vector, MoveType } from "./types";

//globals
const app = document.querySelector<HTMLDivElement>("#app")!;
const changeBoardBorderBtn =
  document.querySelector<HTMLButtonElement>("#change-border")!;
const highScore = document.querySelector<HTMLDivElement>("#high-score")!;
const score = document.querySelector<HTMLDivElement>("#score")!;
const snakeSpeed = document.querySelector<HTMLDivElement>("#snake-speed")!;
const snakeLength = document.querySelector<HTMLDivElement>("#snake-length")!;

const board = new Board();
board.init(app);
setHighScore();

function setHighScore() {
  highScore.textContent = board.highScore + "";
}

const snake = new Snake();

const MULTIPLE = board.render_speed;
let currentDirection: MoveType = "right";

changeBoardBorderBtn.onclick = () => {
  if (board.showGrids) {
    board.updateAllSquares((x) => {
      x.style.border = "";
    });
    board.showGrids = false;
  } else {
    board.updateAllSquares((x) => {
      x.style.border = "1px solid #aaa";
    });
    board.showGrids = true;
  }
};

function resetSquareColor(pos: Vector) {
  board.updateSquareAtPosition(pos, (square) => {
    square.style.backgroundColor = "#fff";
  });
}

function resolveMoves(move: MoveType, head: Vector) {
  switch (move) {
    case "right":
      currentDirection = "right";
      return {
        x: (head.x + 1 + board.board_width) % board.board_width,
        y: head.y,
      };
    case "down":
      currentDirection = "down";
      return {
        x: head.x,
        y: (head.y + 1 + board.board_height) % board.board_height,
      };
    case "left":
      currentDirection = "left";
      return {
        x: (head.x - 1 + board.board_width) % board.board_width,
        y: head.y,
      };
    case "up":
      currentDirection = "up";
      return {
        x: head.x,
        y: (head.y - 1 + board.board_height) % board.board_height,
      };
    default:
      return head;
  }
}

function checkSelfBite(state: Vector[], head: Vector) {
  let vec: Vector | null = null;
  let len = state.length;
  for (let i = 0; i < len - 1; i++) {
    if (state[i].x === head.x && state[i].y === head.y) {
      vec = state[i];
      break;
    }
  }

  return vec;
}

function resolveSpeed() {
  let i = Math.floor(snake.getLength() / 10);
  let multiplier = MULTIPLE;
  while (i) {
    multiplier -= 10;
    i--;
  }
  if (multiplier) board.render_speed = multiplier;
}

function checkValidFoodSquare() {
  if (board.getFoodLocation()) {
    board.updateSquareAtPosition(board.getFoodLocation()!, (square) => {
      if (square.style.backgroundColor !== "green") {
        square.style.backgroundColor = "green";
      }
    });
  }
}

function updateSnakePosition(move: MoveType) {
  const currentState = snake.getCurrentState();
  const tail = currentState.shift();
  resetSquareColor(tail!);
  const head = currentState[currentState.length - 1];
  let newHead: Vector = resolveMoves(move, head);
  currentState.push(newHead!);
  snake.updateState(currentState);
  let biteVector = checkSelfBite(currentState, newHead);
  if (biteVector) {
    const removedBody = snake.sliceSnek(biteVector);
    board.score -= removedBody.length;
    removedBody.forEach(resetSquareColor);
  }
  checkFoodCollision(snake.getCurrentHead());
  resolveSpeed();
}

function createFood() {
  board.createFood();
}

function checkFoodCollision(pos: Vector) {
  const foodPos = board.getFoodLocation();
  if (!foodPos) return;
  if (foodPos) {
    if (foodPos.x === pos.x && foodPos.y === pos.y) {
      const snakeState = snake.getCurrentState();
      const newHead = resolveMoves(currentDirection, pos);
      snakeState.push(newHead);
      snake.updateState(snakeState);
      createFood();

      board.score++;
    } else {
      return;
    }
  }
}

function render() {
  snake.getCurrentState().forEach((x) => {
    board.updateSquareAtPosition(x, (square) => {
      square.style.backgroundColor = "crimson";
    });
  });
}

function updateStats() {
  snakeLength.textContent = snake.getLength() + "";
  snakeSpeed.textContent =
    100 - board.render_speed ? 100 - board.render_speed + "" : "1";
  score.textContent = board.score + "";
  if (board.score > board.highScore!) {
    board.setHighScore();
  }
  setHighScore();
}

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowDown":
      if (currentDirection != "up" && currentDirection != "down")
        updateSnakePosition("down");
      break;
    case "ArrowUp":
      if (currentDirection != "down" && currentDirection != "up")
        updateSnakePosition("up");
      break;
    case "ArrowLeft":
      if (currentDirection != "right" && currentDirection != "left")
        updateSnakePosition("left");
      break;
    case "ArrowRight":
      if (currentDirection != "left" && currentDirection != "right")
        updateSnakePosition("right");
      break;
    default:
      break;
  }
});
createFood();
function gameLoop() {
  updateSnakePosition(currentDirection);
  checkValidFoodSquare();
  updateStats();
  render();
  setTimeout(gameLoop, board.render_speed);
}
gameLoop();
