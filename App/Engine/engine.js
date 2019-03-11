import {AsyncStorage} from 'react-native'
const { EventEmitterAdapter } = require('./platform/reactNative/eventEmitterAdapter.js')

export class ReferendaEngine extends EventEmitterAdapter {
  constructor () {
    super()
    this.initEngine()
  }

  async initEngine() {
    console.log("initEngine called")
  }

  sendEngineData(data) {
    console.log("sendEngineData called")
  }
}