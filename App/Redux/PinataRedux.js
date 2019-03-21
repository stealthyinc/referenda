import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  pinataAddJson: ['json'],
  pinataAddFile: ['file'],
  pinataRemovePin: ['pin'],
  pinataSuccess: ['payload'],
  pinataFailure: null
})

export const PinataTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: null,
  fetching: null,
  payload: null,
  error: null,
  json: null,
  file: null,
  pin: null
})

/* ------------- Selectors ------------- */

export const PinataSelectors = {
  getData: state => state.data
}

/* ------------- Reducers ------------- */

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
  [Types.PINATA_SUCCESS]: success,
  [Types.PINATA_FAILURE]: failure
})
