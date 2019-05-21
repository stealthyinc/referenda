import '../Config'
import DebugConfig from '../Config/DebugConfig'
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import RootContainer from './RootContainer'
import createStore from '../Redux'
import { SQIPCore } from 'react-native-square-in-app-payments';
import Config from 'react-native-config'
const { RefCrypto } = require('../Utils/RefCrypto')
console.disableYellowBox = true;
// create our store
const store = createStore()
/**
 * Provides an entry point into our application.  Both index.ios.js and index.android.js
 * call this component first.
 *
 * We create our Redux store here, put it into a provider and then bring in our
 * RootContainer.
 *
 * We separate like this to play nice with React Native's hot reloading.
 */
class App extends Component {
  async componentDidMount() {
    const SQUARE_APP_ID = (process.env.NODE_ENV === 'production') ? Config.SQUARE_PRODUCTION_APPLICATION_ID : Config.SQUARE_SANDBOX_APPLICATION_ID;
    console.log("****************SQUARE_APP_ID****************", SQUARE_APP_ID)
    await SQIPCore.setSquareApplicationId(SQUARE_APP_ID);
  }
  render () {
    return (
      <Provider store={store}>
        <RootContainer />
      </Provider>
    )
  }
}

// allow reactotron overlay for fast design in dev mode
export default DebugConfig.useReactotron
  ? console.tron.overlay(App)
  : App
