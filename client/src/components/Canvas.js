import React, { Component } from 'react';

class Canvas extends Component {

  state = {
    sizeMultiplier: 6,
    stopsData: [],
    legsData: [],
    driverLocation: {},
    bonusDriverLocation: {}
  }
  componentWillReceiveProps(props) {
    this.setState({
      stopsData: props.stopsData,
      legsData: props.legsData,
      driverLocation: props.driverLocation,
      bonusDriverLocation: props.bonusDriverLocation
    });
  }
  componentDidUpdate() {
    // clears canvas 
    const ctx = this.refs.canvas.getContext('2d');
    ctx.clearRect(0,0,800,800);

    this.displayLegs(this.state.stopsData, '#5090E2', 1);
    if (this.state.driverLocation){
      let relevantStops;
      const lastStop = this.getLastStop(this.state.driverLocation);
      this.state.stopsData.forEach((stop, index) => {
        if (stop.name === lastStop) {
          relevantStops = this.state.stopsData.slice(index);
        }
      })
      // only shows last stop driver visited and stops he is going to visit
      this.displayStops(relevantStops);
      this.displayDriver(this.state.driverLocation);
    } else if (this.state.bonusDriverLocation) {
      console.log('Bonus');
      this.displayBonusDriver(this.state.bonusDriverLocation)
    } else {
      this.displayStops(this.state.stopsData);
    }
  }
  drawStop(obj, sameStop) {
    // sizeMultiplier is used to scale stop locations according to canvas size
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
  displayStops(arr) {
    arr.forEach((stop, index) => {
      if (index !== arr.length - 1) {
        this.drawStop(stop, false);
      }
      // checks if the first stop (A) is the same as the last stop (L) on the way, so the stop names don't overlap. Ideally, you want to check it for all stops, but for simplicity sake I'm just checking last one and first one, which are the same in the given dataset.
      else if (this.state.stopsData[0].x === stop.x && this.state.stopsData[0].y === stop.y) {
        this.drawStop(stop, true);
      }
    });
  }
  displayLegs(arr, color, lineWidth) {
    // iterates through all stops except last one
    for (let i = 0; i < arr.length - 1; i++) {
      this.drawLeg(arr[i], arr[i + 1], color, lineWidth);
    }
  }
  drawDriver(xCor, yCor) {
    const ctx = this.refs.canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(xCor, yCor, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#5090E2';
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.font = '15px serif';
    ctx.fillStyle = '#5090E2';
    ctx.fillText('Driver', xCor + 5, yCor - 10);
  }

  drawLeg(stop1, stop2, color, lineWidth) {
    const mult = this.state.sizeMultiplier;
    const xCor1 = stop1.x * mult;
    const xCor2 = stop2.x * mult;
    const yCor1 = stop1.y * mult;
    const yCor2 = stop2.y * mult;
    const ctx = this.refs.canvas.getContext('2d');
    ctx.moveTo(xCor1, yCor1);
    ctx.lineTo(xCor2, yCor2);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    // I like how you arranged the stops :))
  }
  displayDriver (driver) {
    let driverStop = this.getLastStop(driver);
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
    this.drawDriver(xDriver, yDriver);
    // renders a completed section of the route
    this.pathHighlight(xDriver, yDriver, driverStop, 'Completed Section')
  }

  getLastStop(driver) {
    let driverStop;
    this.state.legsData.forEach(leg => {
      if (leg.legID === driver.activeLegID) {
        driverStop = leg.startStop;
      }
    })
    return driverStop
  }

  pathHighlight(xDriver, yDriver, lastStop, text) {
    let completedStops;
    const currentLocation = {
      x: xDriver / this.state.sizeMultiplier,
      y: yDriver / this.state.sizeMultiplier
    }
    this.state.stopsData.forEach((stop, index) => {
      if (stop.name === lastStop) {
        // creates a new array of completed stops (doesn't include drivers between-stops location)
        completedStops = this.state.stopsData.slice(0, index + 1);
      }
    })
    // appends pseudo-stop (drivers exact location) to the array
    completedStops.push(currentLocation);
    const color = '#C85E5E';
    const lineWidth = 3;
    this.displayLegs(completedStops, color, lineWidth);
    // shows user how completed section looks
    this.showLegend(color, lineWidth, text)
  }
  showLegend(color, lineWidth, text) {
    const ctx = this.refs.canvas.getContext('2d');
    ctx.moveTo(5 * this.state.sizeMultiplier, 115 * this.state.sizeMultiplier);
    ctx.lineTo(15 * this.state.sizeMultiplier, 115 * this.state.sizeMultiplier);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.font = '15px serif';
    ctx.fillStyle = color;
    ctx.fillText(text, 16 * this.state.sizeMultiplier, 116 * this.state.sizeMultiplier);
  }
  displayBonusDriver(driver) {
    const xDriver = driver.x * this.state.sizeMultiplier;
    const yDriver = driver.y * this.state.sizeMultiplier;
    this.drawDriver(xDriver, yDriver);
  }

  render() {
    return (
      <canvas ref="canvas" width={800} height={800} />
    )
  }
}

export default Canvas;