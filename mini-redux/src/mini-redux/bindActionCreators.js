const bindActionCreators = (actionCreators, dispatch) => {
  const dispatchProps = {}
  for(let key in actionCreators){
    dispatchProps[key] = bindActionCreator(actionCreators[key], dispatch)
  }
  return dispatchProps
}

function bindActionCreator(actionCreator, dispatch) {
  return (...args) => dispatch(actionCreator(...args))
}

export default bindActionCreators