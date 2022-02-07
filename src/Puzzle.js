import React, { useContext } from "react";
import { PuzzleStateContext, PuzzleStyleContext } from "./App";
import * as PuzzleUtils from "./puzzle-utils";
import PuzzleBoard from "./PuzzleBoard";
import PuzzleKeysContainer from "./PuzzleKeysContainer";
import PuzzleSidebar from "./PuzzleSidebar";

const Puzzle = () => {
    const { puzzleState } = useContext(PuzzleStateContext);
    const { puzzleStyle } = useContext(PuzzleStyleContext);
    
    const puzzleKeys = puzzleState.keyState;

    const spacerHeight = PuzzleUtils.getMaxKeyArrayLength(puzzleKeys.columnKeys) * puzzleStyle.cellSize;
    const spacerWidth = PuzzleUtils.getMaxKeyArrayLength(puzzleKeys.rowKeys) * puzzleStyle.cellSize;

    const spacerStyle = {
        height: `${spacerHeight}px`,
        width: `${spacerWidth}px`
    }

    const columnKeyProps = {
        orientation: 'vertical'
    }

    const rowKeyProps = {
        orientation: 'horizontal'
    }

    return (

        <div className="flex-container">
            <div className="puzzle-container" onContextMenu={e => e.preventDefault()}>
                <div className="puzzle-container-column">
                    <div id="spacer" style={spacerStyle}></div>
                    <PuzzleKeysContainer {...rowKeyProps} />
                </div>
                <div className="puzzle-container-column">
                    <PuzzleKeysContainer {...columnKeyProps} />
                    <PuzzleBoard />
                </div>
            </div>
            <PuzzleSidebar />
        </div>
    )
}

export { Puzzle as default };