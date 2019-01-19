import React, { Component } from 'react';

class Canvas extends Component {

  state = {
    sizeMultiplier: 6,
    stopsData: [],
    legsData: [],
    driverLocation: {}
  }
  componentWillReceiveProps(props) {
    this.setState({
      stopsData: props.stopsData,
      legsData: props.legsData,
      driverLocation: props.driverLocation
    });
  }
  componentDidUpdate() {
    this.displayLegs();
    this.displayStops();
    if (this.state.driverLocation){
      this.displayDriver(this.state.driverLocation[0]);
    }
  }
  drawStop(obj, sameStop) {
    // sizeMultiplier is used to adjust stop location on a canvas that's bigger than 200x200
    const xCor = obj.x * this.state.sizeMultiplier;
    const yCor = obj.y * this.state.sizeMultiplier;
    const { name } = obj;
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
  displayDriver (driver) {
    let driverStop;
    this.state.legsData.forEach(leg => {
      if (leg.legID === driver.activeLegID) {
        driverStop = leg.startStop;
      }
    })
    let xCor1;
    let xCor2;
    let yCor1;
    let yCor2;
    this.state.stopsData.forEach((stop, index) => {
      if (driverStop === stop.name) {
        xCor1 = stop.x;
        yCor1 = stop.y;
        xCor2 = this.state.stopsData[index + 1].x
        yCor2 = this.state.stopsData[index + 1].y
      }
    })
    // Finds new x and y coordinates based on the two other data points and percentage completed
    const xDriver = (xCor1 + (xCor2 - xCor1) * driver.legProgress / 100) * this.state.sizeMultiplier;
    const yDriver = (yCor1 + (yCor2 - yCor1) * driver.legProgress / 100) * this.state.sizeMultiplier;
    const ctx = this.refs.canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(xDriver, yDriver, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#5090E2';
    ctx.fill();
    ctx.stroke();
    ctx.font = '15px serif';
    ctx.fillStyle = '#5090E2';
    ctx.fillText('Driver', xDriver + 5, yDriver - 10);
  }

  render() {
    return (
      <canvas ref="canvas" width={800} height={800} />
    )
  }
}

export default Canvas;