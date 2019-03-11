/* ***********************************************************
* A short word on how to use this automagically generated file.
* We're often asked in the ignite gitter channel how to connect
* to a to a third party api, so we thought we'd demonstrate - but
* you should know you can use sagas for other flow control too.
*
* Other points:
*  - You'll need to add this saga to sagas/index.js
*  - This template uses the api declared in sagas/index.js, so
*    you'll need to define a constant in that file.
*************************************************************/

import { call, put, fork, take, takeLatest } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'
import EngineActions, { EngineSelectors, EngineTypes } from '../Redux/EngineRedux'

let EngineInstance

const createEngine = (userData) => {
  const { ReferendaEngine } = require('../Engine/engine.js')
  return new ReferendaEngine(userData)
}

function * getEngineData () {
  const channel = eventChannel(emitter => {
    EngineInstance.on('me-engine-update', (data) => emitter(data))
    return () => {
      console.log(`Referend Engine has an update`)
    }
  })
  while (true) {
    const data = yield take(channel)
    yield put(EngineActions.engineSuccess(data))
  }
}

function * sendEngineData (action) {
  const { data } = action
  EngineInstance.sendEngineData(data)
}

export function * startEngine (action) {
  console.log('startEngine called')
  const { userData } = action
  EngineInstance = yield call(createEngine, userData)
  yield fork(getEngineData)
  yield takeLatest(EngineTypes.ENGINE_REQUEST, sendEngineData)
}