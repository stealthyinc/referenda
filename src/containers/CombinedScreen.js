import React, { Component } from 'react'
import { Alert, Platform, View, ScrollView, Text, TouchableOpacity, Image, StyleSheet, Linking } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../redux/YourRedux'
import FeedScreen from '../containers/FeedScreen'
// import CampaignerScreen from '../Containers/CampaignerScreen'
import CampaignerMenuScreen from '../containers/CampaignerMenuScreen'
import Ionicons from 'react-native-vector-icons/Ionicons'
import DeviceInfo from 'react-native-device-info';
import Dialog from "react-native-dialog";

// Styles
// import styles from './styles/CombinedScreenStyle'
const { userTypeInstance } = require('../utils/UserType.js')
const { firebaseInstance } = (Platform.OS === 'web') ? null : require('../utils/firebaseWrapper.js')

const avatarArr = {
  0: require('../data/img/avatars/Image0.png'),
  1: require('../data/img/avatars/Image1.png'),
  2: require('../data/img/avatars/Image2.png'),
  3: require('../data/img/avatars/Image3.png'),
  4: require('../data/img/avatars/Image4.png'),
  5: require('../data/img/avatars/Image5.png'),
  6: require('../data/img/avatars/Image6.png'),
  7: require('../data/img/avatars/Image7.png'),
  8: require('../data/img/avatars/Image8.png'),
  9: require('../data/img/avatars/Image9.png'),
 10: require('../data/img/avatars/Image10.png'),
 11: require('../data/img/avatars/Image11.png'),
}

class CombinedScreen extends Component {
  static navigationOptions = {
    header: null
  }
  // static navigationOptions = ({ navigation }) => {
  //   const params = navigation.state.params || {}
  //   const randomAvatar = (!userTypeInstance.getUserType()) ? avatarArr[Math.floor(Math.random() * Math.floor(12))] : require('../data/img/avatars/agatha.png')
  //   return {
  //     header: null,
      // headerLeft: (
      //   <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{marginLeft: 10}}>
      //     <Image
      //       source={randomAvatar}
      //       style={{height: 30, width: 30, borderRadius: 15}}/>
      //   </TouchableOpacity>
      // ),
      // headerRight: (userTypeInstance.getUserType()) ? (
      //   <TouchableOpacity onPress={() => navigation.navigate('Create')} style={{marginRight: 10}}>
      //     <Ionicons name='ios-paper-plane' size={30} color='gray' />
      //   </TouchableOpacity>
      // ) : null,
      // headerTitle: 'Home'.toUpperCase(),
      // headerBackTitle: 'Back',
      // headerTintColor: 'black',
  //   }
  // }
  constructor() {
    super();
    this.state = {
      showBuildVersionModal: false
    }
  }
  async componentDidMount() {
    const currentBuildNumber = DeviceInfo.getBuildNumber()
    console.log("getBuildNumber", currentBuildNumber)
    const ref = firebaseInstance.getFirebaseRef('/global/version/mobile')
    try {
      await ref.once('value', snapshot => {
        console.log('snapshot', snapshot.val());
        if (snapshot.val() > currentBuildNumber) {
          console.log("Build Does Not Match")
          this.setState({
            showBuildVersionModal: true
          })
        }
      }, errorObject => {
        console.log("The read failed: " + errorObject.code);
      });
    } catch (err) {
      throw `Unable to build version.`
    }
  }
  render () {
    return (
      <View>
        {(userTypeInstance.getUserType()) ? <CampaignerMenuScreen navigation={this.props.navigation} /> : <FeedScreen navigation={this.props.navigation} />}
        <Dialog.Container visible={this.state.showBuildVersionModal}>
          <Dialog.Title>New App Version</Dialog.Title>
          <Dialog.Description>
            Please click upgrade to get the latest version of the app.
          </Dialog.Description>
          <Dialog.Button label="Upgrade" onPress={() => Linking.openURL('https://testflight.apple.com/join/a369f5iW')}/>
        </Dialog.Container>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: '#78CCC5',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '6%',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  summary: {
    color: '#FFFFFF',
    fontSize: 20,
    textAlign: 'left',
    width: '100%',
  },
  modalContent: {
    alignItems: 'flex-start',
    backgroundColor: 'white',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flex: 0,
    flexShrink: 1,
    justifyContent: 'flex-start',
  },
});

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CombinedScreen)
