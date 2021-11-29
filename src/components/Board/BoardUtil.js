export const cleanAvailableMovesState = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]
];

export const showDiagonalMove = (rowAndColumn, rowAndColumnDirection, allyValue, enemyValue, nextAvailableMoves, board, hasSkipped) => {
  const row = rowAndColumn[0];
  const column = rowAndColumn[1];
  const rowDirection = rowAndColumnDirection[0];
  const columnDirection = rowAndColumnDirection[1];
  
  const rowMoveByOne = row + rowDirection;
  const rowMoveByTwo = row + (2 * rowDirection);
  const columnMoveByOne = column + columnDirection;
  const columnMoveByTwo = column + (2 * columnDirection);

  const diagonalStepValue = rowMoveByOne > -1 && rowMoveByOne < 8 && columnMoveByOne > -1 && columnMoveByOne < 8 ? board[rowMoveByOne][columnMoveByOne] : allyValue;
  if(diagonalStepValue === 0 && !hasSkipped) {
    nextAvailableMoves[rowMoveByOne][columnMoveByOne] = 1;
  } else if(diagonalStepValue === enemyValue || diagonalStepValue === enemyValue + 10) {
    const diagonalSkipValue = rowMoveByTwo > -1 && rowMoveByTwo < 8 && columnMoveByTwo > -1 && columnMoveByTwo < 8 ? board[rowMoveByTwo][columnMoveByTwo] : allyValue;
    if(diagonalSkipValue === 0) {
      nextAvailableMoves[rowMoveByTwo][columnMoveByTwo] = 1;
    }
  }

  return nextAvailableMoves;
}

export const showMovesUp = (row, column, isWhiteMove, nextAvailableMoves, board, hasSkipped) => {
  const allyValue = isWhiteMove ? 1 : 2;
  const enemyValue = isWhiteMove ? 2 : 1;

  nextAvailableMoves = showDiagonalMove([row, column], [-1, -1], allyValue, enemyValue, nextAvailableMoves, board, hasSkipped);
  nextAvailableMoves = showDiagonalMove([row, column], [-1, 1], allyValue, enemyValue, nextAvailableMoves, board, hasSkipped);

  return nextAvailableMoves;
}

export const showMovesDown = (row, column, isWhiteMove, nextAvailableMoves, board, hasSkipped) => {
  const allyValue = isWhiteMove ? 1 : 2;
  const enemyValue = isWhiteMove ? 2 : 1;

  nextAvailableMoves = showDiagonalMove([row, column], [1, -1], allyValue, enemyValue, nextAvailableMoves, board, hasSkipped);
  nextAvailableMoves = showDiagonalMove([row, column], [1, 1], allyValue, enemyValue, nextAvailableMoves, board, hasSkipped);

  return nextAvailableMoves;
}

export const showKingMoves = (row, column, isWhiteMove, nextAvailableMoves, board, hasSkipped) => {
  nextAvailableMoves = showMovesUp(row, column, isWhiteMove, nextAvailableMoves, board, hasSkipped);
  nextAvailableMoves = showMovesDown(row, column, isWhiteMove, nextAvailableMoves, board, hasSkipped);

  return nextAvailableMoves;
}
