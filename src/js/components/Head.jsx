import React, { Component } from 'react';

class Head extends Component {
  state = {
    title: 'initializr',
    sub: 'And yet another automation tool.',
  };
  render() {
    const { title, sub } = this.state;
    return (
      <React.Fragment>
        <h1 className='htitle'>{title}</h1>
        <p className='hsub'>{sub}</p>
      </React.Fragment>
    );
  }
}

export default Head;
