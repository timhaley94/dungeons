import { List, Range } from 'immutable';
import { generate as generateLayout } from './modules/layout';
import { register as registerUI } from './modules/interface';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PLAYER_WIDTH,
  CELL_WIDTH,
  CELLS_HORIZONTALLY_ON_CANVAS,
  CELLS_VERTICALLY_ON_CANVAS
} from './config';

const {
  start,
  stop,
  steps
} = generateLayout({
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
ctx.translate(0, -100);
// TODO: Get rid of this. I added this to compensate
// because the code thinks the canvas is 100px taller
// than it is.

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

  if (List([x, y]).equals(start)) {
    ctx.fillStyle = '#D8BFD8';
  } else if (List([x, y]).equals(stop)) {
    ctx.fillStyle = '#D8BFD8';
  } else {
    ctx.fillStyle = '#FAEBD7';
  }

  const {
    canvasX,
    canvasY
  } = canvasCoordFromPosition(
    positionFromCell({
      cellX: x,
      cellY: y
    })
  );

  ctx.fillRect(
    Math.floor(canvasX),
    Math.floor(canvasY),
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

registerUI(
  ({ dx, dy }) => {
    playerMapX += dx;
    playerMapY += dy;
  }
);

export default main;
