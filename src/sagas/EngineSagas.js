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

import { call, put, fork, take, takeLatest, takeEvery } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'
import EngineActions, { EngineSelectors, EngineTypes } from '../redux/EngineRedux'

let EngineInstance

const createEngine = () => {
  const { ReferendaEngine } = require('../engine/engine.js')
  return new ReferendaEngine()
}

function * engineCommandResult() {
  const channel = eventChannel(emitter => {
    EngineInstance.on('me-engine-command-result', (result) => emitter(result))
    return () => {
      console.log(`Referenda Engine has an update`)
    }
  })
  while (true) {
    const result = yield take(channel)
    yield put(EngineActions.engineSuccess(result))
  }
}

function * engineCommandExec (action) {
  const {aCommand} = action
  aCommand.setTimeIssued()
  EngineInstance.engineCommandExec(aCommand)
}

export function * startEngine (action) {
  console.log('startEngine called')
  const { userData } = action
  EngineInstance = yield call(createEngine)
  yield fork(engineCommandResult)
  yield takeEvery(EngineTypes.ENGINE_COMMAND_EXEC, engineCommandExec)
}
