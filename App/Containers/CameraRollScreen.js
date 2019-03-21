import React, { Component } from 'react'
import { CameraRoll, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Text } from 'react-native-elements'

import PhotoBrowser from 'react-native-photo-browser'
import GuiActions from '../Redux/GuiRedux'

class CameraRollScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    return {
      headerTitle: 'Camera Roll'.toUpperCase(),
      headerBackTitle: 'Back',
      headerTintColor: 'black',
    }
  };
  constructor (props) {
    super(props)
    this.state = {
      media: []
    }
  }
  async componentWillMount () {
    this.props.navigation.setParams({ navigation: this.props.navigation })
    CameraRoll.getPhotos({
      first: 30,
      assetType: 'Photos'
    })
    .then(data => {
      const media = []
      data.edges.forEach(d =>
        media.push({
          photo: d.node.image.uri
        })
      )
      this.setState({media})
    })
    .catch(error => alert(error))
  }
  onSelectionChanged = (media, index, selected) => {
    const { photo } = media
    if (photo) {
      this.props.guiSetPhoto(photo)
      this.props.navigation.goBack()
    }
  }
  render () {
    return (
      <PhotoBrowser
        startOnGrid
        alwaysShowControls
        displayNavArrows
        enableGrid
        alwaysDisplayStatusBar
        displaySelectionButtons
        onSelectionChanged={this.onSelectionChanged}
        mediaList={this.state.media}
      />
    )
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    guiSetPhoto: (photo) => dispatch(GuiActions.guiSetPhoto(photo))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CameraRollScreen)