'use strict';

import $ from 'jquery';
import jQuery from 'jquery';
window.$ = jQuery;
import 'bootstrap';
import './console';
import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import Links from './components/Links';

render(<App />, document.getElementById('header'));
render(<Links />, document.getElementById('links'));

particlesJS.load('particles-js', './particles-dark.json');

const _ = click => {
  return document.querySelector(click);
};
_('#toggle').onclick = () => {
  _('.init').classList.toggle('dark');
};
