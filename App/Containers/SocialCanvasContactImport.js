import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import CanvasActions, { CanvasSelectors } from '../Redux/CanvassingRedux'

import { Metrics } from '../Themes/'
import { FontAwesome } from '../Assets/icons'
const UIF = require('../Utils/UIFactory.js')
const C = require('../Utils/constants.js')
const NUIF = require('../Utils/NavUIFactory.js')

const { candidateData } = require('../Data/CandidateData.js')

class SocialCanvasContactImport extends Component {
  static propTypes = NUIF.requireNavBar
  static navigationOptions = NUIF.getNavOptions('Social Canvassing', false)

  constructor (props) {
    super(props)

    this.state = {
      aiShowMessage: ''
    }
  }

  timeout = (ms) => {
    return new Promise(
      (resolve, reject) => {
        setTimeout(resolve, ms)
      })
  }

  handleSearchPressed = async () => {
    this.setState({aiShowMessage: `Building list of contacts in district ${candidateData.getDistrict()} ...`})
    const firstDelaySeconds = 0.75 * 1000
    await this.timeout(firstDelaySeconds)

    this.setState({aiShowMessage: ''})
    this.props.navigation.navigate('SocialCanvasResults')
  }

  render () {
    const uiElements = []
    if (this.state.aiShowMessage) {
      uiElements.push(UIF.getActivityIndicator(this.state.aiShowMessage))
    }

    const headingSize = 'h5'
    uiElements.push(UIF.getHeading(`Grow ${candidateData.getName()}'s campaign quickly by messaging some of your contacts?`, headingSize))

    const uiBottomColElements = []
    uiBottomColElements.push(UIF.getButton('Access Contacts*', FontAwesome.addressBook, this.handleSearchPressed))
    uiBottomColElements.push(UIF.getVerticalSpacer(Metrics.doubleBaseMargin))
    uiBottomColElements.push(UIF.getText('* Contacts are not stored by Referenda. They are searched to find those in the campaign district for you to message.', UIF.styles.descriptionText))
    uiElements.push(UIF.getColumn(uiBottomColElements))

    return (UIF.getContainer(
      <View style={{flex:1, flexDirection:'column', justifyContent:'space-between', alignItems:'center', paddingVertical:5}}>{uiElements}</View>))
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(SocialCanvasContactImport)
