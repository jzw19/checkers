import React, { Component } from 'react';
import Square from '../Square/Square';
import { cleanAvailableMovesState, showMovesUp, showMovesDown, showKingMoves } from './BoardUtil';

import './Board.scss';
// 0 = empty, 1 = white piece, 2 = red piece
//            11 = white king, 12 = red king
class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: [
        [0, 2, 0, 2, 0, 2, 0, 2],
        [2, 0, 2, 0, 2, 0, 2, 0],
        [0, 2, 0, 2, 0, 2, 0, 2],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0]
      ],
      availableMoves: [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
      ],
      isShowingAvailableMovesFor: null,
      hasStepped: false,
      hasSkipped: false,
      redPieceCount: 12,
      whitePieceCount: 12
    };

    this.hasPiece = this.hasPiece.bind(this);
    this.showMovesForPiece = this.showMovesForPiece.bind(this);
    this.movePieceTo = this.movePieceTo.bind(this);
    this.checkPromotion = this.checkPromotion.bind(this);
    this.renderBoard = this.renderBoard.bind(this);
    this.populateRow = this.populateRow.bind(this);
    this.pushToRowDisplay = this.pushToRowDisplay.bind(this);
    this.onClickPiece = this.onClickPiece.bind(this);
    this.removePiece = this.removePiece.bind(this);
  }

  componentDidUpdate(prevProps) {
    if(this.props.isWhiteMove !== prevProps.isWhiteMove) {
      this.setState({
        ...this.state,
        availableMoves: cleanAvailableMovesState,
        isShowingAvailableMovesFor: null,
        hasStepped: false,
        hasSkipped: false
      });
    }
  }

  hasPiece(pieceColor, row, column) {
    if(pieceColor === 'white') {
      return this.state.board[row][column] === 1;
    } else {
      return this.state.board[row][column] === 2;
    }
  }

  showMovesForPiece(row, column) {
    if(this.state.hasStepped) {
      this.setState({
        ...this.state,
        availableMoves: JSON.parse(JSON.stringify(cleanAvailableMovesState)),
        isShowingAvailableMovesFor: null
      });
      return;
    }
    const pieceValue = this.state.board[row][column];
    const hasMovedButIsNotMovedPiece = this.props.movedPieceCoordinates && (row !== this.props.movedPieceCoordinates[0] || column !== this.props.movedPieceCoordinates[1]);
    const isAlreadySelectedPiece = this.state.isShowingAvailableMovesFor && this.state.isShowingAvailableMovesFor[0] === row && this.state.isShowingAvailableMovesFor[1] === column;
    let nextAvailableMoves = JSON.parse(JSON.stringify(cleanAvailableMovesState));

    if(hasMovedButIsNotMovedPiece || isAlreadySelectedPiece) {
      this.setState({
        ...this.state,
        availableMoves: nextAvailableMoves,
        isShowingAvailableMovesFor: null
      });
    } else {
      if(pieceValue > 2) {
        nextAvailableMoves = showKingMoves(row, column, this.props.isWhiteMove, nextAvailableMoves, this.state.board, this.state.hasSkipped);
      } else if(pieceValue === 2) {
        nextAvailableMoves = showMovesDown(row, column, false, nextAvailableMoves, this.state.board, this.state.hasSkipped);
      } else if(pieceValue === 1) {
        nextAvailableMoves = showMovesUp(row, column, true, nextAvailableMoves, this.state.board, this.state.hasSkipped);
      }

      this.setState({
        ...this.state,
        availableMoves: nextAvailableMoves,
        isShowingAvailableMovesFor: [row, column]
      })
    }
  }

  removePiece(destinationRow, destinationColumn, originRow, originColumn, nextBoard) {
    const removalRow = (destinationRow + originRow) / 2;
    const removalColumn = (destinationColumn + originColumn) / 2;
    const nextRedPieceCount = this.state.board[removalRow][removalColumn] % 10 === 2 ? this.state.redPieceCount - 1 : this.state.redPieceCount;
    const nextWhitePieceCount = this.state.board[removalRow][removalColumn] % 10 === 1 ? this.state.whitePieceCount - 1 : this.state.whitePieceCount;
    nextBoard[removalRow][removalColumn] = 0;
    return [nextRedPieceCount, nextWhitePieceCount];
  }

  movePieceTo(row, column) {
    if(this.state.isShowingAvailableMovesFor === null || this.state.availableMoves[row][column] !== 1) {
      return;
    }

    const [selectedPieceRow, selectedPieceColumn] = this.state.isShowingAvailableMovesFor;
    const destinationPieceValue = this.state.board[selectedPieceRow][selectedPieceColumn];
    let nextAvailableMoves = JSON.parse(JSON.stringify(cleanAvailableMovesState));
    let nextRedPieceCount = this.state.redPieceCount;
    let nextWhitePieceCount = this.state.whitePieceCount;

    let nextBoard = [...this.state.board];
    if(this.checkPromotion(row, destinationPieceValue)) {
      nextBoard[row][column] = destinationPieceValue + 10;
    } else {
      nextBoard[row][column] = destinationPieceValue;
    }
    nextBoard[selectedPieceRow][selectedPieceColumn] = 0;

    let hasMadeSkipMove = this.state.hasSkipped;
    if(Math.abs(row - selectedPieceRow) === 2) {
      [nextRedPieceCount, nextWhitePieceCount] = this.removePiece(row, column, selectedPieceRow, selectedPieceColumn, nextBoard);
      if(destinationPieceValue > 2) {
        nextAvailableMoves = showKingMoves(row, column, this.props.isWhiteMove, nextAvailableMoves, this.state.board, true);
      } else {
        nextAvailableMoves = this.props.isWhiteMove ? showMovesUp(row, column, this.props.isWhiteMove, nextAvailableMoves, this.state.board, true) : showMovesDown(row, column, this.props.isWhiteMove, nextAvailableMoves, this.state.board, true);
      }
      hasMadeSkipMove = true;
    }

    this.setState({
      ...this.state,
      board: nextBoard,
      availableMoves: nextAvailableMoves,
      isShowingAvailableMovesFor: [row, column],
      redPieceCount: nextRedPieceCount,
      whitePieceCount: nextWhitePieceCount,
      hasSkipped: hasMadeSkipMove
    });

    this.props.setMovedPieceCoordinates(row, column);
    if(!nextRedPieceCount || !nextWhitePieceCount) {
      this.props.setWinner(!nextRedPieceCount ? 'white' : 'red');
    }
  }

  checkPromotion(row, destinationPieceValue) {
    if(this.props.isWhiteMove) {
      return row === 0 && destinationPieceValue <= 2;
    } else {
      return row === 7 && destinationPieceValue <= 2;
    }
  }

  onClickPiece(row, column, event) {
    const isRedPiece = (this.state.board[row][column] % 10) - 1;
    if(this.props.isWhiteMove) {
      isRedPiece ? this.movePieceTo(row, column) : this.showMovesForPiece(row, column);
    } else {
      isRedPiece ? this.showMovesForPiece(row, column) : this.movePieceTo(row, column);
    }
    event.stopPropagation();
  }

  // white squares should never have a game piece
  renderBoard() {
    let boardDisplay = [];
    for(let row = 0; row < this.state.board.length; row++) {
      const rowDisplay = [];
      for(let column = 0; column < this.state.board[0].length; column++) {
        this.populateRow(row, column, rowDisplay);
      }
      boardDisplay.push(
        <div className='row'>
          {rowDisplay}
        </div>
      );
    }
    return boardDisplay;
  }

  populateRow(row, column, rowDisplay) {
    if(row % 2 === 0) {
      this.pushToRowDisplay(false, row, column, rowDisplay);
    } else {
      this.pushToRowDisplay(true, row, column, rowDisplay);
    }
  }

  pushToRowDisplay(isBlackSquareFirstInRow, row, column, rowDisplay) {
    column % 2 == isBlackSquareFirstInRow ?
      rowDisplay.push(
        <Square
          isWhiteSquare={true}
          hasWhitePiece={false}
          hasRedPiece={false}
        />
      ) : rowDisplay.push(
        <Square
          isWhiteSquare={false}
          hasWhitePiece={this.state.board[row][column] % 10 === 1}
          hasRedPiece={this.state.board[row][column] % 10 === 2}
          hasKingPiece={this.state.board[row][column] > 2}
          onClickPiece={(event) => this.onClickPiece(row, column, event)}
          onClickSquare={() => this.movePieceTo(row, column)}
          isHighlighted={this.state.availableMoves[row][column] !== 0}
          isWhiteMove={this.props.isWhiteMove}
        />
      );
  }

  render() {
    return (
      <div>
        {this.renderBoard()}
      </div>
    );
  }
}

export default Board;