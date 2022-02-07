import React, { useReducer, useMemo } from "react";
import './css/puzzle.css';
import './css/main.css';
import Puzzle from "./Puzzle";
import Button from "./Button";
import { generateRandomPuzzle, puzzleReducer } from "./puzzle-logic";
import * as PuzzleUtils from "./puzzle-utils"
import { keyCellStates } from "./puzzle-logic";

const PuzzleStyleContext = React.createContext();
const PuzzleStateContext = React.createContext();

function App() {

  const solvedPuzzleData = {
    columnCount: 5,
    rowCount: 5,
    solvedPuzzle: generateRandomPuzzle(5, 5)
  }

  const initalBoardState =
    solvedPuzzleData.solvedPuzzle
      .map((cellArray) => new Array(cellArray.length).fill(0));


  const puzzleStyle = {
    cellSize: 35
  }

  const puzzleStyleContextValue = {
    puzzleStyle,
  }

  const puzzleKeys = PuzzleUtils.calculatePuzzleKeys(solvedPuzzleData);
  const initalKeysState = {
    columnKeys: puzzleKeys.columnKeys.map(keyArray => {
      return keyArray.map(key => {
        return {
          ...key,
          state: keyCellStates.notSolved
        }
      })
    }),

    rowKeys: puzzleKeys.rowKeys.map(keyArray => {
      return keyArray.map(key => {
        return {
          ...key,
          state: keyCellStates.notSolved
        }
      })
    })
  }

  const initalStateContextValue = {
    solvedPuzzleData,
    boardState: initalBoardState,
    keyState: initalKeysState,
    mousedOverCell: {},
    mouseDownLastFrame: false,
    lastChangedToCellState: -1,
    puzzleSolved: false
  }

  const [puzzleState, dispatch] = useReducer(puzzleReducer, initalStateContextValue);
  const puzzleStateContextValue = useMemo(() => {
    return {
      puzzleState,
      dispatch
    }
  }, [puzzleState, dispatch]);

  // console.log(initalStateContextValue);

  let resume = false;
  let loggedIn = false;

  return (
    <div id="container">
      <div id="header">
        <span id="title">PicrossX</span>
        <div id="auth-buttons-container">
          {resume ? <Button text={'Resume'} classes={'header-button mr-sm'} /> : null}
          {!loggedIn ? [
            <Button text={'Login'} classes={'header-button mr-sm'} key={0} />,
            <Button text={'Register'} classes={'header-button mr-sm'} key={1} />
          ] : null}

        </div>
      </div>
      <div className="flex-container">
        <PuzzleStyleContext.Provider value={puzzleStyleContextValue}>
          <PuzzleStateContext.Provider value={puzzleStateContextValue}>
            <Puzzle />
          </PuzzleStateContext.Provider>
        </PuzzleStyleContext.Provider>
      </div>
      <div id="footer">
        by Maciej Kuśmierzak, 2022
      </div>
    </div>
  )
}

export { App as default, PuzzleStyleContext, PuzzleStateContext };
