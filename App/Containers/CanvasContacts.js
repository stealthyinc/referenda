import React, { Component } from 'react'
import { ScrollView, Text, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/CanvasContactsStyle'
import NavigationType from '../Navigation/propTypes';
import CanvasActions, { CanvasSelectors } from '../Redux/CanvasRedux'

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

const { userTypeInstance } = require('../Utils/UserType.js')
const randomAvatar = (userTypeInstance.getUserType()) ? avatarArr[Math.floor(Math.random() * Math.floor(12))] : require('../Data/img/avatars/agatha.png')

class CanvasContacts extends Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    return {
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{marginLeft: 10}}>
          <Image
            source={randomAvatar}
            style={{height: 30, width: 30, borderRadius: 15}}/>
        </TouchableOpacity>
      ),
      headerTitle: 'Social Graph'.toUpperCase(),
      headerBackTitle: 'Back',
      headerTintColor: 'black',
      gesturesEnabled: false,
    }
  };
  // constructor (props) {
  //   super(props)
  //   this.state = {}
  // }

  render () {
    return (
      <ScrollView style={styles.container}>
        <Text>CanvasContacts Container</Text>
      </ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(CanvasContacts)
