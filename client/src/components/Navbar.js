import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class Navbar extends Component {
  render() {
    return (
      <nav className="nav-main">
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/legs/'>Legs</Link></li>
          <li><Link to='/stops/'>Stops</Link></li>
          <li><Link to='/driver/'>Driver Location</Link></li>
        </ul>
      </nav>
    )
  }
}

export default Navbar;