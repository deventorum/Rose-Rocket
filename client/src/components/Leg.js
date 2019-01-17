import React, { Component } from 'react';

class Leg extends Component {
  render() {
    const {leg} = this.props
    const displayData = Object.values(leg).map(element => (
      <td>{element}</td>));
    return (
      <tr>
        {displayData}
      </tr>
    )
  }
}

export default Leg;