import {connect} from '../mini-react-redux'
import {add, subtract, addAsync, subtractAsync} from '../actions'
import Counter from '../components/Counter'

const mapStateToProps = state => ({count: state.count})

const mapDispatchToProps = { add, subtract, addAsync, subtractAsync }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Counter)