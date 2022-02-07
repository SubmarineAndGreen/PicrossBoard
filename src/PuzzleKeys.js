import React, { useContext } from "react";
import { PuzzleStateContext } from "./App";
import PuzzleKeysCell from "./PuzzleKeysCell";

const PuzzleKeys = ({ keyGroupIndex, maxKeyCount, orientation }) => {
    const { puzzleState } = useContext(PuzzleStateContext)

    const allKeys = orientation === 'vertical'
        ? puzzleState.keyState.columnKeys
        : puzzleState.keyState.rowKeys;
    
    const keyGroup = allKeys[keyGroupIndex];

    const keysClass = orientation === 'vertical' ? 'puzzle-column-keys' : 'puzzle-row-keys';
    const keyCells = [];

    let keyIndex = 0;
    for (let cellIndex = 0; cellIndex < maxKeyCount; cellIndex++) {
        const isKeyCellFilled = cellIndex >= (maxKeyCount - keyGroup.length);

        // console.log(keyIndex);

        const cellProps = {
            groupOrientation: orientation,
            keyGroupIndex,
            keyIndex,
            active: isKeyCellFilled,
            key: cellIndex,
        }

        if (isKeyCellFilled) {
            keyIndex += 1;
        }

        keyCells.push(<PuzzleKeysCell {...cellProps} />)
    }

    return (
        <div className={keysClass}>
            {keyCells}
        </div>
    )
}

export { PuzzleKeys as default };