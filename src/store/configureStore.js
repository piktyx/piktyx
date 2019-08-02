import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers';
import { routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history';
import { createLogger } from 'redux-logger'

const debugware = [];
if (process.env.NODE_ENV !== 'production') {

    debugware.push(createLogger({
        collapsed: true,
    }));
}

export const history = createBrowserHistory()

export default function configureStore(initialState) {
    const store = createStore(
        rootReducer(history),
        initialState,
        compose(
            applyMiddleware(
              routerMiddleware(history), // for dispatching history actions
              thunkMiddleware, ...debugware
            ),
          ),
    );

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers', () => {
            const nextRootReducer = require('../reducers/index').default;

            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
}
