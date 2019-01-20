import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Canvas from './Canvas';

class BonusDriver extends Component {
  constructor() {
    super();
    this.state = {
      stopsData: [],
      legsData: [],
      bonusDriverLocation: {},
    }
    this.socket = null;
  }
  componentDidMount() {
    this.socket = new WebSocket('ws://localhost:5000/');
    this.socket.onopen = function (event) {
      console.log(`Client connection is now ${event.type}`);
    }
    this.socket.onmessage = res => {
      const incomingData = JSON.parse(res.data);
      this.setState({
        stopsData: incomingData.stopsData,
        legsData: incomingData.legsData,
        bonusDriverLocation: incomingData.bonusDriverLocation
      })
    }
  }
  render() {
    return (
      <div className="bonus-driver">
        <Canvas stopsData={this.state.stopsData} legsData={this.state.legsData} bonusDriverLocation={this.state.bonusDriverLocation} updateDriver={this.updateDriver} />
        <h3><Link to='/driver/'>Check other driver</Link></h3>
      </div>
    )
  }
}

export default BonusDriver;