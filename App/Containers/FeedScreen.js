import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  WebView
} from 'react-native';
const NUIF = require('../Utils/NavUIFactory.js')

class FeedScreen extends Component {
  static propTypes = NUIF.requireNavBar
  static navigationOptions = NUIF.getNavOptions('Campaign News', false)
  render = () => (
    <WebView
      source={{uri: 'https://www.app.referenda.io/campacampa.id.blockstack/?wv=1'}}
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
