import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router'

import { App } from './containers/App';

import configureStore, { history } from './store/configureStore';

import './style.scss';
//import "../node_modules/video-react/styles/scss/video-react"; 

require('expose-loader?$!expose-loader?jQuery!jquery');

const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App />
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
);
