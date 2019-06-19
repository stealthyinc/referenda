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

    this.contributionQuestion = C.contributionQuestion
    this.householdVoters = Math.floor(Math.random()*5)
    this.state = {
      showTwitter: false,
      showFacebook: false
    }
  }

  handleQuestionResponse = (aQuestionId, aValue) => {
  }

  handleBackButtonPressed = () => {
    // TODO: push our data up to firebase for:
    //        - the Questionaire
    //        - the volunteer score
    this.props.navigation.navigate('Constituent Contribution')
  }

  handleFacebookToggle = () => {
    this.setState({showFacebook: !this.state.showFacebook})
  }

  handleTwitterToggle = () => {
    this.setState({showTwitter: !this.state.showTwitter})
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
      const voterName = `${selectedVoter.firstName} ${selectedVoter.lastName}`

      // Modal Action Hero:
      if (this.state.showFacebook || this.state.showTwitter) {
        const toggleFn = (this.state.showFacebook) ?
          this.handleFacebookToggle : this.handleTwitterToggle

        const socMed = (this.state.showFacebook) ? 'Facebook' : 'Twitter'

        const modalElements = []
        modalElements.push(UIF.getHeading(`${voterName} is on ${socMed}`, 'h4'))
        modalElements.push(UIF.getVerticalSpacer())
        modalElements.push(UIF.getText(`Recent Posts:`))
        for (const someText of [
          'June 9: It\'s time for great things to happen in US politics...',
          'May 28: How to get involved with your representative to drive change ...',
          'April 17: It\'s not enough to stand idly by...',
          'January 5: Goodbye Duncan Hunter...' ]) {

          modalElements.push(
            UIF.getText(
              someText,
              {...UIF.styles.descriptionText, width:'100%', paddingHorizontal:10, alignText:'left'}
            )
          )
          modalElements.push(UIF.getVerticalSpacer())
        }


        modalElements.push(UIF.getVerticalSpacer())
        modalElements.push(UIF.getButton('Back', undefined, toggleFn))
        uiElements.push(UIF.getOptionsModal(modalElements))
      }
      // End Modal Action Hero

      const voterAge = moment(selectedVoter.birthDate, "MM/DD/YYYY").fromNow(true /* no suffix */);
      uiVoterElements.push(UIF.getKeyValueTextRow('Age', `${voterAge}`))
      uiVoterElements.push(UIF.getKeyValueTextRow('Party Affiliation:', selectedVoter.politicalParty))

      uiVoterElements.push(UIF.getKeyValueTextInputRow('Email', selectedVoter.email))
      uiVoterElements.push(UIF.getKeyValueTextInputRow('Phone', selectedVoter.phoneNumber))

      const householdVotersButton = UIF.getButton(`${this.householdVoters}`, FontAwesome.users, ()=>{}, 'black', false)
      uiVoterElements.push(UIF.getKeyButtonsRow('Voters in household:', [householdVotersButton]))

      const socialMediaButtons = [
        UIF.getButton(undefined, FontAwesome.twitter, this.handleTwitterToggle, 'black', false, false),
        UIF.getButton(undefined, FontAwesome.facebook, this.handleFacebookToggle, 'black', false, false),
      ]
      uiVoterElements.push(UIF.getKeyButtonsRow('Social Media:', socialMediaButtons))


      uiFoldingSection = UIF.getFoldingSection(voterName, uiVoterElements)
    }

    uiElements.push(uiFoldingSection)

    uiElements.push(<ChoiceQuestion
                      key={UIF.getUniqueKey()}
                      questionData={this.contributionQuestion}
                      selectionHandlerFn={this.handleQuestionResponse} />)
    uiElements.push(UIF.getVerticalSpacer(Metrics.doubleBaseMargin))
    uiElements.push(UIF.getButton('Back', FontAwesome.chevronRight, this.handleBackButtonPressed))

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
