import React, { useContext } from "react";
import { PuzzleStyleContext, PuzzleStateContext } from "./App";
import {
    cellStates,
    toggleCellFilledAction,
    toggleCellCrossedOutAction,
    handleMousedOverCellAction,
    clearMouseDownLastFrameAction
} from "./puzzle-logic";
import crossedOutCellSvg from './images/x-crossout.svg'


const PuzzleCell = ({ coordinates }) => {
    // console.log("cell rendered", coordinates.x, coordinates.y);

    const { puzzleStyle } = useContext(PuzzleStyleContext);
    const { puzzleState, dispatch } = useContext(PuzzleStateContext);

    const puzzleDimensions = { columnCount: puzzleState.solvedPuzzleData.columnCount, rowCount: puzzleState.solvedPuzzleData.rowCount };

    const cellSizeStyle = {
        height: `${puzzleStyle.cellSize}px`,
        width: `${puzzleStyle.cellSize}px`
    }

    const cellState = puzzleState.boardState[coordinates.y][coordinates.x];

    const handleLeftClick = () => {
        dispatch(toggleCellFilledAction({ ...coordinates, cellState }));
    }

    const handleRightClick = (event) => {
        dispatch(toggleCellCrossedOutAction({ ...coordinates, cellState }));
    }

    const handleMouseEnter = () => {
        dispatch(handleMousedOverCellAction(coordinates));
    }

    const handleMouseLeave = () => {
        dispatch(handleMousedOverCellAction({}));
    }

    const handleMouseDown = (event) => {
        // console.log(event.button);
        if(event.button === 0) {
            handleLeftClick();
        } else if (event.button === 2) {
            handleRightClick();
        }
    }

    const handleMouseUp = () => {
        // console.log('up');
        dispatch(clearMouseDownLastFrameAction());
    }

    const fillClass = getFillClass(cellState, puzzleState.mousedOverCell, coordinates);

    let cellFillStyle = {};

    if (cellState === cellStates.filled) {
        cellFillStyle.backgroundColor = 'black';
    } else if (cellState === cellStates.empty) {
        cellFillStyle.backgroundColor = 'white';
    }

    const style = {
        ...cellSizeStyle,
        boxShadow: calculateShadowStyle({ coordinates, puzzleDimensions })
    }

    const classes = `puzzle-cell ${fillClass}`;

    return (
        <div className={classes} 
            style={style} 
            onMouseDown={handleMouseDown}  
            onMouseUp={handleMouseUp}
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave}>
            {
                cellState === cellStates.crossedOut || cellState === cellStates.crossedOutError
                    ? <img src={crossedOutCellSvg} alt="cross" className="cell-cross-out" />
                    : null
            }
            {
                cellState === cellStates.filledError || cellState === cellStates.crossedOutError
                    ? <img src={crossedOutCellSvg} alt="cross" className="cell-error-cross" />
                    : null
            }

        </div>
    )
}

const calculateShadowStyle = ({ coordinates, puzzleDimensions }) => {
    const shadowColor = 'rgb(100, 100, 100)';
    const shadowThickness = '1';

    const baseShadow = `0px 0px 0px 1px rgb(200, 200, 200)`;
    const boxShadowRight = `${shadowThickness}px 0px 0px 0px ${shadowColor}`;
    const boxShadowLeft = `-${shadowThickness}px 0px 0px 0px ${shadowColor}`;
    const boxShadowTop = `0px -${shadowThickness}px 0px 0px ${shadowColor}`;
    const boxShadowBottom = `0px ${shadowThickness}px 0px 0px ${shadowColor}`;

    let changedShadow = false;

    let shadowStyleString = '';

    if (coordinates.x % 5 === 0) {
        changedShadow = true;
        if (shadowStyleString) {
            shadowStyleString += ',';
        }
        shadowStyleString += boxShadowLeft;
    }

    if (coordinates.y % 5 === 0) {
        changedShadow = true;
        if (shadowStyleString) {
            shadowStyleString += ',';
        }
        shadowStyleString += boxShadowTop;
    }

    if (coordinates.x === puzzleDimensions.columnCount - 1) {
        changedShadow = true;
        if (shadowStyleString) {
            shadowStyleString += ',';
        }
        shadowStyleString += boxShadowRight;
    }

    if (coordinates.y === puzzleDimensions.rowCount - 1) {
        changedShadow = true;
        if (shadowStyleString) {
            shadowStyleString += ',';
        }
        shadowStyleString += boxShadowBottom;
    }


    if (changedShadow) {
        shadowStyleString += ',' + baseShadow;
    }

    return changedShadow ? shadowStyleString : '';
}

const getFillClass = (cellState, mousedOverCellCoordinates, targetCellCoordinates) => {
    if (cellState === cellStates.filled || cellState === cellStates.filledError) {
        return 'puzzle-cell--filled'
    }

    if (mousedOverCellCoordinates) {
        if (mousedOverCellCoordinates.x === targetCellCoordinates.x
            && mousedOverCellCoordinates.y === targetCellCoordinates.y) {
            return 'puzzle-cell--highlighted';
        }

        if (mousedOverCellCoordinates.x === targetCellCoordinates.x || mousedOverCellCoordinates.y === targetCellCoordinates.y) {
            return 'puzzle-cell--highlighted-secondary';
        }
    }

    return ''
}

export { PuzzleCell as default };