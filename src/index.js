import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import reducers from './reducers/index'
import {
    createStore,
    applyMiddleware,
    compose
} from 'redux'
import {
    Provider
} from 'react-redux'
import
thunk
from 'redux-thunk'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
let _store = createStore(reducers, composeEnhancers(applyMiddleware(thunk)))
ReactDOM.render( < Provider store = {
            _store
        } > < App / > < /Provider>, document.getElementById('root'));

        // If you want your app to work offline and load faster, you can change
        // unregister() to register() below. Note this comes with some pitfalls.
        // Learn more about service workers: https://bit.ly/CRA-PWA