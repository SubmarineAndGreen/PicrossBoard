import React, { useContext, useState } from "react";
// import LikeButton from "./LikeButton";
import { PuzzleStateContext } from "./App";
import { checkPuzzleAction, clearBoardAction, newPuzzleAction } from "./puzzle-logic";
import PuzzleTimer from "./PuzzleTimer";
import Button from "./Button";
import OptionField from "./OptionField";

const PuzzleSidebar = () => {
    const { dispatch, puzzleState } = useContext(PuzzleStateContext);
    const [selectedDimensions, setSelectedDimensions] = useState({ width: 5, height: 5 });

    const puzzleData = puzzleState.solvedPuzzleData;

    const checkButtonClick = () => {
        dispatch(checkPuzzleAction({
            puzzleSolution: puzzleData.solvedPuzzle
        }))
    }

    const clearButtonClick = () => {
        dispatch(clearBoardAction());
    }

    const newPuzzleButtonClick = () => {
        dispatch(newPuzzleAction(selectedDimensions));
    }

    const optionFieldChange = (value) => {
        switch (value) {
            case 'sm':
                setSelectedDimensions({ width: 5, height: 5 })
                break;
            case 'md':
                setSelectedDimensions({ width: 10, height: 10 })
                break;
            case 'l':
                setSelectedDimensions({ width: 15, height: 15 })
                break;
            default:
                setSelectedDimensions({ width: 20, height: 20 })
                break;
        }

        console.log(value);
    }

    const solvedTextVisibility = `${puzzleState.puzzleSolved ? 'visible' : 'hidden'}`

    return (
        <div className="puzzle-sidebar">
            <span style={{ visibility: solvedTextVisibility }}>Solved!</span>
            <PuzzleTimer />
            <Button text="Check puzzle" onClick={checkButtonClick} classes={'puzzle-button'} />
            <div className="button-spacer"></div>
            <Button text="Clear all" onClick={clearButtonClick} classes={'puzzle-button'} />
            <Button text="New puzzle" onClick={newPuzzleButtonClick} classes={'puzzle-button'} />
            <OptionField onChange={optionFieldChange} />
            {/* <LikeButton /> */}
        </div>
    )
}

export { PuzzleSidebar as default };