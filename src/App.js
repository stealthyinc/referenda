import React from 'react';
import { Platform, View } from 'react-native';
import createStore from './redux'
import RootContainer from './containers/RootContainer'
import { Provider } from 'react-redux'
import './config'

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
class App extends React.Component {
  render () {
    console.log("*******************************************", Platform.OS)
    return (
      <Provider store={store}>
        <RootContainer />
      </Provider>
    )
  }
}

// const dApp = createAppContainer(App)

let hotWrapper = () => () => App;
if (Platform.OS === 'web') {
  const { hot } = require('react-hot-loader');
  hotWrapper = hot;
}
export default hotWrapper(module)(App);
