import '../Config'
import DebugConfig from '../Config/DebugConfig'
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import RootContainer from './RootContainer'
import createStore from '../Redux'
console.disableYellowBox = true;
// create our store
const store = createStore()
import bip39 from 'react-native-bip39'
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
  static generateMnemonic = async () => {
    try {
      return await bip39.generateMnemonic(128) // default to 128
    } catch(e) {
      return false
    }
  }

  render () {
    // console.log('generateMnemonic phrases', generateMnemonic())
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
