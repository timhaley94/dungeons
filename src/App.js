import React, { useState } from 'react';
import { List } from 'immutable';
import classNames from 'classnames';
import { generateDungeon } from './dungeon';
import styles from './App.module.css';

function range(length) {
  return [ ...Array(length).keys() ];
}

const WIDTH = 150;
const HEIGHT = 50;

const {
  start: initStart,
  end: initEnd,
  steps: initSteps
} = generateDungeon({
  width: WIDTH,
  height: HEIGHT
});

const App = () => {
  const [start, setStart] = useState(initStart);
  const [end, setEnd] = useState(initEnd);
  const [steps, setSteps] = useState(initSteps);

  const generate = () => {
    const {
      start: newStart,
      end: newEnd,
      steps: newSteps
    } = generateDungeon({
      width: WIDTH,
      height: HEIGHT
    });

    setStart(newStart);
    setEnd(newEnd);
    setSteps(newSteps);
  };

  return (
    <div className={ styles.container }>
      {
        range(HEIGHT).map(
          y => (
            <div key={ `row--${y}` } className={ styles.row }>
              {
                range(WIDTH).map(
                  x => (
                    <div
                      key={ `cell--${x}--${y}` }
                      className={
                        classNames(
                          styles.cell,
                          {
                            [styles.active]: steps.has(List([x, y])),
                            [styles.start]: List([x, y]).equals(start),
                            [styles.end]: List([x, y]).equals(end)
                          }
                        )
                      }
                    />
                  )
                )
              }
            </div>
          )
        )
      }
      <button
        className={ styles.button }
        onClick={ () => generate() }
      >
        Generate!
      </button>
    </div>
  );
};

export default App;
