import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Leg from './Leg';


class Legs extends Component {
  state = {
    legsData: []
  };
  componentDidMount() {
    this.callApi()
      .then(res => {
        this.setState({ legsData: res })
      })
      .catch(err => console.log(err));
  }
  callApi = async () => {
    const response = await fetch('/legs/');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };
  
  render() {
    const listOfLegs = 
    // Displays all legs from database
    this.state.legsData.map(leg => (
      <Leg leg={leg} key={leg.legID}/>
    ))
    return (
      <div className="legs">
        <h1>List of existing legs</h1>
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
      </div>
    )
  }
}

export default Legs;