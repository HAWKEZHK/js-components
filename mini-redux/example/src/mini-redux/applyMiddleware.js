import compose from './compose'

// 改写dispatch
const applyMiddleware = (...middlewares) => {
  return createStore => (reducers) => {
    const store = createStore(reducers)
    let {getState, dispatch} = store
    const midApi = {
      getState,
      dispatch: (...args) => dispatch(...args)
    }
    const middlewareChain = middlewares.map(middleware => middleware(midApi))
    dispatch = compose(...middlewareChain)(store.dispatch)
    return { ...store, dispatch }
  }
}

export default applyMiddleware