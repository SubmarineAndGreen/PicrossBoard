import React, { useContext, useState } from "react";
import { PuzzleStyleContext, PuzzleStateContext } from "./App";
import keyCrossOutSvg from './images/x-single-crossout.svg'
import { keyCellStates } from "./puzzle-logic";

const PuzzleKeysCell = ({ groupOrientation, keyGroupIndex, keyIndex, active }) => {
    const { puzzleState } = useContext(PuzzleStateContext);
    const { puzzleStyle } = useContext(PuzzleStyleContext);
    const [manualCrossOut, setManualCrossOut] = useState(false);
    const [isMousedOver, setIsMousedOver] = useState(false);

    const cellSizeStyle = {
        height: `${puzzleStyle.cellSize}px`,
        width: `${puzzleStyle.cellSize}px`
    }

    const allKeys = groupOrientation === 'vertical'
        ? puzzleState.keyState.columnKeys
        : puzzleState.keyState.rowKeys;

    const keyGroup = allKeys[keyGroupIndex];
    const keyState = keyGroup[keyIndex];

    if (!active) {
        return (
            <div style={cellSizeStyle}></div>
        )
    }


    // console.log(keyState);

    const solved = keyState.state === keyCellStates.solved ? true : false;

    const toggleCrossedOut = () => {
        if(!solved) {
            setManualCrossOut(!manualCrossOut);
        }
    }

    const handleMouseEnter = () => {
        setIsMousedOver(true);
    }

    const handleMouseLeave = () => {
        setIsMousedOver(false);
    }

    const props = {
        style: cellSizeStyle,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        onClick: toggleCrossedOut
    }

    // const crossedOut = solved 

    const crossedOutClass = manualCrossOut || solved ? 'puzzle-keys-cell--crossed-out' : '';

    return (
        <div className={`puzzle-keys-cell ${crossedOutClass}`} {...props}>
            <span className="key-text">{active ? keyState.key : ''}</span>
            {manualCrossOut || solved ? <img src={keyCrossOutSvg} alt="crossed out" className="key-cross-out" /> : null}
            {isMousedOver ? <div className="key-highlight"></div> : null}
        </div>
    )
}

export { PuzzleKeysCell as default };