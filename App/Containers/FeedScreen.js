import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  WebView
} from 'react-native-webview';
import {
  ActivityIndicator,
} from 'react-native'
const NUIF = require('../Utils/NavUIFactory.js')

const { candidateData } = require('../Data/CandidateData.js')

class FeedScreen extends Component {
  static propTypes = NUIF.requireNavBar
  static navigationOptions = NUIF.getNavOptions('Campaign News', false)
  render = () => (
    <WebView
      source={{uri: candidateData.getCampaignLink()}}
      cacheEnabled={true}
      startInLoadingState={true}
    />
  )
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedScreen)
