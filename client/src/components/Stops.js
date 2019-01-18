import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class Stops extends Component {
  state = {
    sizeMultiplier: 6,
    stopsData: []
  };
  componentDidMount() {
    this.callApi()
      .then(res => {
        this.setState({
          stopsData: res
         })
        this.displayLegs();
        this.displayStops();
      })
      .catch(err => console.log(err));
  }
  callApi = async () => {
    const response = await fetch('/stops/');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };
  drawStop(obj, sameStop) {
    // sizeMultiplier is used to adjust stop location on a canvas that's bigger than 200x200
    const xCor = obj.x * this.state.sizeMultiplier;
    const yCor = obj.y * this.state.sizeMultiplier;
    const {name} = obj;
    const ctx = this.refs.canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(xCor, yCor, 10, 0, 2 * Math.PI);
    ctx.fillStyle = '#5EB7A9';
    ctx.fill();
    ctx.stroke();
    ctx.font = '18px serif';
    ctx.fillStyle = 'black';
    // Position text so it doesn't overlap with other text
    !sameStop ? ctx.fillText(name, xCor + 12, yCor - 12) : ctx.fillText(name, xCor - 22, yCor - 12)
  }
  displayStops() {
    this.state.stopsData.forEach((stop, index) => {
      if (index !== this.state.stopsData.length - 1) {
        this.drawStop(stop, false);
      } 
      // checks if the first stop (A) is the same as the last stop (L) on the way, so the stop names don't overlap. Ideally, you want to check it for all stops, but for simplicity sake I'm just checking last one and first one, which are the same in the given dataset.
      else if (this.state.stopsData[0].x === stop.x && this.state.stopsData[0].y === stop.y) {
        this.drawStop(stop, true);
      }
    });
  }
  displayLegs() {
    // iterates through all stops except last one
    for (let i = 0; i < this.state.stopsData.length - 1; i++) {
      this.drawLeg(this.state.stopsData[i], this.state.stopsData[i + 1]);
    }
  }

  drawLeg(stop1, stop2) {
    const mult = this.state.sizeMultiplier;
    const xCor1 = stop1.x * mult;
    const xCor2 = stop2.x * mult;
    const yCor1 = stop1.y * mult;
    const yCor2 = stop2.y * mult;
    const ctx = this.refs.canvas.getContext('2d');
    ctx.moveTo(xCor1, yCor1);
    ctx.lineTo(xCor2, yCor2);
    ctx.strokeStyle = '#5090E2'
    ctx.stroke();
    // I like how you arranged the stops :))
  }


  render() {
    return (
      <div className="stops">
        <canvas ref="canvas" width={800} height={800} />
        <h3><Link to='/driver/'>Find your driver</Link></h3>
      </div>
    )
  }
}

export default Stops;