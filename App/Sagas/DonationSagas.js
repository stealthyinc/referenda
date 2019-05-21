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

/**
 * getAmountInCentsFromDonation - converts a string in USD, aDonationStrUSD to
 *                                an integer in cents, rounded down. Then
 *                                calculations proceeds and a commission in
 *                                cents. Commission is rounded up to the nearest
 *                                cent.
 *
 * @return: an object containing the total donation in cents, the fee in cents,
 *          and the proceeds in cents.
 *
 * Does not handle errors in aDonationStrUSD. That argument must be properly
 * constructed for processing by parseFloat.
 */
function getAmountInCentsFromDonation(aDonationStrUSD) {
  //
  // Convert from USD to Cents, discard fractional portion:
  const totalCents = Math.floor(parseFloat(aDonationStrUSD) * 100)
  //
  // Calculate 1% commission, rounded to the nearest cent:
  const feeCents = Math.ceil(totalCents / 100)
  //
  return {
    totalCents: totalCents,
    proceedsCents: (totalCents - feeCents),
    feeCents: feeCents
  }
}

export function * sendSquareCharge (action) {
  const { data } = action
  console.log("INSIDE SQUARE CHARGE", data)
  const donationRecord = yield select(DonationSelectors.getDonationRecord)
  const { phoneNumber, amount } = donationRecord
  const amounts = getAmountInCentsFromDonation(amount)
  const feeAmount = amounts.feeCents
  const donationAmount = amounts.proceedsCents
  console.log('DONATION(cents: total, fee, proceeds):', amounts.totalCents, feeAmount, donationAmount)
  const message = "Thank you for your donation to Agatha's Campaign. We will notify you when the Referenda App is ready!"
  const locationId = '0WNJSXGSXWG89'
  const body = {
    card_nonce: data, 
    locationId, 
    donationAmount, 
    feeAmount, 
    phoneNumber, 
    message
  }
  console.log("BODY", body)
  try {
    const api = API.squareService(body)
    const response = yield call(api.charge)
    console.log("RESPONSE", response.data)
    yield put(DonationActions.donationSuccess(response.data))
  } catch (error) {
      console.log("ERROR", error)
      yield put(DonationActions.donationFailure())
  }
}

export function * sendSquareInvoice () {
  const donationRecord = yield select(DonationSelectors.getDonationRecord)
  const { firstName, lastName, phoneNumber, amount } = donationRecord
  const amounts = getAmountInCentsFromDonation(amount)
  const feeAmount = amounts.feeCents
  const donationAmount = amounts.proceedsCents
  const shippingFlag = amounts.totalCents <= 2000
  console.log('DONATION(cents: total, fee, proceeds):', amounts.totalCents, feeAmount, donationAmount)
  const message = `Thank you for your donation to Agatha's Campaign. Here's a helpful link for you to donate. We will notify you when the Referenda App is ready!`
  const campaign_message = "Donation to Agatha Bacelar's Campaign"
  const locationId = '0WNJSXGSXWG89'
  const pre_populate_shipping_address = {
    "first_name": firstName,
    "last_name": lastName
  }
  const isMobile = true
  const data = {
    message,
    campaign_message,
    locationId,
    donationAmount,
    feeAmount,
    phoneNumber,
    pre_populate_shipping_address,
    isMobile
  }
  console.log("Data being sent to api sauce", data)
  try {
    const api = API.squareService(data)
    const response = yield call(api.invoice)
    console.log("RESPONSE", response.data)
    yield put(DonationActions.invoiceSuccess(response.data))
  } catch (error) {
      console.log("ERROR", error)
      yield put(DonationActions.invoiceFailure())
  }
}

export function* startSquare (action) {
  yield takeLatest(DonationTypes.DONATION_REQUEST, sendSquareCharge)
  yield takeLatest(DonationTypes.INVOICE_REQUEST, sendSquareInvoice)
}
