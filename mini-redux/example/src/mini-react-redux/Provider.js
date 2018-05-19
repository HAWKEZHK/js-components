import React from 'react'
import PropTypes from 'prop-types'

// Provider 把store放到context中
class Provider extends React.Component{
  static childContextTypes = {
    store: PropTypes.object
  }
  getChildContext(){
    return {store: this.props.store}
  }
  render(){
    return this.props.children
  }
}

export default Provider