import React, { Component } from 'react';
// import { Link } from 'react-router-dom';

import Canvas from './Canvas';


class Driver extends Component {
  constructor() {
    super();
    this.state = {
      stopsData: [],
      legsData: [],
      driverLocation: {},
      newLegID: '',
      newProgress: ''
    }
    this.socket = null;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateLeg = this.updateLeg.bind(this);
    this.updateProgress = this.updateProgress.bind(this);
  }
  componentDidMount() {
    this.socket = new WebSocket('ws://localhost:5000/');
    this.socket.onopen = function(event) {
      console.log(`Client connection is now ${event.type}`);
    }
    this.socket.onmessage = res => {
      const incomingData = JSON.parse(res.data);
      this.setState({
        stopsData: incomingData.stopsData,
        legsData: incomingData.legsData,
        driverLocation: incomingData.driverLocation
      })
    }
  }
  updateLeg(event) {
    this.setState({newLegID: event.target.value})
  }
  updateProgress(event) {
    this.setState({ newProgress: event.target.value })
  }
  handleSubmit(event) {
    event.preventDefault();
    const driverLocation = {
      type: 'updateDriver',
      leg: this.state.newLegID,
      progress: this.state.newProgress
    }
    this.setState({
      newLegID: '',
      newProgress: ''
    })
    this.socket.send(JSON.stringify(driverLocation))
  }
  render() {
    return (
      <div className="Driver">
        <Canvas stopsData={this.state.stopsData} legsData={this.state.legsData}driverLocation={this.state.driverLocation} updateDriver={this.updateDriver}  />
        <form onSubmit={this.handleSubmit} className='update-driver'>
        <label>
          New Leg ID
          <input type='text' name='legID' value={this.state.newLegID} onChange={this.updateLeg} maxLength='2'/>
        </label>
        <label>
          Percentage Completed
          <input type='text' name='progress' value={this.state.newProgress}
          onChange={this.updateProgress} maxLength='3'/>
        </label>
          <input type='submit' value='Submit' />
        </form>
      </div>
    )
  }
}

export default Driver;