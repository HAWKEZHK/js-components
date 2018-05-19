// 嵌套调用函数，即compose
const compose = (...funcs) => {
  if(funcs.length === 0) return arg => arg
  if(funcs.length === 1) return funcs[0]
  return funcs.reduce((ret, item) => (...args) => ret(item(...args)))
}

export default compose