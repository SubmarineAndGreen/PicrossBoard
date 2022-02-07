import { useContext } from 'react';
import * as PuzzleUtils from './puzzle-utils.js';
import PuzzleKeys from './PuzzleKeys.js';
import { PuzzleStyleContext, PuzzleStateContext } from './App';

const PuzzleKeysContainer = ({ orientation }) => {
    const { puzzleStyle } = useContext(PuzzleStyleContext)
    const { puzzleState } = useContext(PuzzleStateContext);
    const { keyState } = puzzleState;

    const containerKeysState = orientation === 'vertical' ? keyState.columnKeys : keyState.rowKeys;

    const containerClass = orientation === 'vertical' ? 'puzzle-column-keys-container' : 'puzzle-row-keys-container';
    const maxKeyCount = PuzzleUtils.getMaxKeyArrayLength(containerKeysState);


    const sizeStyle = orientation === 'vertical' ? {
        height: `${puzzleStyle.cellSize * maxKeyCount}px`,
        width: `${puzzleStyle.cellSize * puzzleState.length}px`
    } : {
        height: `${puzzleStyle.cellSize * puzzleState.length}px`,
        width: `${puzzleStyle.cellSize * maxKeyCount}px`
    }

    return (
        <div className={containerClass} style={sizeStyle}>
            {containerKeysState.map((_, index) => {
                const keysProps = {
                    keyGroupIndex: index,
                    maxKeyCount,
                    orientation,
                    key: index
                }
                return <PuzzleKeys {...keysProps} />
            })}
        </div>
    )
}

export { PuzzleKeysContainer as default };