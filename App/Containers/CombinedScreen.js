import React, { Component } from 'react'
import { ScrollView, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import CameraScreen from './CameraScreen'
import CardsScreen from './CardsScreen'
import Ionicons from 'react-native-vector-icons/Ionicons'

// Styles
import styles from './Styles/CombinedScreenStyle'
const { userTypeInstance } = require('../Utils/UserType.js')

class CombinedScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    return (userTypeInstance.getUserType()) ? {
      title: 'Camera'.toUpperCase(),
      headerLeft: (
        <TouchableOpacity onPress={() => alert('More Info')} style={{marginLeft: 10}}>
          <Ionicons name='ios-information-circle-outline' size={30} color='gray' />
        </TouchableOpacity>
      )
    } : {
      title: 'Tokens'.toUpperCase(),
      headerLeft: (
        <TouchableOpacity onPress={() => alert('More Info')} style={{marginLeft: 10}}>
          <Ionicons name='ios-information-circle-outline' size={30} color='gray' />
        </TouchableOpacity>
      ),
      headerRight: (
        <TouchableOpacity onPress={() => alert('Add Tokens')} style={{marginRight: 10}}>
          <Ionicons name='logo-buffer' size={30} color='gray' />
        </TouchableOpacity>
      )
    }
  }
  render () {
    return (userTypeInstance.getUserType()) ? <CameraScreen /> : <CardsScreen />
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

export default connect(mapStateToProps, mapDispatchToProps)(CombinedScreen)
