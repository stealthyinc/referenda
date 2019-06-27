import React, { Component } from 'react'
import { ScrollView, Text, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux'
import DonationActions from '../Redux/DonationRedux'
import CanvasActions, { CanvasSelectors } from '../Redux/CanvassingRedux'

import { ChoiceQuestion } from '../Utils/QuestionaireWidgets'

import { Colors, Fonts, Metrics } from '../Themes/'
import { FontAwesome } from '../Assets/icons'

import qrCode from '../Assets/images/campa-qr-code.png'
import Config from 'react-native-config'

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

    this.selectedVoter = this.getSelectedVoter()

    this.contributionQuestion = C.contributionQuestion
    this.householdVoters = Math.floor(Math.random()*5)
    this.modalTitle = ''
    this.state = {
      showTwitter: false,
      showFacebook: false,
      showQR: false,
      showOther: false,
    }
  }

  getSelectedVoter = () => {
    selectedVoter = {}
    try {
      const rd = this.props.fetchReduxData
      selectedVoter = rd.CanvasConstituentSearchResults.selectedVoter
    } catch (suppressedError) {}

    return selectedVoter
  }

  handleQuestionResponse = (aQuestionId, aValue) => {
    // Hard coded for demo:
    switch (aValue) {
      case 1:   // Follow the Campaign
        this.setState({showQR: !this.state.showQR})
        break;
      case 2:   // Answer a Questionaire
        // TODO: some selection-y stuff
        this.props.navigation.navigate('Constituent Questionaire')
        break;
      case 3:   // Make a Donation
        // TODO: some selection-y stuff
        this.props.navigation.navigate('CampaignerMenu')
        break;
      default:
        // TODO: pop a modal with a title and 'future home of ...'
        let index = 0
        for (const choice of this.contributionQuestion.choices) {
          index++
          if (index === aValue) {
            this.modalTitle = choice.value
            break;
          }
        }
        this.setState({showOther: !this.state.showOther})
    }
  }

  handleDoneButtonPressed = () => {  // TODO: pushuser_check to firebase for:
    //        - the Questionaire
    //        - the volunteer score
    this.props.navigation.navigate('CanvasMenu')
  }

  handleFacebookToggle = () => {
    this.setState({showFacebook: !this.state.showFacebook})
  }

  handleTwitterToggle = () => {
    this.setState({showTwitter: !this.state.showTwitter})
  }

  handleQRText = () => {
    // TODO: Launch a text message Saga ...
    // If possible show an AI and when done make the modal disappear...
    debugger
    const message = `Hi Alex, Prabhaav has invited you to learn more about Ammar's campaign.\
    You can interact, donate, and even chat with the campaign here: https://www.app.referenda.io/campacampa.id.blockstack`
    fetch(Config.TWILIO_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: '5044606946',
        message
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log("TWILIO GOOD", responseJson)
    })
    .catch((error) =>{
      console.error(error);
    });
    this.setState({showQR: !this.state.showQR})
  }

  handleQRToggle = () => {
    this.setState({showQR: !this.state.showQR})
  }

  handleOtherToggle = () => {
    this.modalTitle = ''
    this.setState({showOther: !this.state.showOther})
  }

  render () {
    const uiElements = []

    const uiPersonalDataEle = []
    const uiSocialDataEle = []

    // if (!this.selectedVoter) {
    //   this.selectedVoter = this.getSelectedVoter()
    // }

    if (this.selectedVoter) {
      const voterName = `${this.selectedVoter.firstName} ${this.selectedVoter.lastName}`

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
              {...UIF.styles.descriptionText, width:'100%', paddingHorizontal:10}
            )
          )
          modalElements.push(UIF.getVerticalSpacer())
        }


        modalElements.push(UIF.getVerticalSpacer())
        modalElements.push(UIF.getButton('Back', FontAwesome.chevronLeft, toggleFn))
        uiElements.push(UIF.getOptionsModal(modalElements))
      }

      if (this.state.showQR) {
        const modalElements = []
        modalElements.push(UIF.getHeading(`Follow the Campaign`, 'h4'))
        modalElements.push(UIF.getHeading('Scan this QR Code:', 'h5'))
        const imageDim = Math.ceil(Metrics.screenWidth * 0.85)
        modalElements.push(<Image source={qrCode} style={{width:imageDim, height:imageDim}}/> )
        modalElements.push(UIF.getHeading(`Or Text ${voterName}:`, 'h5'))
        modalElements.push(UIF.getButton(`Text a link to ${this.selectedVoter.phoneNumber}`, undefined, this.handleQRText))
        modalElements.push(UIF.getVerticalSpacer(Metrics.screenHeight/20))
        modalElements.push(UIF.getButton('Back', FontAwesome.chevronLeft, this.handleQRToggle))

        uiElements.push(UIF.getOptionsModal(modalElements))
      }

      if (this.state.showOther) {
        const modalElements = []
        modalElements.push(UIF.getHeading(this.modalTitle, 'h4'))
        modalElements.push(UIF.getVerticalSpacer(Metrics.screenHeight/2))
        modalElements.push(UIF.getButton('Back', FontAwesome.chevronLeft, this.handleOtherToggle))

        uiElements.push(UIF.getOptionsModal(modalElements))
      }
      // End Modal Action Hero

      const voterAge = moment(this.selectedVoter.birthDate, "MM/DD/YYYY").fromNow(true /* no suffix */);
      uiPersonalDataEle.push(UIF.getKeyValueTextRow('Age', `${voterAge}`))

      uiPersonalDataEle.push(UIF.getKeyValueTextInputRow('Email', this.selectedVoter.email))
      uiPersonalDataEle.push(UIF.getKeyValueTextInputRow('Phone', this.selectedVoter.phoneNumber))

      uiSocialDataEle.push(UIF.getKeyValueTextRow('Party Affiliation:', this.selectedVoter.politicalParty))
      const householdVotersButton = UIF.getButton(`${this.householdVoters}`, FontAwesome.users, ()=>{}, 'green', false, true, Fonts.size.h4)
      uiSocialDataEle.push(UIF.getKeyButtonsRow('Voters in household:', [householdVotersButton]))

      const socialMediaButtons = [
        UIF.getButton(undefined, FontAwesome.twitter, this.handleTwitterToggle, Colors.twitterLogoBlue, false, false, Fonts.size.h4),
        UIF.getButton(undefined, FontAwesome.facebook, this.handleFacebookToggle, Colors.facebook, false, false, Fonts.size.h4),
      ]
      uiSocialDataEle.push(UIF.getKeyButtonsRow('Social Media:', socialMediaButtons))
    }

    uiElements.push(UIF.getFoldingSection('Personal Data', uiPersonalDataEle))
    uiElements.push(UIF.getFoldingSection('Social Data', uiSocialDataEle))

    uiElements.push(<ChoiceQuestion
                      key={UIF.getUniqueKey()}
                      questionData={this.contributionQuestion}
                      selectionHandlerFn={this.handleQuestionResponse} />)
    uiElements.push(UIF.getVerticalSpacer(Metrics.doubleBaseMargin))
    uiElements.push(UIF.getButton('Done', FontAwesome.check_square, this.handleDoneButtonPressed))

    uiElements.push(UIF.getVerticalSpacer(Metrics.screenHeight/3))

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
    sendPlatformText: (data) => dispatch(DonationActions.twilioRequest(data)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CanvasConstituentContribution)
