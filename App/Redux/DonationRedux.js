import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  twilioRequest: [],
  invoiceRequest: [],
  twilioFailure: null,
  invoiceFailure: null,
  donationFailure: null,
  donationRequest: ['data'],
  twilioSuccess: ['tPayload'],
  invoiceSuccess: ['iPayload'],
  donationSuccess: ['dPayload'],
  storeDonationRecord: ['donationRecord']
})

export const DonationTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: null,
  dFetching: null,
  dPayload: null,
  dError: null,
  iFetching: null,
  iPayload: null,
  iError: null,
  tFetching: null,
  tPayload: null,
  tError: null,
  donationRecord: {
    amount: '',
    phoneNumber: '',
    firstName: '',
    lastName: '',
    occupation: '',
    employer: ''
  }
})

/* ------------- Selectors ------------- */

export const DonationSelectors = {
  getDonationError: state => state.donation.dError,
  getDonationSuccess: state => state.donation.dPayload,
  getDonationFetching: state => state.donation.dFetching,
  getInvoiceError: state => state.donation.iError,
  getInvoiceSuccess: state => state.donation.iPayload,
  getInvoiceFetching: state => state.donation.iFetching,
  getTwilioError: state => state.donation.tError,
  getTwilioSuccess: state => state.donation.tPayload,
  getTwilioFetching: state => state.donation.tFetching,
  getDonationRecord: state => state.donation.donationRecord
}

/* ------------- Reducers ------------- */

export const storeDonationRecord = (state, {donationRecord}) => state.merge({ donationRecord })

// request the data from an api
export const donationRequest = (state, action) => {
  const { data } = action
  return state.merge({ dFetching: true, data, dPayload: null })
}

// successful api lookup
export const donationSuccess = (state, action) => {
  const { dPayload } = action
  return state.merge({ dFetching: false, dError: null, dPayload })
}

// Something went wrong somewhere.
export const donationFailure = state =>
  state.merge({ dFetching: false, dError: true, dPayload: null })

// request the data from an api
export const invoiceRequest = (state) =>
  state.merge({ iFetching: true, iPayload: null })

// successful api lookup
export const invoiceSuccess = (state, action) => {
  const { iPayload } = action
  return state.merge({ iFetching: false, iError: null, iPayload })
}

// Something went wrong somewhere.
export const invoiceFailure = state =>
  state.merge({ iFetching: false, iError: true, iPayload: null })

// request the data from an api
export const twilioRequest = (state) =>
  state.merge({ tFetching: true, tPayload: null })

// successful api lookup
export const twilioSuccess = (state, action) => {
  const { tPayload } = action
  return state.merge({ tFetching: false, tError: null, tPayload })
}

// Something went wrong somewhere.
export const twilioFailure = state =>
  state.merge({ tFetching: false, tError: true, tPayload: null })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.TWILIO_REQUEST]: twilioRequest,
  [Types.TWILIO_SUCCESS]: twilioSuccess,
  [Types.TWILIO_FAILURE]: twilioFailure,
  [Types.INVOICE_REQUEST]: invoiceRequest,
  [Types.INVOICE_SUCCESS]: invoiceSuccess,
  [Types.INVOICE_FAILURE]: invoiceFailure,
  [Types.DONATION_REQUEST]: donationRequest,
  [Types.DONATION_SUCCESS]: donationSuccess,
  [Types.DONATION_FAILURE]: donationFailure,
  [Types.STORE_DONATION_RECORD]: storeDonationRecord,
})
