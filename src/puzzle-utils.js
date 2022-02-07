const calculatePuzzleKeys = (puzzleData) => {
  const columnKeys = [], rowKeys = [];

  for (let row = 0; row < puzzleData.rowCount; row++) {
    const currentRowKeys = [];
    let currentKeyValue = 0;
    let keyStartOffset = 0;

    for (let column = 0; column < puzzleData.columnCount; column++) {
      if (puzzleData.solvedPuzzle[row][column]) {
        if (currentKeyValue === 0) {
          keyStartOffset = column;
        }
        currentKeyValue++;
      } else if (currentKeyValue > 0) {

        currentRowKeys.push({
          key: currentKeyValue,
          startOffset: keyStartOffset,
        });

        currentKeyValue = 0;
      }
    }

    if (currentKeyValue > 0) {
      currentRowKeys.push({
        key: currentKeyValue,
        startOffset: keyStartOffset,
      });
    }

    rowKeys.push(currentRowKeys);
  }

  for (let column = 0; column < puzzleData.columnCount; column++) {
    const currentColumnKeys = [];
    let currentKeyValue = 0;
    let keyStartOffset = 0;

    for (let row = 0; row < puzzleData.rowCount; row++) {
      if (puzzleData.solvedPuzzle[row][column]) {
        if (currentKeyValue === 0) {
          keyStartOffset = row;
        }
        currentKeyValue++;
      } else if (currentKeyValue > 0) {
        currentColumnKeys.push({
          key: currentKeyValue,
          startOffset: keyStartOffset,
        });
        currentKeyValue = 0;
      }
    }

    if (currentKeyValue > 0) {
      currentColumnKeys.push({
        key: currentKeyValue,
        startOffset: keyStartOffset,
      });
    }

    columnKeys.push(currentColumnKeys);
  }

  return {
    columnKeys,
    rowKeys
  }
}

const getMaxKeyArrayLength = (keyArrays) => {
  return keyArrays.reduce((maxLength, currentArray) => {
    return maxLength > currentArray.length ? maxLength : currentArray.length;
  }, 0)
}

export { calculatePuzzleKeys, getMaxKeyArrayLength };