import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'popper.js';
import 'bootswatch/dist/minty/bootstrap.min.css';
import 'bootstrap/js/dist/button';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/modal';
import 'bootstrap/js/dist/tooltip';
import './styles.scss';
import './store/listeners';

import App from './components/App';
import store from './store';

ReactDOM.render((
  <Provider store={store}>
    <App />
  </Provider>
), document.getElementById('app'));
