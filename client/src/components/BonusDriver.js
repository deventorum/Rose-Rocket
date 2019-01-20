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
      newX: '0',
      newY: '0'
    }
    this.socket = null;
    this.updateX = this.updateX.bind(this);
    this.updateY = this.updateY.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
  updateX(event) {
    this.setState({ newX: event.target.value })
  }
  updateY(event) {
    this.setState({ newY: event.target.value })
  }
  handleSubmit(event) {
    event.preventDefault();
    const driverLocation = {
      type: 'updateBonusDriver',
      x: this.state.newX,
      y: this.state.newY
    }
    this.setState({
      newX: '0',
      newY: '0'
    })
    this.socket.send(JSON.stringify(driverLocation))
  }
  render() {
    return (
      <div className="bonus-driver">
        <Canvas stopsData={this.state.stopsData} legsData={this.state.legsData} bonusDriverLocation={this.state.bonusDriverLocation} updateDriver={this.updateDriver} />
        <form onSubmit={this.handleSubmit} className='update-driver'>
          <h2>Update Driver's Location</h2>
          <p>X coordinates</p>
          <input className='slider' type='range' name='progress' min='0' max='200' value={this.state.newX}
            onChange={this.updateX} />
          <p>{this.state.newX}</p>
          <p>Y coordinates</p>
          <input className='slider' type='range' name='progress' min='0' max='200' value={this.state.newY}
            onChange={this.updateY} />
          <p>{this.state.newY}</p>
          <input type='submit' value='Submit' />
        </form>
        <h3><Link to='/driver/'>Check other driver</Link></h3>
      </div>
    )
  }
}

export default BonusDriver;