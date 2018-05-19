/* 
* 维护一个对象和一个数组分别存放当前State以及被监听的各个函数
* 触发一个初始化的action，避免命中自定义的action，触发一次更新，返回一个包含各个方法的对象
*/
const createStore = (reducers, enhancer) => {
  if(enhancer) return enhancer(createStore)(reducers)

  let currentState = {}, currentListeners = []
  const INITREDUX = '@@mini-redux/INIT'

  function getState(){
    return currentState
  }

  function subscribe(listener){
    currentListeners.push(listener)
  }

  function dispatch(action){
    currentState = reducers(currentState, action)
    currentListeners.forEach(listener => listener())
    return action
  }

  dispatch({ type: INITREDUX })
  return { getState, subscribe, dispatch }
}

export default createStore