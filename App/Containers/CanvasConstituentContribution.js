import React, { Component } from 'react'
import { ScrollView, Text, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux'

import { ChoiceQuestion } from '../Utils/QuestionaireWidgets'

import { Metrics } from '../Themes/'
import { FontAwesome } from '../Assets/icons'
const C = require('../Utils/constants.js')
const UIF = require('../Utils/UIFactory.js')
const NUIF = require('../Utils/NavUIFactory.js')

import CanvasActions, { CanvasSelectors } from '../Redux/CanvassingRedux'


class CanvasConstituentContribution extends Component {
  static propTypes = NUIF.requireNavBar
  static navigationOptions = NUIF.getNavOptions(
    'Contribution',  false /* omit left header avatar */ )

  constructor (props) {
    super(props)
    this.state = {}
    this.contributionQuestion = C.contributionQuestion
  }

  handleQuestionResponse = (aQuestionId, aValue) => {

  }

  handleDoneButtonPressed = () => {
    // TODO: push our data up to firebase for:
    //        - the Questionaire
    //        - the volunteer score
    this.props.navigation.navigate('Contact Search')
  }

  render () {
    const uiElements = []
    uiElements.push(<ChoiceQuestion
                      key={UIF.getUniqueKey()}
                      questionData={this.contributionQuestion}
                      selectionHandlerFn={this.handleQuestionResponse} />)
    uiElements.push(UIF.getVerticalSpacer(Metrics.doubleBaseMargin))
    uiElements.push(UIF.getButton('Done', FontAwesome.chevronRight, this.handleDoneButtonPressed))

    return UIF.getScrollingContainer(uiElements)
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

export default connect(mapStateToProps, mapDispatchToProps)(CanvasConstituentContribution)
