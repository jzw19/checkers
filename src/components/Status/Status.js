import React, { Component } from 'react';

class Status extends Component {
  render() {
    return(
      <div>
        {this.props.isWhiteMove ? 'White' : 'Red'}'s move
      </div>
    );
  }
}

export default Status;