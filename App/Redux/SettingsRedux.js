import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  settingsMenuToggle: [],
  settingsMenuUpdate: ['open'],
  storePhoneNumber: ['phoneNumber'],
  storeNameInfo: ['firstName', 'lastName', 'userName'],
  storeDob: ['dob'],
})

export const SettingsTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  open: false,
  phoneNumber: '',
  firstName: '',
  lastName: '',
  userName: '',
  dob: undefined,
})

/* ------------- Selectors ------------- */

export const SettingsSelectors = {
  getOpen: state => state.settings.open,
  getPhoneNumber: state => state.settings.phoneNumber,
  getFirstName: state => state.settings.firstName,
  getLastName: state => state.settings.lastName,
  getUserName: state => state.settings.userName,
  getDOB: state => state.settings.dob,
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

// set the user phone number
export const storePhoneNumber = (state, { phoneNumber }) =>
  state.merge({ phoneNumber })

// set the user name Information
export const storeNameInfo = (state, {firstName, lastName, userName}) =>
  state.merge({ firstName, lastName, userName })

// Set the user's date of birth
export const storeDob = (state, {dob}) => state.merge({ dob })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SETTINGS_MENU_TOGGLE]: settingsMenuToggle,
  [Types.SETTINGS_MENU_UPDATE]: settingsMenuUpdate,
  [Types.STORE_PHONE_NUMBER]: storePhoneNumber,
  [Types.STORE_NAME_INFO]: storeNameInfo,
  [Types.STORE_DOB]: storeDob,
})
