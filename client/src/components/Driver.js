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
      newProgress: '',
      error: ''
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
      if (incomingData.error) {
        this.setState({error: incomingData.error})
      } else {
        this.setState({
          stopsData: incomingData.stopsData,
          legsData: incomingData.legsData,
          driverLocation: incomingData.driverLocation
        })
      }
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
      newProgress: '',
      error: ''
    })
    this.socket.send(JSON.stringify(driverLocation))
  }
  render() {
    const errorMessage = this.state.error ? <p className='error-message'>{this.state.error}</p> : '';
    return (
      <div className="Driver">
        <Canvas stopsData={this.state.stopsData} legsData={this.state.legsData}driverLocation={this.state.driverLocation} updateDriver={this.updateDriver}  />
        <form onSubmit={this.handleSubmit} className='update-driver'>
          <h2>Update Driver's Location</h2>
          <label>New Leg ID</label>
          <input type='text' name='legID' value={this.state.newLegID} onChange={this.updateLeg} maxLength='2'/>
          <label>Percentage of the leg completed</label>
          <input type='text' name='progress' value={this.state.newProgress}
          onChange={this.updateProgress} maxLength='3'/>
          <input type='submit' value='Submit' />
          {errorMessage}
        </form>
      </div>
    )
  }
}

export default Driver;