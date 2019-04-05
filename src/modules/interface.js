import { Set } from 'immutable';
import {
  PLAYER_SPEED,
  PLAYER_UPDATE_SPEED,
  LEFT,
  RIGHT,
  UP,
  DOWN
} from '../config';

function getDirFromKey(k) {
  switch (k) {
    case 37:
      return LEFT;
    case 38:
      return UP;
    case 39:
      return RIGHT;
    case 40:
      return DOWN;
    default:
      return null;
  }
}

export function register(cb) {
  let keys = Set();
  let interval;

  const getChange = () => {
    let xDir = 0;
    let yDir = 0;

    if (keys.has(LEFT)) {
      xDir -= 1;
    }

    if (keys.has(RIGHT)) {
      xDir += 1;
    }

    if (keys.has(UP)) {
      yDir -= 1;
    }

    if (keys.has(DOWN)) {
      yDir += 1;
    }

    const componentSpeed = (
      xDir !== 0 && yDir !== 0
        ? PLAYER_SPEED * (Math.sqrt(2) / 2)
        : PLAYER_SPEED
    );

    return {
      dx: componentSpeed * xDir,
      dy: componentSpeed * yDir
    };
  }

  const add = dir => {
    keys = keys.add(dir);

    if (!interval) {
      interval = setInterval(
        () => cb(getChange()),
        PLAYER_UPDATE_SPEED
      );
    }
  }

  const remove = dir => {
    keys = keys.delete(dir);

    if (keys.isEmpty()) {
      clearInterval(interval);
      interval = null;
    }
  }

  document.onkeydown = function(e) {
    const dir = getDirFromKey(e.which);

    if (dir) {
      add(dir);
    }
  };

  document.onkeyup = function(e) {
    const dir = getDirFromKey(e.which);

    if (dir) {
      remove(dir);
    }
  };
}
