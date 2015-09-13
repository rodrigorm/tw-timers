/* global __DEVTOOLS__ */
import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import configureStore from '../store/configureStore';
import routes from '../routes';


const store = configureStore();


function createElements(history) {
  const elements = [
    <Provider store={store} key="provider">
      <Router history={history} children={routes} />
    </Provider>
  ];

  if (typeof __DEVTOOLS__ !== 'undefined' && __DEVTOOLS__) {
    const { DevTools, DebugPanel, LogMonitor } = require('redux-devtools/lib/react');
    elements.push(
      <DebugPanel top right bottom key="debugPanel">
        <DevTools store={store} monitor={LogMonitor}/>
      </DebugPanel>
    );
  }
  return elements;
}


export default class Root extends Component {

  static propTypes = {
    history: PropTypes.object.isRequired
  };

  render() {
    var style = {
      position: 'fixed',
      right: 0,
      top: 0,
      bottom: 0,
      width: '50%',
      overflow: 'auto',
      zIndex: 99999,
      backgroundColor: '#fff'
    };
    return (
      <div style={style}>
        {createElements(this.props.history)}
      </div>
    );
  }
}
