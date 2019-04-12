import React, { Component } from 'react'
import {  AppState,
          StatusBar,
          Text,
          View } from 'react-native'
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
    this.appState = AppState.currentState
    this.engineStarted = false

    // Globally disable consideration of iOS font
    // accessibility settings:
    //
    // TODO: Change this to be a max scaling setting instead when time permits.
    // (idea beign there is a default scaling and the accessibility settings
    // would bump it up to a usable max).
    //
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange)

    if (!this.engineStarted) {
      this.engineStarted = true
      this.props.init()
    }
    // if redux persist is not active fire startup action
    if (!ReduxPersist.active) {
      this.props.startup()
    }
    // this.props.pinataAddFile('../Assets/images/verified.png')
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange)
  }

  _handleAppStateChange(nextAppState) {
    if (this.appState && this.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!')
      if (this.engineStarted) {

      }
    } else if (this.appState && this.appState.match(/active/) && nextAppState === 'inactive') {
      console.log('App has gone to the background!')
      if (this.engineStarted) {

      }
    }
    this.appState = nextAppState
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
