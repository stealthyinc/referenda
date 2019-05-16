import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  guiSetPhoto: ['photo'],
  guiSetTitle: ['title'],
  guiSetDescr: ['descr'],
})

export const GuiTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  photo: null,
  title: null,
  descr: null,
})

/* ------------- Selectors ------------- */

export const GuiSelectors = {
  guiGetPhoto: state => state.gui.photo,
  guiGetTitle: state => state.gui.title,
  guiGetDescr: state => state.gui.descr,
}

/* ------------- Reducers ------------- */

export const guiSetPhoto = (state, action) => {
  const { photo } = action
  return state.merge({ photo })
}

export const guiSetTitle = (state, action) => {
  const { title } = action
  return state.merge({ title })
}

export const guiSetDescr = (state, action) => {
  const { descr } = action
  return state.merge({ descr })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GUI_SET_PHOTO]: guiSetPhoto,
  [Types.GUI_SET_TITLE]: guiSetTitle,
  [Types.GUI_SET_DESCR]: guiSetDescr,
})
