import React, {useContext} from "react";
import { PuzzleStyleContext, PuzzleStateContext } from "./App";
import { clearMouseDownLastFrameAction } from "./puzzle-logic";
import PuzzleRow from "./PuzzleRow";

const PuzzleBoard = () => {
    const { puzzleStyle } = useContext(PuzzleStyleContext);
    const { puzzleState, dispatch } = useContext(PuzzleStateContext);

    const boardSizeStyle = {
        height: `${puzzleStyle.cellSize * puzzleState.solvedPuzzleData.rowCount}px`,
        width: `${puzzleStyle.cellSize * puzzleState.solvedPuzzleData.columnCount}px`,
    }

    const handleMouseLeave = () => {
        dispatch(clearMouseDownLastFrameAction());
    }

    return (
        <div className="puzzle-board" style={boardSizeStyle} onMouseLeave={handleMouseLeave}>
            {puzzleState.solvedPuzzleData.solvedPuzzle.map((rowData, index) => {
                const rowProps = {
                    key: index,
                    rowIndex: index,
                }
                return <PuzzleRow {...rowProps} />;
            })}
        </div>
    )
}

export { PuzzleBoard as default };