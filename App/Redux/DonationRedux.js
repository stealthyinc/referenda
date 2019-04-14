import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  donationRequest: ['data'],
  donationSuccess: ['payload'],
  donationFailure: null,
  storeDonationRecord: ['donationRecord']
})

export const DonationTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: null,
  fetching: null,
  payload: null,
  error: null,
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
  getDonationError: state => state.donation.error,
  getDonationSuccess: state => state.donation.payload,
  getDonationFetching: state => state.donation.fetching,
  getDonationRecord: state => state.donation.donationRecord
}

/* ------------- Reducers ------------- */

export const storeDonationRecord = (state, {donationRecord}) => state.merge({ donationRecord })

// request the data from an api
export const request = (state, action) => {
  const { data } = action
  return state.merge({ fetching: true, data, payload: null })
}

// successful api lookup
export const success = (state, action) => {
  const { payload } = action
  return state.merge({ fetching: false, error: null, payload })
}

// Something went wrong somewhere.
export const failure = state =>
  state.merge({ fetching: false, error: true, payload: null })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.DONATION_REQUEST]: request,
  [Types.DONATION_SUCCESS]: success,
  [Types.DONATION_FAILURE]: failure,
  [Types.STORE_DONATION_RECORD]: storeDonationRecord,
})
