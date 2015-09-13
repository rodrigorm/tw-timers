import React from 'react';
import ReactDOM from 'react-dom';
import Root from './containers/Root';
import { createHistory } from 'history';


const history = createHistory();

var root = document.createElement('div');
document.body.appendChild(root);

var mainLayout = document.getElementById('main_layout');
mainLayout.style.margin = '0';
mainLayout.style.width = '40%';

ReactDOM.render(
  <Root history={history} />,
  root
);
