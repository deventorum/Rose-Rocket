import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Canvas from './Canvas';

const SelectComponent = (props) => (
  <select name={props.name}
    onChange={props.handleSelect}
    value={props.value}
  >
    <Option
      name='Select'
      value=''
      text='Select Leg ID'
    />
    {props.legs.map((leg, index) => <Option
      key={index}
      name={leg.legID}
      value={leg.legID}
      text={leg.legID}
      handleSelect={props.handleSelect}
    />
    )}
  </select>
);

const Option = (props) => (
  <option
    value={props.value}
  >{props.text}</option>
)

class Driver extends Component {
  constructor() {
    super();
    this.state = {
      stopsData: [],
      legsData: [],
      driverLocation: {},
      newLegID: '',
      newProgress: '0',
      error: ''
    }
    this.socket = null;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateProgress = this.updateProgress.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
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
  updateProgress(event) {
    this.setState({ newProgress: event.target.value })
  }
  handleSelect(event) {
    console.log(event.target);
    this.setState({ newLegID: event.target.value })
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
      newProgress: '0',
      error: ''
    })
    this.socket.send(JSON.stringify(driverLocation))
  }
  render() {
    const errorMessage = this.state.error ? <p className='error-message'>{this.state.error}</p> : '';

    return (
      <div className="driver">
        <Canvas stopsData={this.state.stopsData} legsData={this.state.legsData}driverLocation={this.state.driverLocation} updateDriver={this.updateDriver}  />
        <form onSubmit={this.handleSubmit} className='update-driver'>
          <h2>Update Driver's Location</h2>
          <SelectComponent
            name="newLeg"
            legs={this.state.legsData}
            value={this.state.newLegID}
            handleSelect={this.handleSelect}
          />
          <label>Percentage of the leg completed</label>
          <input className='slider' type='range' name='progress' min='0' max='100' value={this.state.newProgress}
          onChange={this.updateProgress}/>
          <p>{this.state.newProgress} %</p>
          <input type='submit' value='Submit' />
          {errorMessage}
        </form>
        <h3><Link to='/bonusdriver/'>Check second driver</Link></h3>
      </div>
    )
  }
}

export default Driver;