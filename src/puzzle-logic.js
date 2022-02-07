import * as PuzzleUtils from './puzzle-utils'

const cellStates = {
    empty: 0,
    filled: 1,
    crossedOut: 2,
    filledError: 3,
    crossedOutError: 4
}

const keyCellStates = {
    notSolved: 0,
    solved: 1
}


const puzzleReducer = (state, action) => {
    switch (action.type) {
        case 'CLEAR-BOARD':
            return clearBoard(state);
        case 'TOGGLE-CELL-FILLED':
            return toggleCellFilled(state, action);
        case 'TOGGLE-CELL-CROSSED-OUT':
            return toggleCellCrossedOut(state, action);
        case 'HANDLE-MOUSE-OVER-CELL':
            return handleMousedOverCell(state, action);
        case 'CLEAR-MOUSE-DOWN':
            return clearMouseDownLastFrame(state);
        case 'CHECK-PUZZLE':
            return checkPuzzle(state, action);
        case 'NEW-PUZZLE':
            const newPuzzle = {
                columnCount: action.width,
                rowCount: action.height,
                solvedPuzzle: generateRandomPuzzle(action.width, action.height)
            }

            // console.log(newPuzzle);

            return resetPuzzle(state, newPuzzle);
        default:
            throw new Error("Invalid puzzle action");
    }
}

const toggleCellFilledAction = ({ x, y, cellState }) => {
    return {
        x, y, cellState, type: 'TOGGLE-CELL-FILLED'
    }
}

const toggleCellCrossedOutAction = ({ x, y, cellState }) => {
    return {
        x, y, cellState, type: 'TOGGLE-CELL-CROSSED-OUT'
    }
}

const handleMousedOverCellAction = ({ x, y }) => {
    return {
        x, y, type: 'HANDLE-MOUSE-OVER-CELL'
    }
}

const clearMouseDownLastFrameAction = () => {
    return {
        type: 'CLEAR-MOUSE-DOWN'
    }
}

const checkPuzzleAction = ({ puzzleSolution }) => {
    return {
        puzzleSolution,
        type: 'CHECK-PUZZLE'
    }
}

const clearBoardAction = () => {
    return {
        type: 'CLEAR-BOARD'
    }
}

const newPuzzleAction = ({ width, height }) => {
    console.log(width, height);
    return {
        type: 'NEW-PUZZLE',
        width,
        height
    }
}

const clearBoard = (state) => {
    const newBoardState = [...state.boardState];
    newBoardState.forEach(row => row.fill(cellStates.empty));

    return {
        ...state,
        boardState: newBoardState
    }
}

const toggleCellFilled = (state, action) => {
    const { x, y, cellState } = action;
    const newBoardState = [...state.boardState];

    const isCellFilled = cellState === cellStates.filled;
    const isCellError = cellState === cellStates.filledError;
    let newCellState;

    if (isCellFilled || isCellError) {
        newCellState = cellStates.empty;
    } else {
        newCellState = cellStates.filled;
    }

    newBoardState[y][x] = newCellState;

    // console.log("cell was filled:", isCellFilled, "now is filled:", newBoardState[y][x]);

    return {
        ...state,
        boardState: newBoardState,
        mouseDownLastFrame: true,
        lastChangedToCellState: newCellState
    }
}

const toggleCellCrossedOut = (state, action) => {
    const { x, y, cellState } = action;
    const newBoardState = [...state.boardState];

    const isCellCrossedOut = cellState === cellStates.crossedOut;
    const isCellError = cellState === cellStates.crossedOutError;
    let newCellState;

    if (isCellCrossedOut || isCellError) {
        newCellState = cellStates.empty;
    } else {
        newCellState = cellStates.crossedOut;
    }

    newBoardState[y][x] = newCellState;

    return {
        ...state,
        boardState: newBoardState,
        mouseDownLastFrame: true,
        lastChangedToCellState: newCellState
    }
}

const handleMousedOverCell = (state, action) => {
    const { x, y } = action;

    if (x === undefined || y === undefined) {
        return {
            ...state,
            mousedOverCell: {},
        }
    }

    const newBoardState = [...state.boardState];

    if (state.mouseDownLastFrame) {
        newBoardState[y][x] = state.lastChangedToCellState;
    }

    return {
        ...state,
        boardState: newBoardState,
        mousedOverCell: { x, y }
    }
}

const clearMouseDownLastFrame = (state) => {
    // console.log('clear');
    return {
        ...state,
        mouseDownLastFrame: false,
    }
}

const checkPuzzle = (state, action) => {
    const keys = state.keyState;
    const { puzzleSolution } = action;
    const { boardState } = state;

    const newBoardState = [...boardState];
    const columnKeys = [...keys.columnKeys];
    const rowKeys = [...keys.rowKeys];


    //row keys
    for (let row = 0; row < puzzleSolution.length; row++) {
        // for (let row = 0; row < 1; row++) {
        const currentRow = puzzleSolution[row];

        let keyIndex = 0;
        let keySolved = true;

        for (let column = 0; column < currentRow.length; column++) {
            const currentCell = boardState[row][column];
            // const solvedCell = puzzleSolution[row][column];

            // if (currentCell !== solvedCell) {
            //     // console.log(row, column, currentCell, solvedCell);
            //     if (currentCell === cellStates.filled) {
            //         boardState[row][column] = cellStates.filledError;
            //     } else if (currentCell === cellStates.crossedOut && solvedCell === cellStates.filled) {
            //         boardState[row][column] = cellStates.crossedOutError;
            //     }
            // }

            const currentKey = rowKeys[row][keyIndex];
            const beforeKeyStart = currentKey.startOffset - 1;
            const afterKeyEnd = currentKey.startOffset + currentKey.key;

            // console.log(currentKey, column, currentKey.startOffset, afterKeyEnd);

            if (column >= currentKey.startOffset && column < afterKeyEnd) {
                // console.log(row, column, 'in key', currentKey, keySolved);
                if (currentCell !== cellStates.filled) {
                    keySolved = false;
                }
            } else if (currentCell !== cellStates.crossedOut) {
                keySolved = false;
                // console.log('not in key');
            }

            if (column === afterKeyEnd
                || ((afterKeyEnd === currentRow.length) && (column === (afterKeyEnd - 1)))) {
                rowKeys[row][keyIndex].state = keySolved ? keyCellStates.solved : keyCellStates.notSolved;
                if (keyIndex < rowKeys[row].length - 1) {
                    keyIndex++;
                }
                if (currentCell === cellStates.crossedOut) {
                    keySolved = true;
                }
            }

            if (column === beforeKeyStart && currentCell === cellStates.crossedOut) {
                keySolved = true;
            }
        }
    }

    //column keys

    for (let column = 0; column < puzzleSolution[0].length; column++) {
        // for (let row = 0; row < 1; row++) {
        // const currentColumn = puzzleSolution[column];
        let keyIndex = 0;
        let keySolved = true;

        for (let row = 0; row < puzzleSolution.length; row++) {
            const currentCell = boardState[row][column];
            // const solvedCell = puzzleSolution[row][column];

            // console.log(columnKeys);
            // if(columnKeys[column] === undefined) {
            //     console.log(column, keyIndex);
            // }
            const currentKey = columnKeys[column][keyIndex];
            const beforeKeyStart = currentKey.startOffset - 1;
            const afterKeyEnd = currentKey.startOffset + currentKey.key;

            // console.log(currentKey, column, currentKey.startOffset, afterKeyEnd);

            if (row >= currentKey.startOffset && row < afterKeyEnd) {
                // console.log(row, column, 'in key', currentKey, keySolved, afterKeyEnd);
                if (currentCell !== cellStates.filled) {
                    keySolved = false;
                }
            } else if (currentCell !== cellStates.crossedOut) {
                keySolved = false;
                // console.log('not in key');
            }

            if (row === afterKeyEnd
                || ((afterKeyEnd === puzzleSolution.length) && (row === (afterKeyEnd - 1)))) {
                columnKeys[column][keyIndex].state = keySolved ? keyCellStates.solved : keyCellStates.notSolved;

                if (keyIndex < columnKeys[column].length - 1) {
                    keyIndex++;
                }

                if (currentCell === cellStates.crossedOut) {
                    keySolved = true;
                }
            }

            if (row === beforeKeyStart && currentCell === cellStates.crossedOut) {
                keySolved = true;
            }
        }
    }

    //mark errors
    for (let row = 0; row < puzzleSolution.length; row++) {
        const currentRow = puzzleSolution[row];

        for (let column = 0; column < currentRow.length; column++) {
            const currentCell = boardState[row][column];
            const solvedCell = puzzleSolution[row][column];

            if (currentCell !== solvedCell) {
                // console.log(row, column, currentCell, solvedCell);
                if (currentCell === cellStates.filled) {
                    newBoardState[row][column] = cellStates.filledError;
                } else if (currentCell === cellStates.crossedOut && solvedCell === cellStates.filled) {
                    newBoardState[row][column] = cellStates.crossedOutError;
                }
            }

        }
    }

    let puzzleSolved = true;
    //if all cells filled in solution filled on board mark remaining empty cells
    for (let row = 0; row < puzzleSolution.length; row++) {
        let allCellsOk = true;
        for (let column = 0; column < puzzleSolution[0].length; column++) {
            if (puzzleSolution[row][column] === cellStates.filled) {
                if (boardState[row][column] !== cellStates.filled) {
                    allCellsOk = false;
                }
            }

            if (newBoardState[row][column] === cellStates.crossedOutError
                || newBoardState[row][column] === cellStates.filledError) {
                allCellsOk = false;
            }
        }

        if (allCellsOk) {
            for (let column = 0; column < puzzleSolution[0].length; column++) {
                const currentCell = boardState[row][column];
                if (currentCell === cellStates.empty) {
                    newBoardState[row][column] = cellStates.crossedOut;
                }
            }

            rowKeys[row].forEach(key => key.state = keyCellStates.solved);
        }

        puzzleSolved &&= allCellsOk;
    }

    for (let column = 0; column < puzzleSolution[0].length; column++) {
        let allCellsOk = true;
        for (let row = 0; row < puzzleSolution.length; row++) {
            if (puzzleSolution[row][column] === cellStates.filled) {
                if (boardState[row][column] !== cellStates.filled) {
                    allCellsOk = false;
                }
            }

            if (newBoardState[row][column] === cellStates.crossedOutError
                || newBoardState[row][column] === cellStates.filledError) {
                allCellsOk = false;
            }
        }

        if (allCellsOk) {
            for (let row = 0; row < puzzleSolution.length; row++) {
                if (newBoardState[row][column] === cellStates.empty) {
                    newBoardState[row][column] = cellStates.crossedOut;
                }
            }

            columnKeys[column].forEach(key => key.state = keyCellStates.solved);
        }

        puzzleSolved &&= allCellsOk;
    }


    return {
        ...state,
        boardState: newBoardState,
        puzzleSolved: state.puzzleSolved || puzzleSolved,
        keyState: {
            columnKeys,
            rowKeys
        }
    }
}

const generateRandomPuzzle = (width, height) => {
    // console.log(newPuzzle);

    let anyEmptyRowsOrColumns = true;

    let newPuzzle = [];

    while (anyEmptyRowsOrColumns) {
        newPuzzle = [];

        for (let row = 0; row < height; row++) {
            newPuzzle.push([]);
            for (let column = 0; column < width; column++) {
                newPuzzle[row].push(Math.random() > 0.5 ? 1 : 0);
                // console.log('push', row);
            }
        }

        let anyEmptyRows = false;
        for (let row = 0; row < width; row++) {
            let emptyRow = true;
            for (let column = 0; column < height; column++) {
                if (newPuzzle[row][column] === 1) {
                    emptyRow = false;
                }
            }
            anyEmptyRows ||= emptyRow;
        }

        let anyEmptyColumns = false;
        for (let column = 0; column < height; column++) {
            let emptyColumn = true;
            for (let row = 0; row < width; row++) {
                if (newPuzzle[row][column] === 1) {
                    emptyColumn = false;
                }
            }
            anyEmptyColumns ||= emptyColumn;
        }

        anyEmptyRowsOrColumns = anyEmptyRows || anyEmptyColumns;
        // anyEmptyRowsOrColumns = false;
    }

    // console.log(newPuzzle);
    return newPuzzle;
}

const resetPuzzle = (state, solvedPuzzleData) => {
    const puzzleKeys = PuzzleUtils.calculatePuzzleKeys(solvedPuzzleData);
    const newKeys = {
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

    const newBoardState = new Array(solvedPuzzleData.rowCount)
        .fill(0)
        .map(row => new Array(solvedPuzzleData.columnCount).fill(0));

    console.log(newBoardState);

    return {
        ...state,
        solvedPuzzleData,
        keyState: newKeys,
        boardState: newBoardState,
        puzzleSolved: false
    }
}

export {
    puzzleReducer,
    cellStates,
    keyCellStates,
    toggleCellFilledAction,
    toggleCellCrossedOutAction,
    handleMousedOverCellAction,
    clearMouseDownLastFrameAction,
    checkPuzzleAction,
    clearBoardAction,
    newPuzzleAction,
    generateRandomPuzzle
};