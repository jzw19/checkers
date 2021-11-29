import React, { Component } from 'react';
import Board from '../Board/Board';
import Status from '../Status/Status';

import './Game.scss';

// TODO: Consider having an undo button?
class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isWhiteMove: true,
      movedPieceCoordinates: null,
      winner: null
    }
    this.endTurn = this.endTurn.bind(this);
    this.setMovedPieceCoordinates = this.setMovedPieceCoordinates.bind(this);
    this.forfeitMatch = this.forfeitMatch.bind(this);
    this.setWinner = this.setWinner.bind(this);
  }

  endTurn() {
    this.setState({
      ...this.state,
      isWhiteMove: !this.state.isWhiteMove,
      movedPieceCoordinates: null,
    });
  }

  setMovedPieceCoordinates(row, column) {
    this.setState({
      ...this.state,
      movedPieceCoordinates: [row, column]
    });
  }

  setWinner(winner) {
    this.setState({
      ...this.state,
      winner: winner
    });
  }

  forfeitMatch() {
    this.state.isWhiteMove ? this.setWinner('red') : this.setWinner('white');
  }

  reset() {
    // TODO: Consider resetting state for Game and Board instead of refreshing?
    window.location.reload();
  }

  render() {
    if(this.state.winner) {
      return(
        <div>
          WINNER: {this.state.winner.toUpperCase()} PLAYER
          <br/>
          <button onClick={() => this.reset()}>Play Again</button>
        </div>
      );
    }

    return(
      
      <div className='game'>
        <Board
          isWhiteMove={this.state.isWhiteMove}
          movedPieceCoordinates={this.state.movedPieceCoordinates}
          setMovedPieceCoordinates={this.setMovedPieceCoordinates}
          setWinner={this.setWinner}
        />
        <div className='actionButtonContainer'>
          <button className='endTurnButton' onClick={() => this.endTurn()}>End Turn</button>
          <button className='forfeitButton' onClick={() => this.forfeitMatch()}>Forfeit Match</button>
        </div>
        <Status isWhiteMove={this.state.isWhiteMove} />
      </div>
    );
  }
}

export default Game;