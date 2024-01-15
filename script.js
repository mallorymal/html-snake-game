const DIRECTIONS = {
  LEFT: 'left',
  RIGHT: 'right',
  UP: 'up',
  DOWN: 'down',
};

const OPPOSITE_DIRECTION = {
  [DIRECTIONS.LEFT]: DIRECTIONS.RIGHT,
  [DIRECTIONS.RIGHT]: DIRECTIONS.LEFT,
  [DIRECTIONS.UP]: DIRECTIONS.DOWN,
  [DIRECTIONS.DOWN]: DIRECTIONS.UP,
};

const ARROW_KEYS_TO_DIRECTION = {
  ArrowLeft: DIRECTIONS.LEFT,
  ArrowRight: DIRECTIONS.RIGHT,
  ArrowUp: DIRECTIONS.UP,
  ArrowDown: DIRECTIONS.DOWN,
};

const game = document.getElementById('game');
const message = document.getElementById('message');

const gameWidth = game.clientWidth;
const gameHeight = game.clientHeight;
const PIXEL_SIZE = document.getElementById('snake').clientWidth;
const MAX_PIXELS = gameWidth / PIXEL_SIZE;
const MAX_SNAKE_LENGTH = MAX_PIXELS * MAX_PIXELS;

// STATE
const snakePositions = [
  {
    left: '0px',
    top: '0px',
  },
];
let currentDirection = DIRECTIONS.RIGHT;

const areThereFood = (newPosition) => {
  const food = document.getElementById('food');
  const left = parseInt(food.style.left, 10);
  const top = parseInt(food.style.top, 10);
  return left === newPosition.left && top === newPosition.top;
};

const getNewPosition = (element, direction) => {
  const left = parseInt(element.style.left, 10) || 0;
  const top = parseInt(element.style.top, 10) || 0;
  switch (direction) {
    case DIRECTIONS.LEFT:
      return { left: left - PIXEL_SIZE, top };
    case DIRECTIONS.RIGHT:
      return { left: left + PIXEL_SIZE, top };
    case DIRECTIONS.UP:
      return { left, top: top - PIXEL_SIZE };
    case DIRECTIONS.DOWN:
      return { left, top: top + PIXEL_SIZE };
    default:
      return { left, top };
  }
};

const randomizeNaturalNumber = (max) => Math.floor(Math.random() * max);

const addNewFood = () => {
  const food = document.getElementById('food');
  const snakeBodies = Array.from(document.getElementsByClassName('snake-body'));
  food.classList.add('food');
  let newLeft = 0;
  let newTop = 0;
  do {
    newLeft = randomizeNaturalNumber(MAX_PIXELS) * PIXEL_SIZE;
    newTop = randomizeNaturalNumber(MAX_PIXELS) * PIXEL_SIZE;
  } while (
    snakeBodies.some((snakeBody) => {
      const left = parseInt(snakeBody.style.left, 10);
      const top = parseInt(snakeBody.style.top, 10);
      return left === newLeft && top === newTop;
    })
  );
  food.style.left = `${newLeft}px`;
  food.style.top = `${newTop}px`;
  return true;
};

const addSnakeBody = () => {
  const snakeBody = document.createElement('div');
  snakeBody.classList.add('snake-body');
  snakeBody.style.left = `${snakePositions[0].left}px`;
  snakeBody.style.top = `${snakePositions[0].top}px`;
  game.appendChild(snakeBody);
  return true;
};

let snakeMovingInterval = null;

const gameOver = () => {
  message.innerText = 'Game Over';
  clearInterval(snakeMovingInterval);
};

const isOutOfBound = (newPosition) => newPosition.left < 0 || newPosition.top < 0 || newPosition.left >= gameWidth || newPosition.top >= gameHeight;

const isCollision = (newPosition) => snakePositions.slice(1).some((snakePosition) => snakePosition.left === newPosition.left && snakePosition.top === newPosition.top);

const snakeMove = () => {
  const snakeHead = document.getElementById('snake');
  const newPosition = getNewPosition(snakeHead, currentDirection);

  if (isOutOfBound(newPosition) || isCollision(newPosition)) {
    gameOver();
    return;
  }
  const snakeBodies = Array.from(document.getElementsByClassName('snake-body'));

  snakePositions.push(newPosition);
  if (snakePositions.length > snakeBodies.length) {
    snakePositions.shift();
  }

  snakeBodies.forEach((snakeBody, index) => {
    const position = snakePositions[snakePositions.length - 1 - index];
    snakeBody.style.left = `${position.left}px`;
    snakeBody.style.top = `${position.top}px`;
  });

  if (areThereFood(newPosition)) {
    addSnakeBody();
    if (snakeBodies.length === MAX_SNAKE_LENGTH) {
      message.innerText = 'You Win!';
      clearInterval(snakeMovingInterval);
      return;
    }
    addNewFood();
  }
};

const setSnakeMoveInterval = () => {
  snakeMovingInterval = setInterval(() => {
    snakeMove();
  }, 600);
};

const initializeGame = () => {
  const snake = document.getElementById('snake');
  snake.style.left = '0px';
  snake.style.top = '0px';
  addNewFood();
  setSnakeMoveInterval();
};

initializeGame();

const handleArrowKeyDown = (event) => {
  const direction = ARROW_KEYS_TO_DIRECTION[event.key];
  if (direction && currentDirection !== direction && currentDirection !== OPPOSITE_DIRECTION[direction]) {
    currentDirection = direction;
  }
};

document.addEventListener('keydown', handleArrowKeyDown);
