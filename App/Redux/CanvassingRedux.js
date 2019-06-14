import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  storeData: ['data'],
})

export const CanvasTypes = Types
export default Creators


/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: null,
})


/* ------------- Selectors ------------- */

export const CanvasSelectors = {
  fetchData: state => state.canvas.data
}


/* ------------- Reducers ------------- */

export const request = (state, { data }) => {
  let newState = {...state.data, ...data}
  return state.merge({data:newState})
}


/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(
  INITIAL_STATE,
  { [Types.STORE_DATA]: request }
)
