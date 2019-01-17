import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class Home extends Component {
  render() {
    return (
      <div className='home'>
        <div className='welcome'>
          <h1>Welcome to Rose Rocket</h1>
          <img src='./rose-rocket.jpg' alt='' className='rocket'></img>
        </div>
        <div>
          <h2><Link to='./driver/'>Driver's current location</Link></h2>
          <h2><Link to='./stops/'>Find your stop</Link></h2>
          <h2><Link to='./legs/'>Information about existing legs</Link></h2>
        </div>
      </div>
    )
  }
}

export default Home;