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
import Modal from 'react-native-modal';
import { Button, Icon } from 'native-base'
const { firebaseInstance } = require('../Utils/firebaseWrapper.js')

export const avatarArr = {
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
const randomAvatar = avatarArr[Math.floor(Math.random() * Math.floor(12))]

class CombinedScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    return {
      headerLeft: (
        <TouchableOpacity onPress={() => params.navigation.toggleDrawer()} style={{marginLeft: 10}}>
          <Image
            source={randomAvatar}
            style={{height: 30, width: 30, borderRadius: 15}}/>
        </TouchableOpacity>
      ),
      headerTitle: 'Main Menu',
      headerRight: (
        // <TouchableOpacity onPress={() => console.log('cool')} style={{marginRight: 10}}>
        <TouchableOpacity onPress={() => params.toggleModal()} style={{marginRight: 10}}>
          <Icon name='ribbon' />
        </TouchableOpacity>
      ),
    }
  };
  constructor() {
    super();
    this.state = {
      showBuildVersionModal: false,
      visibleModal: false,
      level: 0
    }
  }
  toggleModal = () => {
    this.setState({visibleModal: !this.state.visibleModal})
  }
  async componentDidMount() {
    this.props.navigation.setParams({ navigation: this.props.navigation, toggleModal: this.toggleModal })
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
  renderModalContent = () => (
    <View style={{
      backgroundColor: 'white',
      padding: 22,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 4,
      borderColor: 'rgba(0, 0, 0, 0.1)',
    }}>
      <Text style={{
        fontSize: 20,
        marginBottom: 12,
      }}>Change Levels 🏅</Text>
      <View style={{width: '100%', flexDirection: 'row', justifyContent: 'center'}}>
        <Button
          block
          light
          style={{padding:5}}
          onPress={() => this.setState({ visibleModal: false, level: 0 })}
        >
          <Text>Level 0</Text>
        </Button>
        <Button
          block
          success
          style={{padding:5}}
          onPress={() => this.setState({ visibleModal: false, level: 1 })}
        >
          <Text color='white'>Level 1</Text>
        </Button>
        <Button
          block
          danger
          style={{padding:5}}
          onPress={() => this.setState({ visibleModal: false, level: 2 })}
        >
          <Text color='white'>Level 2</Text>
        </Button>
      </View>
    </View>
  );
  render () {
    return (
      <View style={{flex: 1}}>
        <Modal
          isVisible={this.state.visibleModal === true}
          onBackdropPress={() => this.setState({ visibleModal: false })}
        >
          {this.renderModalContent()}
        </Modal>
        <Grid level={this.state.level} navigation={this.props.navigation}/>
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
    justifyContent: 'flex-start',
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
  content: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
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
