import React, { Component } from 'react'
import {  
  AppState,
  Platform,
  StatusBar,
  Text,
  View 
} from 'react-native'
import ReduxNavigation from '../navigation/ReduxNavigation'
import { connect } from 'react-redux'
import EngineActions from '../redux/EngineRedux'
import StartupActions from '../redux/StartupRedux'
import PinataActions from '../redux/PinataRedux'
import ReduxPersist from '../config/ReduxPersist'
import BackgroundFetch from "react-native-background-fetch";
import { Bootstrap } from '../config/Bootstrap'
import { data } from '../data'
// import WebRoutesGenerator from '../navigation/webRouteWrapper';
import { WebRoutes } from '../navigation/Routes';
import { ModalContainer } from "react-router-modal";
// Styles
import styles from './styles/RootContainerStyles'

Bootstrap();
data.populateData();

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
    // Configure it.
    if (Platform.OS !== 'web') {
      BackgroundFetch.configure({
        minimumFetchInterval: 15, // <-- minutes (15 is minimum allowed)
        stopOnTerminate: false,   // <-- Android-only,
        startOnBoot: true         // <-- Android-only
      }, () => {
        console.log("[js] Received background-fetch event");
        // Required: Signal completion of your task to native code
        // If you fail to do this, the OS can terminate your app
        // or assign battery-blame for consuming too much background-time
        BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
      }, (error) => {
        console.log("[js] RNBackgroundFetch failed to start");
      });
      // Optional: Query the authorization status.
      BackgroundFetch.status((status) => {
        switch(status) {
          case BackgroundFetch.STATUS_RESTRICTED:
            console.log("BackgroundFetch restricted");
            break;
          case BackgroundFetch.STATUS_DENIED:
            console.log("BackgroundFetch denied");
            break;
          case BackgroundFetch.STATUS_AVAILABLE:
            console.log("BackgroundFetch is enabled");
            break;
        }
      });
    }
    AppState.addEventListener('change', this._handleAppStateChange)

    if (!this.engineStarted) {
      this.engineStarted = true
      this.props.init()
    }
    // if redux persist is not active fire startup action
    if (!ReduxPersist.active) {
      this.props.startup()
    }
    // this.props.pinataAddFile('../assets/images/verified.png')
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
    if (Platform.OS === 'web') {
      console.log("&*&*&*&*&*&*&*&")
      return (
        <View style={{ height: "100vh", width: "100vw" }}>
          {/*<TopNav />*/}
          {WebRoutesGenerator({ routeMap: WebRoutes })}
          <ModalContainer />
        </View>
      );
    }
    else {
      console.log("$%$%$%$%$%$%$%$")
      return (
        <View style={styles.applicationView}>
          <StatusBar barStyle='light-content' />
          <ReduxNavigation />
        </View>
      )
    }
  }
}

// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = (dispatch) => ({
  init: () => dispatch(EngineActions.init()),
  startup: () => dispatch(StartupActions.startup()),
  pinataAddFile: (file) => dispatch(PinataActions.pinataAddFile(file))
})

export default connect(null, mapDispatchToProps)(RootContainer)
