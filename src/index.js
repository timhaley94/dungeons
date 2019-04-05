import { generateDungeon } from './dungeon';
import { List, Range } from 'immutable';

const CANVAS_WIDTH = 1500;
const CANVAS_HEIGHT = 900;

const PLAYER_WIDTH = 30;
const PLAYER_SPEED = 30;
const CELL_WIDTH = PLAYER_WIDTH * 5;

const CELLS_HORIZONTALLY_ON_CANVAS = CANVAS_WIDTH / CELL_WIDTH;
const CELLS_VERTICALLY_ON_CANVAS = CANVAS_HEIGHT / CELL_WIDTH;

const {
  start,
  // stop,
  steps
} = generateDungeon({
  width: 150,
  height: 50
});

let {
  mapX: playerMapX,
  mapY: playerMapY
} = positionFromCell({
  cellX: start.get(0),
  cellY: start.get(1)
});

function cellFromPosition({ mapX, mapY }) {
  return {
    cellX: Math.floor(mapX / CELL_WIDTH),
    cellY: Math.floor(mapY / CELL_WIDTH)
  };
}

function positionFromCell({ cellX, cellY }) {
  return {
    mapX: cellX * CELL_WIDTH,
    mapY: cellY * CELL_WIDTH
  };
}

function canvasCoordFromPosition({ mapX, mapY }) {
  const playerCanvasX = (CANVAS_WIDTH / 2) - (PLAYER_WIDTH / 2);
  const playerCanvasY = (CANVAS_HEIGHT / 2) - (PLAYER_WIDTH / 2);

  return {
    canvasX: playerCanvasX + (mapX - playerMapX),
    canvasY: playerCanvasY + (mapY - playerMapY)
  };
}

function getRelevantCells() {
  const {
    cellX,
    cellY
  } = cellFromPosition({
    mapX: playerMapX,
    mapY: playerMapY
  });

  const spreadX = (CELLS_HORIZONTALLY_ON_CANVAS / 2) + 1;
  const spreadY = (CELLS_VERTICALLY_ON_CANVAS / 2) + 1;

  const startX = cellX - spreadX;
  const startY = cellY - spreadY;

  const endX = cellX + spreadX;
  const endY = cellY + spreadY;

  return (
    Range(startX, endX + 1)
      .toList()
      .map(
        x => (
          Range(startY, endY + 1)
            .toList()
            .map(y => List([x, y]))
        )
      )
      .flatten(1)
      .filter(coord => steps.has(coord))
  );
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function clear() {
  ctx.globalCompositeOperation = 'destination-over';
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function renderWalls() {
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = '#A52A2A';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function renderFloor(x, y) {
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = '#FAEBD7';

  const {
    canvasX,
    canvasY
  } = canvasCoordFromPosition(
    positionFromCell({
      cellX: x,
      cellY: y
    })
  );

  console.log(
    canvasX,
    canvasY,
    CELL_WIDTH,
    CELL_WIDTH
  );

  ctx.fillRect(
    canvasX,
    canvasY,
    CELL_WIDTH,
    CELL_WIDTH
  );
}

function renderFloors() {
  const floors = getRelevantCells();

  floors.toJS().forEach(
    ([x, y]) => renderFloor(x, y)
  );
}

function renderPlayer() {
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = '#3CB371';
  ctx.fillRect(
    (CANVAS_WIDTH / 2) - (PLAYER_WIDTH / 2),
    (CANVAS_HEIGHT / 2) - (PLAYER_WIDTH / 2),
    PLAYER_WIDTH,
    PLAYER_WIDTH
  );
}

function render() {
  renderWalls();
  renderFloors();
  renderPlayer();
}

function main() {
  window.requestAnimationFrame(main);

  clear();
  render();
};

let left = false;
let right = false;
let up = false;
let down = false;

document.onkeydown = function(e) {
  switch (e.which) {
    case 37:
      left = true;
      break;
    case 38:
      up = true;
      break;
    case 39:
      right = true;
      break;
    case 40:
      down = true;
      break;
    default:
      break;
  }
};

document.onkeyup = function(e) {
  switch (e.which) {
    case 37:
      left = false;
      break;
    case 38:
      up = false;
      break;
    case 39:
      right = false;
      break;
    case 40:
      down = false;
      break;
    default:
      break;
  }
};

setInterval(
  () => {
    if (up) {
      playerMapY -= PLAYER_SPEED;
    }

    if (down) {
      playerMapY += PLAYER_SPEED;
    }

    if (left) {
      playerMapX -= PLAYER_SPEED;
    }

    if (right) {
      playerMapX += PLAYER_SPEED;
    }
  },
  33
);

main();
