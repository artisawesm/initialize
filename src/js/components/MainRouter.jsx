import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import About from './About';
import Skills from './Skills';

class MainRouter extends Component {
  state = {};
  render() {
    return (
      <Switch>
        <Route path='/about' component={About} />
        <Route path='/skills' component={Skills} />
      </Switch>
    );
  }
}

export default MainRouter;
