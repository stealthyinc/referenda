import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../redux/YourRedux'
// import Video from 'react-native-video';

// Styles
import styles from './styles/VideoScreenStyle'

class VideoScreen extends Component {
  render () {
    return null
    // return (
    //   <Video style={styles.backgroundVideo} source={require('../assets/inlineResponse.mp4')} />
    // )
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
