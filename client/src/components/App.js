import React, { Component } from 'react';
import {Route, Switch} from 'react-router-dom';

import Home from './Home';
import Legs from './Legs';
import Stops from './Stops';
import Driver from './Driver';
import BonusDriver from './BonusDriver';

import Navbar from './Navbar'; 

class App extends Component {
  render() {
    const App = () => (
      <div>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/legs' component={Legs} />
          <Route path='/stops' component={Stops} />
          <Route path='/driver' component={Driver} />
          <Route path='/bonusdriver' component={BonusDriver} />
        </Switch>
      </div>
    )
    return (
      <div className='app'>
        <header>
          <div className='wrapper'>
            <div>
              <h1><span className='green'>rose</span>rocket</h1>
              <h1><span className='green'>tech</span>challenge</h1>
            </div>
            <Navbar/>
          </div>
        </header>
        <main>
          <div className='wrapper'>
            <Switch>
              <App />
            </Switch>
          </div>
        </main>
        <footer>
          <div className='wrapper'>
            <p>Copyright © 2019 Lorem ipsum</p>
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
