import React, { useContext } from "react";
import { PuzzleStateContext } from "./App";
import PuzzleCell from "./PuzzleCell";

const PuzzleRow = ({ rowIndex }) => {
    const { puzzleState } = useContext(PuzzleStateContext);

    const rowCellData = puzzleState.solvedPuzzleData.solvedPuzzle[rowIndex];

    return (
        <div className="puzzle-row">
            {rowCellData.map((_, index) => {
                const coordinates = {
                    x: index,
                    y: rowIndex
                }
                const props = {
                    key: index,
                    coordinates,
                }
                return <PuzzleCell {...props} />
            })}
        </div>
    )
}

export { PuzzleRow as default }