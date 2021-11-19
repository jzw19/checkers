import React, {Component} from 'react';

import './Square.scss';
class Square extends Component {
  constructor(props) {
    super(props);

    this.renderPiece = this.renderPiece.bind(this);
  }

  renderPiece() {
    if(this.props.hasWhitePiece) {
      return(
        <button className="white-piece" onClick={this.props.onClickPiece} />
      );
    } else if(this.props.hasRedPiece) {
      return(
        <button className="red-piece" onClick={this.props.onClickPiece} />
      );
    } else {
      return null;
    }
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
