import React, { Component } from 'react'
import { ScrollView, Text, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux'
import CanvasActions, { CanvasSelectors } from '../Redux/CanvassingRedux'

import { ChoiceQuestion } from '../Utils/QuestionaireWidgets'

import { Metrics } from '../Themes/'
import { FontAwesome } from '../Assets/icons'
const C = require('../Utils/constants.js')
const UIF = require('../Utils/UIFactory.js')
const NUIF = require('../Utils/NavUIFactory.js')
const moment = require('moment');


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
    this.props.navigation.navigate('Constituent Questionaire')
  }

  render () {
    const uiElements = []

    const uiVoterElements = []
    let uiFoldingSection = undefined
    const rd = this.props.fetchReduxData
    if (rd &&
        rd.hasOwnProperty('CanvasConstituentSearchResults') &&
        rd.CanvasConstituentSearchResults.hasOwnProperty('selectedVoter')) {
      selectedVoter = rd.CanvasConstituentSearchResults.selectedVoter

      const voterAge = moment(selectedVoter.birthDate, "MM/DD/YYYY").fromNow(true /* no suffix */);
      Date.now() - new Date(selectedVoter.birthDate)
      uiVoterElements.push(UIF.getRow([
        UIF.getText('Age:', UIF.styles.descriptionText),
        UIF.getText(`${voterAge}`)
      ]))

      uiVoterElements.push(UIF.getRow([
        UIF.getText('Party Affiliation:', UIF.styles.descriptionText),
        UIF.getText(selectedVoter.politicalParty)
      ]))

      uiVoterElements.push(UIF.getRow([
        UIF.getText('Email:', UIF.styles.descriptionText),
        UIF.getTextInput('Email', undefined, ()=>{}, selectedVoter.email, {width:'auto', marginTop:0, marginBottom:0, textAlign:'right'})
      ]))

      uiVoterElements.push(UIF.getRow([
        UIF.getText('Phone:', UIF.styles.descriptionText),
        UIF.getTextInput('Phone', undefined, ()=>{}, selectedVoter.phoneNumber, {width:'auto', marginTop:0, marginBottom:0, textAlign:'right'})
      ]))

      uiVoterElements.push(UIF.getRow([
        UIF.getText('Voters in household:', UIF.styles.descriptionText),
        UIF.getRow([
          UIF.getButton(`${Math.floor(Math.random()*5)}`, FontAwesome.users, ()=>{}, 'black', false)
        ])
      ]))

      uiVoterElements.push(UIF.getRow([
        UIF.getText('Social Media:', UIF.styles.descriptionText),
        UIF.getRow([
          UIF.getButton(undefined, FontAwesome.twitter, ()=>{}, 'black', false),
          UIF.getButton(undefined, FontAwesome.facebook, ()=>{}, 'black', false),
        ])
      ]))


      uiFoldingSection = UIF.getFoldingSection(
        `${selectedVoter.firstName} ${selectedVoter.lastName}`,
        uiVoterElements )
    }

    uiElements.push(uiFoldingSection)

    uiElements.push(<ChoiceQuestion
                      key={UIF.getUniqueKey()}
                      questionData={this.contributionQuestion}
                      selectionHandlerFn={this.handleQuestionResponse} />)
    uiElements.push(UIF.getVerticalSpacer(Metrics.doubleBaseMargin))
    uiElements.push(UIF.getButton('Done', FontAwesome.chevronRight, this.handleDoneButtonPressed))

    return UIF.getScrollingContainer(uiElements, true /* no margin */)
  }
}

const mapStateToProps = (state) => {
  return {
    fetchReduxData: CanvasSelectors.fetchData(state),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    storeReduxData: (data) => dispatch(CanvasActions.storeData(data)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CanvasConstituentContribution)
