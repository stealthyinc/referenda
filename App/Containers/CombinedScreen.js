import React, { Component } from 'react'
import { ScrollView, Text, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import FeedScreen from '../Containers/FeedScreen'
import CampaignerScreen from '../Containers/CampaignerScreen'
import Ionicons from 'react-native-vector-icons/Ionicons'

// Styles
import styles from './Styles/CombinedScreenStyle'
const { userTypeInstance } = require('../Utils/UserType.js')

const avatarArr = {
  0: require('../Data/img/avatars/Image0.png'),
  1: require('../Data/img/avatars/Image1.png'),
  2: require('../Data/img/avatars/Image2.png'),
  3: require('../Data/img/avatars/Image3.png'),
  4: require('../Data/img/avatars/Image4.png'),
  5: require('../Data/img/avatars/Image5.png'),
  6: require('../Data/img/avatars/Image6.png'),
  7: require('../Data/img/avatars/Image7.png'),
  8: require('../Data/img/avatars/Image8.png'),
  9: require('../Data/img/avatars/Image9.png'),
 10: require('../Data/img/avatars/Image10.png'),
 11: require('../Data/img/avatars/Image11.png'),
}

class CombinedScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    // Make the header go away for now.
    return {
      header: null
    }
    
    const params = navigation.state.params || {}
    const randomAvatar = (!userTypeInstance.getUserType()) ? avatarArr[Math.floor(Math.random() * Math.floor(12))] : require('../Data/img/avatars/agatha.png')
    return {
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{marginLeft: 10}}>
          <Image
            source={randomAvatar}
            style={{height: 30, width: 30, borderRadius: 15}}/>
        </TouchableOpacity>
      ),
      headerRight: (userTypeInstance.getUserType()) ? (
        <TouchableOpacity onPress={() => navigation.navigate('Create')} style={{marginRight: 10}}>
          <Ionicons name='ios-paper-plane' size={30} color='gray' />
        </TouchableOpacity>
      ) : null,
      headerTitle: 'Home'.toUpperCase(),
      headerBackTitle: 'Back',
      headerTintColor: 'black',
    }
  }
  render () {
    return (userTypeInstance.getUserType()) ? <CampaignerScreen /> : <FeedScreen navigation={this.props.navigation} />
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
