import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker'

import { createStore, applyMiddleware } from './mini-redux'
import { Provider } from './mini-react-redux'
import thunk from './mini-middlewares/mini-redux-thunk'

import Counter from './containers/Counter'
import reducers from './reducers'

const store = createStore(reducers, applyMiddleware(thunk))

ReactDOM.render(
  <Provider store={store}>
    <Counter />
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker();
