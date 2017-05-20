'use strict';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import * as injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import Sales from './sales';

import './app.scss';

ReactDOM.render(
  <MuiThemeProvider>
    <Sales />
  </MuiThemeProvider>,
  document.querySelector('#app')
);
