import { takeLatest, takeEvery, all, fork } from 'redux-saga/effects'
// import API from '../Services/Api'
import FixtureAPI from '../Services/FixtureApi'
import DebugConfig from '../Config/DebugConfig'

/* ------------- Types ------------- */

import { StartupTypes } from '../Redux/StartupRedux'
import { EngineTypes } from '../Redux/EngineRedux'
import { DonationTypes } from '../Redux/DonationRedux'

/* ------------- Sagas ------------- */

import { startup } from './StartupSagas'
import { startEngine } from './EngineSagas'
import { startPinata } from './PinataSagas'
import { sendSquareCharge } from './DonationSagas'

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield all([
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup),
    fork(startPinata),
    takeLatest(EngineTypes.INIT, startEngine),
    takeEvery(DonationTypes.DONATION_REQUEST, sendSquareCharge)
  ])
}