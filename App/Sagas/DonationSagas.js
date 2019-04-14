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

import { call, put, select } from 'redux-saga/effects'
import DonationActions from '../Redux/DonationRedux'
import { DonationSelectors } from '../Redux/DonationRedux'
import {
  uuidv4,
} from '../Utils/SquareUtils';
import Config from 'react-native-config'
import API from '../Services/Api'

export function * sendSquareCharge (action) {
  const { data } = action
  const donationRecord = yield select(DonationSelectors.getDonationRecord)
  const amount = parseInt(donationRecord.amount)*100
  console.log('DONATION', donationRecord, amount)
  const sqData = {
    "idempotency_key": uuidv4(),
    "amount_money": {
    "amount": amount,
    "currency": "USD"},
    "card_nonce": data
  }
  const SQUARE_LOCATION_ID = (process.env.NODE_ENV === 'production') ? Config.SQUARE_PRODUCTION_AGATHA_LOCATION_ID : Config.SQUARE_SANDBOX_LOCATION_ID
  const url = `https://connect.squareup.com/v2/locations/${SQUARE_LOCATION_ID}/transactions`
  console.log("SQUARE SAGA1", url, sqData)
  const api = API.square(url, sqData)
  try {
    const response = yield call(api.charge)
    console.log("RESPONSE", response.data)
    yield put(DonationActions.donationSuccess(response.data))
  } catch (error) {
      yield put(DonationActions.donationFailure())
  }
}