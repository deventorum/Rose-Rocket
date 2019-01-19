import React, { Component } from 'react';
// import { Link } from 'react-router-dom';

import Canvas from './Canvas';


class Driver extends Component {
  state = {
    stopsData: [],
    legsData: [],
    driverLocation: {}
  };
  componentDidMount() {
    this.callApi()
      .then(res => {
        this.setState({
          stopsData: res.stopsData,
          legsData: [],
          driverLocation: {}
        })
      })
      .catch(err => console.log(err));
  }
  callApi = async () => {
    const response = await fetch('/driver/');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };
  render() {
    return (
      <div className="Driver">
        <Canvas stopsData={this.state.stopsData} legsData={this.state.legsData}driverLocation={this.state.driverLocation}  />
      </div>
    )
  }
}

export default Driver;