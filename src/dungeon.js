import { List, Set } from 'immutable';

const UP = 'up';
const DOWN = 'down';
const LEFT = 'left';
const RIGHT = 'right';

function randomNumber(min, max) {
  return Math.floor(Math.random() * max) + min;
}

function randomElementFromList(array) {
  const i = randomNumber(0, array.size);
  return array.get(i);
}

function randomElement(array) {
  const i = randomNumber(0, array.length);
  return array[i];
}

function range(length) {
  return [ ...Array(length).keys() ];
}

function validDirections({
  width,
  height,
  x,
  y,
}) {
  const directions = [];

  if (y > 1) {
    directions.push(DOWN);
  }

  if (y < height - 2) {
    directions.push(UP);
  }

  if (x > 1) {
    directions.push(LEFT);
  }

  if (x < width - 2) {
    directions.push(RIGHT);
  }

  return directions;
}

export function randomWalk({
  width,
  height,
  initX,
  initY,
  changeProb,
  stepCount
}) {
  if (initX < 0 || initX >= width) {
    throw Error('initX is outside of x dimensions.');
  }

  if (initY < 0 || initY >= height) {
    throw Error('initY is outtside of y dimensions.');
  }

  let dir = randomElement([ UP, DOWN, LEFT, RIGHT ]);
  let x = initX;
  let y = initY;

  let steps = Set();

  const recordStep = (x, y) => {
    steps = steps.add(
      List([x, y])
    )
  };

  recordStep(x, y);

  range(stepCount).forEach(() => {
    const opts = validDirections({
      width,
      height,
      x,
      y
    });

    if (!opts.includes(dir) || Math.random() <= changeProb) {
      dir = randomElement(opts);
    }

    if (dir === UP) {
      y = y + 1;
    }

    if (dir === DOWN) {
      y = y - 1;
    }

    if (dir === RIGHT) {
      x = x + 1;
    }

    if (dir === LEFT) {
      x = x - 1;
    }

    recordStep(x, y);
  });

  return steps;
}

function mainPath({ width, height, changeProb }) {
  let x = 1;
  let y = randomNumber(1, height - 2);

  const getOpts = () => (
    validDirections({
      width,
      height,
      x,
      y
    }).filter(d => d !== LEFT)
  );

  let dir = randomElement(getOpts());
  let steps = Set();

  const recordStep = (x, y) => {
    steps = steps.add(
      List([x, y])
    )
  };

  const start = List([0, y]);

  recordStep(0, y)
  recordStep(1, y);

  let i = 0;

  while (x < width - 2) {
    if (i > 10000) {
      throw Error('mainPath loop cannot finish execution');
    }

    const opts = getOpts();

    if (!opts.includes(dir) || Math.random() < changeProb) {
      dir = randomElement(opts);
    }

    if (dir === UP) {
      y = y + 1;
    }

    if (dir === DOWN) {
      y = y - 1;
    }

    if (dir === RIGHT) {
      x = x + 1;
    }

    recordStep(x, y);

    i++;
  }

  recordStep(x + 1, y);
  const end = List([x + 1, y]);

  return {
    start,
    end,
    steps
  };
}

export function generateDungeon({ width, height }) {
  const {
    start,
    end,
    steps: main
  } = mainPath({
    width,
    height,
    changeProb: 0.1
  });

  const temp = main.toList();
  const walks = range(10).map(
    () => {
      const start = randomElementFromList(temp);
      const initX = start.get(0);
      const initY = start.get(1);

      return randomWalk({
        width,
        height,
        initX,
        initY,
        changeProb: 0.5,
        stepCount: 1000
      });
    }
  );

  return {
    start,
    end,
    steps: walks.reduce(
      (acc, val) => acc.union(val),
      main
    )
  };
}
