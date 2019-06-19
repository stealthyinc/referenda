import React, { Component } from 'react'
import { Alert, View, ScrollView, Text, TouchableOpacity, Image, StyleSheet, Linking } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
// import FeedScreen from '../Containers/FeedScreen'
// import CampaignerScreen from '../Containers/CampaignerScreen'
// import CampaignerMenuScreen from '../Containers/CampaignerMenuScreen'
import Grid from '../Containers/Grid'
import Ionicons from 'react-native-vector-icons/Ionicons'
import DeviceInfo from 'react-native-device-info';
import Dialog from "react-native-dialog";
import NavigationType from '../Navigation/propTypes';
const NUIF = require('../Utils/NavUIFactory.js')

const { firebaseInstance } = require('../Utils/firebaseWrapper.js')

class CombinedScreen extends Component {
  static propTypes = NUIF.requireNavBar
  static navigationOptions = NUIF.getNavOptions('Main Menu')

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
        <Grid navigation={this.props.navigation}/>
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
