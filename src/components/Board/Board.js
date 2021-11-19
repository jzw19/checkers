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
      redPieceCount: 12,
      whitePieceCount: 12
    };

    this.hasPiece = this.hasPiece.bind(this);
    this.showMovesForPiece = this.showMovesForPiece.bind(this);
    this.movePieceTo = this.movePieceTo.bind(this);
    this.renderMoves = this.renderMoves.bind(this);
    this.renderBoard = this.renderBoard.bind(this);
    this.populateRow = this.populateRow.bind(this);
    this.onClickPiece = this.onClickPiece.bind(this);
    this.removePiece = this.removePiece.bind(this);
  }

  componentDidUpdate(prevProps) {
    if(this.props.isWhiteMove !== prevProps.isWhiteMove) {
      this.setState({
        ...this.state,
        availableMoves: cleanAvailableMovesState,
        isShowingAvailableMovesFor: null
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
        nextAvailableMoves = showKingMoves(row, column, this.props.isWhiteMove, nextAvailableMoves, this.state.board);
      } else if(pieceValue === 2) {
        nextAvailableMoves = showMovesDown(row, column, false, nextAvailableMoves, this.state.board);
      } else if(pieceValue === 1) {
        nextAvailableMoves = showMovesUp(row, column, true, nextAvailableMoves, this.state.board);
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
    const nextRedPieceCount = this.state.board[removalRow][removalColumn] === 2 ? this.state.redPieceCount - 1 : this.state.redPieceCount;
    const nextWhitePieceCount = this.state.board[removalRow][removalColumn] === 1 ? this.state.whitePieceCount - 1 : this.state.whitePieceCount;
    nextBoard[removalRow][removalColumn] = 0;
    return [nextRedPieceCount, nextWhitePieceCount];
  }

  movePieceTo(row, column) {
    if(this.state.isShowingAvailableMovesFor === null || this.state.availableMoves[row][column] !== 1) {
      return;
    }
    let nextAvailableMoves = JSON.parse(JSON.stringify(cleanAvailableMovesState));

    const selectedPieceRow = this.state.isShowingAvailableMovesFor[0];
    const selectedPieceColumn = this.state.isShowingAvailableMovesFor[1];
    const pieceValue = this.state.board[selectedPieceRow][selectedPieceColumn];
    let nextRedPieceCount = this.state.redPieceCount;
    let nextWhitePieceCount = this.state.whitePieceCount;

    let nextBoard = [...this.state.board];
    // TODO: need to check for promotion conditions here
    nextBoard[row][column] = pieceValue;
    nextBoard[selectedPieceRow][selectedPieceColumn] = 0;
    if(Math.abs(row - selectedPieceRow) === 2) {
      [nextRedPieceCount, nextWhitePieceCount] = this.removePiece(row, column, selectedPieceRow, selectedPieceColumn, nextBoard);
    }
    nextAvailableMoves = this.props.isWhiteMove ? showMovesUp(row, column, this.props.isWhiteMove, nextAvailableMoves, this.state.board) : showMovesDown(row, column, this.props.isWhiteMove, nextAvailableMoves, this.state.board);

    this.setState({
      ...this.state,
      board: nextBoard,
      availableMoves: nextAvailableMoves,
      isShowingAvailableMovesFor: [row, column],
      redPieceCount: nextRedPieceCount,
      whitePieceCount: nextWhitePieceCount
    });
    this.props.setMovedPieceCoordinates(row, column);
    if(!nextRedPieceCount || !nextWhitePieceCount) {
      this.props.setWinner(!nextRedPieceCount ? 'white' : 'red');
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
      column % 2 === 0 ?
        rowDisplay.push(
          <Square
            isWhiteSquare={true}
            hasWhitePiece={false}
            hasRedPiece={false}
          />
        ) : rowDisplay.push(
          <Square
            isWhiteSquare={false}
            hasWhitePiece={this.state.board[row][column] === 1}
            hasRedPiece={this.state.board[row][column] === 2}
            onClickPiece={(event) => this.onClickPiece(row, column, event)}
            onClickSquare={() => this.movePieceTo(row, column)}
            isHighlighted={this.state.availableMoves[row][column] !== 0}
            isWhiteMove={this.props.isWhiteMove}
          />
        );
    } else {
      column % 2 === 0 ?
        rowDisplay.push(
          <Square
            isWhiteSquare={false}
            hasWhitePiece={this.state.board[row][column] === 1}
            hasRedPiece={this.state.board[row][column] === 2}
            onClickPiece={(event) => this.onClickPiece(row, column, event)}
            onClickSquare={() => this.movePieceTo(row, column)}
            isHighlighted={this.state.availableMoves[row][column] !== 0}
            isWhiteMove={this.props.isWhiteMove}
          />
        ) : rowDisplay.push(
          <Square
            isWhiteSquare={true}
            hasWhitePiece={false}
            hasRedPiece={false}
          />
        );
    }
  }

  // TODO: This is a debugging method. Remove when app is done
  renderMoves() {
    const moves = [];
    for(const row of this.state.availableMoves) {
      const rowDisplay = [];
      for(const square of row) {
        rowDisplay.push(
          <div className="debug">
            {square}
          </div>
        );
      }
      moves.push(
        <div className="row">
          {rowDisplay}
        </div>
      );
    }
    return moves;
  }

  render() {
    return (
      <div>
        {this.renderBoard()}
        <br/>
        {this.renderMoves()}
      </div>
    );
  }
}

export default Board;