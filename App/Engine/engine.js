import {AsyncStorage} from 'react-native'
const { EventEmitterAdapter } = require('./platform/reactNative/eventEmitterAdapter.js')

// Temporary local instance for development of Gun DB:
import {db} from './database';

export class ReferendaEngine extends EventEmitterAdapter {
  constructor () {
    super()
    this.initEngine()
  }

  async initEngine() {
    console.info("initEngine called")

    console.info(`Attempting to write ${now} to gun.`)
    const now = Date.now()
    db.instance().get('key').put({val: now}, (ack) => {
      if (ack && ack.ok) {
        console.info(`Wrote ${now} to gun.`)

        console.info(`Attempting to read ${now}`)
        db.instance().get('key').once((data, key) => {
          console.info(`Fetched key: ${key}`)
          console.info('data = ', data)
        })
      } else {
        console.error(`Unable to write ${now} to gun.`)
      }
    });
  }

  sendEngineData(data) {
    console.log("sendEngineData called")
  }
}
