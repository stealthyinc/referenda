import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import Video from 'react-native-video';

// Styles
import styles from './Styles/VideoScreenStyle'

class VideoScreen extends Component {
  render () {
    return (
      <Video style={styles.backgroundVideo} source={require('../Assets/inlineResponse.mp4')} />
    )
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

export default connect(mapStateToProps, mapDispatchToProps)(VideoScreen)
