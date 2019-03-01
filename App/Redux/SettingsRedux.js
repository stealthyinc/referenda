import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  settingsMenuToggle: [],
  settingsMenuUpdate: ['open'],
})

export const SettingsTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  open: false
})

/* ------------- Selectors ------------- */

export const SettingsSelectors = {
  getOpen: state => state.open
}

/* ------------- Reducers ------------- */

// toggle settings menu 
export const settingsMenuToggle = (state) => {
  if (state.open)
    return state.merge({ open: false })
  else
    return state.merge({ open: true })
}

// set the settings drawer menu update
export const settingsMenuUpdate = (state, { open }) =>
  state.merge({ open })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SETTINGS_MENU_TOGGLE]: settingsMenuToggle,
  [Types.SETTINGS_MENU_UPDATE]: settingsMenuUpdate,
})