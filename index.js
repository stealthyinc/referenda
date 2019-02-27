import './App/Config/ReactotronConfig'
import './shim.js'
import crypto from 'crypto'
import { AppRegistry } from 'react-native'
import App from './App/Containers/App'

AppRegistry.registerComponent('referenda', () => App)
