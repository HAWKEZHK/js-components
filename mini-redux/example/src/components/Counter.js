import React from 'react'
const Counter = ({count, add, subtract, addAsync, subtractAsync}) => (
  <div>
    <h1>{count}</h1>
    <button onClick={add}>+</button>
    <button onClick={subtract}>-</button>
    <br />
    <button onClick={addAsync}>延时 +</button>
    <button onClick={subtractAsync}>延时 -</button>
  </div>
)
export default Counter