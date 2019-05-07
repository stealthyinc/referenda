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

import { call, put, select, takeLatest } from 'redux-saga/effects'
import DonationActions from '../Redux/DonationRedux'
import { DonationTypes, DonationSelectors } from '../Redux/DonationRedux'
import {
  uuidv4,
} from '../Utils/SquareUtils';
import Config from 'react-native-config'
import API from '../Services/Api'

export function * sendDonationMessage(action) {
  const { dPayload } = action
  const { tenders, reference_id } = dPayload.transaction
  // console.log( "DPAYLOAD", dPayload)
  // console.log("tenders", tenders)
  let message = "Thank you for your donation to Agatha's Campaign. We will notify you when the Referenda App is ready!"
  if (tenders && tenders[0]) {
    const { id } = tenders[0]
    const receipt = 'https://squareup.com/receipt/preview/' + id
    message = message + '\n' + receipt
  }
  // const donationRecord = yield select(DonationSelectors.getDonationRecord)
  const url = Config.TWILIO_LAMBDA_URL
  const api = API.twilio(url, reference_id, message)
  // console.log("IN DONATION FLOW", url, donationRecord)
  try {
    const response = yield call(api.send)
    console.log("TWILIO RESPONSE", response.data)
    yield put(DonationActions.twilioSuccess(response.data))
  } catch (error) {
      yield put(DonationActions.twilioFailure())
  }
}

export function * sendInvoiceMessage(action) {
  const { iPayload } = action
  const donationRecord = yield select(DonationSelectors.getDonationRecord)
  const message = `Thank you for your donation to Agatha's Campaign. Here's a helpful link for you to donate. We will notify you when the Referenda App is ready! ${iPayload}`
  const url = Config.TWILIO_LAMBDA_URL
  const api = API.twilio(url, donationRecord.phoneNumber, message)
  console.log("IN INVOICE FLOW", iPayload, url, donationRecord)
  try {
    const response = yield call(api.send)
    console.log("TWILIO RESPONSE", response.data)
    yield put(DonationActions.twilioSuccess(response.data))
  } catch (error) {
      yield put(DonationActions.twilioFailure())
  }
}

export function * sendSquareInvoice () {
  const donationRecord = yield select(DonationSelectors.getDonationRecord)
  const amount = parseFloat(donationRecord.amount)*100
  const stAmount = 0.01*amount
  const clAmount = 0.99*amount
  console.log('DONATION', donationRecord, amount)
  const shippingFlag = amount <= 2000
  const SQUARE_STEALTHY_LOCATION_ID = (process.env.NODE_ENV === 'production') ? Config.SQUARE_PRODUCTION_STEALTHY_LOCATION_ID : Config.SQUARE_SANDBOX_LOCATION_ID
  const data = {
    "idempotency_key": uuidv4(),
    "order": {
      "reference_id": donationRecord.phoneNumber,
      "line_items": [
        {
          "name": "Donation to Agatha Bacelar's Campaign",
          "quantity": "1",
          "base_price_money": {
            "amount": clAmount,
            "currency": "USD"
          }
        }
      ]
    },
    "ask_for_shipping_address": shippingFlag,
    "pre_populate_shipping_address": {
      "first_name": donationRecord.firstName,
      "last_name": donationRecord.lastName
    },
    "merchant_support_email": "support@stealthy.im",
    "additional_recipients": [
      {
        "location_id": SQUARE_STEALTHY_LOCATION_ID,
        "description": "Application fees",
        "amount_money": {
          "amount": stAmount,
          "currency": "USD"
        }
      }
    ]
  }
  const SQUARE_LOCATION_ID = (process.env.NODE_ENV === 'production') ? Config.SQUARE_PRODUCTION_AGATHA_LOCATION_ID : Config.SQUARE_SANDBOX_LOCATION_ID
  const url = `https://connect.squareup.com/v2/locations/${SQUARE_LOCATION_ID}/checkouts`
  // console.log("SQUARE SAGA1", url, data)
  const api = API.squareInvoice(url, data)
  try {
    const response = yield call(api.invoice)
    console.log("RESPONSE", response.data)
    yield put(DonationActions.invoiceSuccess(response.data.checkout.checkout_page_url))
  } catch (error) {
      yield put(DonationActions.invoiceFailure())
  }
}

export function * sendSquareCharge (action) {
  const { data } = action
  const donationRecord = yield select(DonationSelectors.getDonationRecord)
  const amount = parseFloat(donationRecord.amount)*100
  const stAmount = 0.01*amount
  const clAmount = 0.99*amount
  console.log('DONATION', donationRecord, amount)
  const SQUARE_STEALTHY_LOCATION_ID = (process.env.NODE_ENV === 'production') ? Config.SQUARE_PRODUCTION_STEALTHY_LOCATION_ID : Config.SQUARE_SANDBOX_LOCATION_ID
  const sqData = {
    "idempotency_key": uuidv4(),
    "reference_id": donationRecord.phoneNumber,
    "amount_money": {
    "amount": clAmount,
    "currency": "USD"},
    "card_nonce": data,
    "additional_recipients": [
      {
        "location_id": SQUARE_STEALTHY_LOCATION_ID,
        "description": "Application fees",
        "amount_money": {
          "amount": stAmount,
          "currency": "USD"
        }
      }
    ]
  }
  const SQUARE_LOCATION_ID = (process.env.NODE_ENV === 'production') ? Config.SQUARE_PRODUCTION_AGATHA_LOCATION_ID : Config.SQUARE_SANDBOX_LOCATION_ID
  const url = `https://connect.squareup.com/v2/locations/${SQUARE_LOCATION_ID}/transactions`
  // console.log("SQUARE SAGA1", url, sqData)
  const api = API.squareCharge(url, sqData)
  try {
    const response = yield call(api.charge)
    // console.log("RESPONSE", response.data)
    yield put(DonationActions.donationSuccess(response.data))
  } catch (error) {
      yield put(DonationActions.donationFailure())
  }
}

export function* startSquare (action) {
  yield takeLatest(DonationTypes.INVOICE_REQUEST, sendSquareInvoice)
  yield takeLatest(DonationTypes.DONATION_REQUEST, sendSquareCharge)
  yield takeLatest(DonationTypes.DONATION_SUCCESS, sendDonationMessage)
  yield takeLatest(DonationTypes.INVOICE_SUCCESS, sendInvoiceMessage)
}
