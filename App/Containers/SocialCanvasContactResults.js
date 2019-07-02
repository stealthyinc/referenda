import React, { Component } from 'react'
import { View, Linking } from 'react-native'
import { connect } from 'react-redux'
import CanvasActions, { CanvasSelectors } from '../Redux/CanvassingRedux'

import { Metrics } from '../Themes/'
import { FontAwesome } from '../Assets/icons'
const UIF = require('../Utils/UIFactory.js')
const C = require('../Utils/constants.js')
const NUIF = require('../Utils/NavUIFactory.js')

import Communications from 'react-native-communications'
const { candidateData } = require('../Data/CandidateData.js')

import { Voters } from '../Data/raw/sandiegovoters'

class SocialCanvasContactResults extends Component {
  static propTypes = NUIF.requireNavBar
  static navigationOptions = NUIF.getNavOptions('Canvas Contacts', false)

  constructor (props) {
    super(props)

    const numVoters = Math.ceil(Math.random() * 65) + 10
    const step = Math.floor(Voters.length / numVoters)

    this.voterStatus = {}
    this.voterList = []
    if (step > 0) {
      let index = 0
      while (index < Voters.length) {
        this.voterList.push(Voters[index])
        index += step
      }
    }

    this.state={
      lastRender: Date.now()
    }
  }

  handleEmailRequest(anIndex, anEmail, aMessage) {
    this.voterStatus[anIndex] = true
    Linking.openURL(`mailto:${anEmail}?subject=${candidateData.getName()}'s Campaign&body=${aMessage}'`)
    this.setState({lastRender: Date.now()})
  }

  handleTextRequest(anIndex, aPhoneNumber, aMessage) {
    this.voterStatus[anIndex] = true
    Communications.textWithoutEncoding(aPhoneNumber, aMessage)
    this.setState({lastRender: Date.now()})
  }

  handlePhoneRequest(anIndex, aPhoneNumber, aName) {
    this.voterStatus[anIndex] = true

    // From: https://github.com/anarchicknight/react-native-communications
    //
    //   phonecall(phoneNumber, prompt):
    //
    //   If prompt is true it uses the undocumented telprompt: url scheme. This
    //   triggers an alert asking user to confirm if they want to dial the
    //   number. There are conflicting reports around the internet about whether
    //   Apple will allow apps using this scheme to be submitted to the App
    //   store (some have had success and others have had rejections).
    //   ... (more on site)
    //
    try {
      Communications.phonecall(aPhoneNumber, true)
    } catch (suppressedError) {
      console.log(`Suppressed Error(handlePhoneRequest): ${suppressedError}`)
    }

    this.setState({lastRender: Date.now()})
  }

  render () {
    const uiElements = []

    uiElements.push(UIF.getText(`Found ${this.voterList.length} out of 75 contacts in district ${candidateData.getDistrict()}:`))
    uiElements.push(UIF.getVerticalSpacer())

    for (const voterIndex in this.voterList) {
      const voter = this.voterList[voterIndex]

      const message = `Hi ${voter.firstName}, I wanted to tell you about ${candidateData.getName()}'s campaign for ${candidateData.getDistrict()}.\n\n Find out more here: ${candidateData.getCampaignLink()}`
      const voterName = (this.voterStatus.hasOwnProperty(voterIndex)) ?
        `✅ ${voter.firstName} ${voter.lastName}` :
        `${voter.firstName} ${voter.lastName}`


      const voterPhoneButton = (voter.phoneNumber) ?
        UIF.getButton('', FontAwesome.phone, () => this.handlePhoneRequest(voterIndex, voter.phoneNumber, candidateData.getName()), 'black', false) :
        UIF.getButton('', FontAwesome.phone, undefined, 'white', false)
      // const voterPhoneButton = undefined

      const voterTextButton = (voter.phoneNumber) ?
        UIF.getButton('', FontAwesome.comments, () => this.handleTextRequest(voterIndex, voter.phoneNumber, message), 'black', false) :
        UIF.getButton('', FontAwesome.comments, undefined, 'white', false)

      const voterEmailButton = (voter.email) ?
        UIF.getButton('', FontAwesome.envelope,  () => this.handleEmailRequest(voterIndex, voter.email, message), 'black', false) :
        UIF.getButton('', FontAwesome.envelope, undefined, 'white', false)

      uiElements.push(
        <View key={UIF.getUniqueKey()}
              style={{
                flexDirection:'row',
                justifyContent:'space-between',
                marginTop: 5,
                borderStyle:'solid',
                borderBottomWidth:1,
                paddingVertical:5}}>
          {UIF.getText(voterName)}
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            {voterPhoneButton}
            {voterTextButton}
            {voterEmailButton}
          </View>
        </View>
      )
    }


    uiElements.push(UIF.getVerticalSpacer(Metrics.screenHeight/3))

    return (UIF.getScrollingContainer(uiElements))
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(SocialCanvasContactResults)
