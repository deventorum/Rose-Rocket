import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Leg from './Leg';


class Legs extends Component {
  state = {
    legsData: []
  };
  componentDidMount() {
    this.socket = new WebSocket('ws://localhost:5000/');
    this.socket.onopen = function (event) {
      console.log(`Client connection is now ${event.type}`);
    }
    this.socket.onmessage = res => {
      const incomingData = JSON.parse(res.data)
      this.setState({legsData: incomingData.legsData})
    }
  }
  
  render() {
    const listOfLegs = 
    // Displays all legs from the database
    this.state.legsData.map(leg => (
      <Leg leg={leg} key={leg.legID}/>
    ))
    return (
      <div className="legs">
        <h2>List of existing legs</h2>
        <table>
          <tbody>
            <tr>
              <th>Starting Stop</th>
              <th>Ending Stop</th>
              <th>Speed Limit</th>
              <th>Leg ID</th>
            </tr>
            {listOfLegs}
          </tbody>
        </table>
        <h3><Link to='/stops/'>Check location of the stops</Link></h3>
      </div>
    )
  }
}

export default Legs;