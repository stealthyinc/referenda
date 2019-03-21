import React, { Component } from 'react'
import { View, StatusBar } from 'react-native'
import ReduxNavigation from '../Navigation/ReduxNavigation'
import { connect } from 'react-redux'
import EngineActions from '../Redux/EngineRedux'
import StartupActions from '../Redux/StartupRedux'
import PinataActions from '../Redux/PinataRedux'
import ReduxPersist from '../Config/ReduxPersist'

// Styles
import styles from './Styles/RootContainerStyles'

class RootContainer extends Component {
  constructor() {
    super()
    this.engineStarted = false
  }

  componentDidMount() {
    if (!this.engineStarted) {
      this.engineStarted = true
      // this.props.init()
    }
    // if redux persist is not active fire startup action
    if (!ReduxPersist.active) {
      this.props.startup()
    }
    // this.props.pinataAddFile('../Assets/images/verified.png')
  }

  render() {
    return (
      <View style={styles.applicationView}>
        <StatusBar barStyle='light-content' />
        <ReduxNavigation />
      </View>
    )
  }
}

// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = (dispatch) => ({
  init: () => dispatch(EngineActions.init()),
  startup: () => dispatch(StartupActions.startup()),
  pinataAddFile: (file) => dispatch(PinataActions.pinataAddFile(file))
})

export default connect(null, mapDispatchToProps)(RootContainer)
