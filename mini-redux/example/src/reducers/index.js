const rootReducer = (state, action) => {
  switch (action.type) {
    case 'ADD':
      return {count: state.count + 1}
    case 'SUBTRACT':
      return {count: state.count - 1}
    default:
      return {count: 10}
  }
}

export default rootReducer