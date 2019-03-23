import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  init: ['userData'],
  engineCommandExec: ['aCommand'],
  engineRequest: ['data'],
  engineSuccess: ['payload'],
  engineFailure: null
})

export const EngineTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: null,
  fetching: null,
  payload: null,
  error: null
})

/* ------------- Selectors ------------- */

export const EngineSelectors = {
  getData: state => state.data,
  getPayload: state => state.payload
}

/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state, { data }) =>
  state.merge({ fetching: true, data, payload: null })

// successful api lookup
export const success = (state, action) => {
  const { payload } = action
  console.info('--------------------------------------------------------------')
  console.info(`${success.name}: received payload from action:`)
  console.dir(payload)
  console.info('--------------------------------------------------------------')
  return state.merge({ fetching: false, error: null, payload })
}

// Something went wrong somewhere.
export const failure = state =>
  state.merge({ fetching: false, error: true, payload: null })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.ENGINE_REQUEST]: request,
  [Types.ENGINE_SUCCESS]: success,
  [Types.ENGINE_FAILURE]: failure
})
