import { Component } from 'react'
import { connect } from 'react-redux'
import CanvasActions, { CanvasSelectors } from '../Redux/CanvassingRedux'

import { Metrics } from '../Themes/'
const UIF = require('../Utils/UIFactory.js')
const C = require('../Utils/constants.js')
const NUIF = require('../Utils/NavUIFactory.js')

const Levenshtein = require('fast-levenshtein');

import { Voters } from '../Data/raw/sandiegovoters'

class CampaignChoiceScreen extends Component {
  static navigationOptions = NUIF.getNoHeaderNavOptions()

  constructor (props) {
    super(props)
  }

  render () {
    return (UIF.getContainer([UIF.getText('The Text')]))
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CampaignChoiceScreen)
