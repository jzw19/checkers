import React, {Component} from 'react';

import './Square.scss';
class Square extends Component {
  constructor(props) {
    super(props);

    this.renderPiece = this.renderPiece.bind(this);
  }

  renderPiece() {
    if(this.props.isWhiteSquare || (!this.props.hasWhitePiece && !this.props.hasRedPiece)) {
      return;
    }
    let className;
    if(this.props.hasWhitePiece) {
      className = 'white-piece';
    } else if(this.props.hasRedPiece) {
      className = 'red-piece';
    }
    // TODO: Use a text element to style the K so that it's more visible
    return this.props.hasKingPiece ?
      <button className={className} onClick={this.props.onClickPiece}>K</button>
      : <button className={className} onClick={this.props.onClickPiece}/>;
  }

  render() {
    let squareClassName = this.props.isWhiteSquare ?  'white' : 'black';
    squareClassName = squareClassName.concat(' square');
    if(this.props.isHighlighted) {
      squareClassName = squareClassName.concat(' highlighted');
    }

    return (
      <button className={squareClassName} onClick={this.props.onClickSquare} >
        {this.renderPiece()}
      </button>
    )
  }
}

export default Square;
