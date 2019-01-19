import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Canvas from './Canvas'
class Stops extends Component {
  state = {
    stopsData: []
  };
  componentDidMount() {
    this.callApi()
      .then(res => {
        this.setState({
          stopsData: res
         })
      })
      .catch(err => console.log(err));
  }
  callApi = async () => {
    const response = await fetch('/stops/');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

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