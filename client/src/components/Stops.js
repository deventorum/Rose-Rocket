import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Canvas from './Canvas'
class Stops extends Component {
  state = {
    stopsData: []
  };
  componentDidMount() {
    this.socket = new WebSocket('ws://localhost:5000/');
    this.socket.onopen = function (event) {
      console.log(`Client connection is now ${event.type}`);
    }
    this.socket.onmessage = res => {
      const incomingData = JSON.parse(res.data)
      this.setState({
        stopsData: incomingData.stopsData
      })
    }
  }

  render() {
    return (
      <div className="stops">
        <Canvas stopsData={this.state.stopsData} />
        <h3><Link to='/driver/'>Find your driver</Link></h3>
      </div>
    )
  }
}

export default Stops;