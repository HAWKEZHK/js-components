export const ADD = 'ADD'
export const SUBTRACT = 'SUBTRACT'

export const add = () => ({ type: ADD })
export const subtract = () => ({ type: SUBTRACT })

export const addAsync = () => {
  return (dispatch, getState) => {
    setTimeout(() => { dispatch(add()) }, 1500)
  }
}
export const subtractAsync = () => {
  return (dispatch, getState) => {
    setTimeout(() => { dispatch(subtract()) }, 1500)
  }
}