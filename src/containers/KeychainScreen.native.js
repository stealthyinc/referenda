import React, { Component } from 'react';
import { connect } from 'react-redux'
import {
  View,
  Image,
  Keyboard,
  SegmentedControlIOS,
  ActivityIndicator,
} from 'react-native';
import {
  RkButton,
  RkText,
  RkTextInput,
  RkStyleSheet,
  RkTheme,
  RkAvoidKeyboard,
} from 'react-native-ui-kitten';
import { GradientButton } from '../components/';
import { scaleVertical } from '../utils/scale';
import NavigationType from '../navigation/propTypes';
import * as Keychain from 'react-native-keychain';
// const { RefCrypto } = require('../utils/RefCrypto')

import {Profile} from '../engine/data/profile'
import EngineActions, { EngineSelectors } from '../redux/EngineRedux'
import SettingsActions, { SettingsSelectors } from '../redux/SettingsRedux'
import {EngineCommand} from '../engine/commands/engineCommand'

const ACCESS_CONTROL_OPTIONS = ['Passcode'];
const ACCESS_CONTROL_MAP = [Keychain.ACCESS_CONTROL.DEVICE_PASSCODE, Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET]
const { userTypeInstance } = require('../utils/UserType.js')
const { Analytics } = require('../utils/Analytics.js')

class KeychainScreen extends Component {
  constructor() {
    super()
    this.userName = ''
    this.password = ''
  }
  static navigationOptions = {
    header: null,
  }

  static propTypes = {
    navigation: NavigationType.isRequired,
  };

  state = {
    status: '',
    biometryType: null,
    accessControl: null,
    waitingOnCommand: undefined
  };

  getThemeImageSource = (theme) => (
    theme.name === 'light' ?
      require('../assets/images/verified.png') : require('../assets/images/logoDark.png')
  );

  renderImage = () => (
    <Image style={styles.image} source={this.getThemeImageSource(RkTheme.current)} />
  );

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps:')
    // TODo: rip this out
    // console.dir(nextProps)

    if (this.state.waitingOnCommand &&
        nextProps.hasOwnProperty('payLoad') &&
        nextProps.payLoad.hasOwnProperty('commandType')) {
      if (this.state.waitingOnCommand === nextProps.payLoad.commandType) {
        console.log(`${this.state.waitingOnCommand} finished executing. Advancing navigation...`)

        if (userTypeInstance.getUserType())
          this.props.navigation.navigate('CampaignerMenu');
        else
          this.props.navigation.navigate('SocialMenu');
      }
    }
  }

  componentDidMount() {
    Keychain.getSupportedBiometryType().then(biometryType => {
      this.setState({ biometryType, accessControl: biometryType });
    });
  }

  async save() {
    try {
      // this.username = RefCrypto.getPublicKey()
      // this.password = RefCrypto.getPrivateKey()
      this.username = Date.now()
      this.password = Date.now()
      Analytics.setCredentials(this.username)
      await Keychain.setGenericPassword(
        this.username,
        this.password,
        {
          accessControl: this.state.accessControl,
          service: 'vote.referenda'
        }
      );
      // this.setState({ username: '', password: '', status: 'Credentials saved!' });
    } catch (err) {
      console.error(`${this.save.name}: Could not save credentials. ${err}`)
      // this.setState({ status: 'Could not save credentials, ' + err });
    }
  }

  onSignUpButtonPressed = async () => {
    try {
      await this.save()

      const profile = new Profile()
      profile.setIdentityKeyPair(this.username, this.password)
      profile.setPhoneNumber(this.props.phoneNumber)
      profile.setAlias(this.props.userName)
      profile.setFirstName(this.props.firstName)
      profile.setLastName(this.props.lastName)
      profile.setBirthDate(this.props.dob)

      const engCmd = EngineCommand.signUpCommand(profile)

      // Tell render to fire up spinner and wait on result before advancing navigation
      this.setState({ waitingOnCommand: engCmd.getCommandType() })
      this.props.engineCommandExec(engCmd)
    } catch (error) {

    }

    // if (userTypeInstance.getUserType())
    //   this.props.navigation.navigate('CampaignerMenu');
    // else
    //   this.props.navigation.navigate('SocialMenu');
  };

  onSignInButtonPressed = () => {
    this.props.navigation.navigate('Login');
  };

  render = () => {
    const ai = (this.state.waitingOnCommand) ?
      (<ActivityIndicator size='large' color='#FFFFFF'/>) : undefined

    // tintColor below throws an error saying it's an invalid property, however
    // oddly the component renders with the correct coloring and the property is
    // documented:
    // - https://facebook.github.io/react-native/docs/segmentedcontrolios#tintcolor
    // the issue might be related to this:
    // - https://github.com/ptomasroos/react-native-tab-navigator/issues/68
    //
    return (
      <RkAvoidKeyboard
        style={styles.screen}
        onStartShouldSetResponder={() => true}
        onResponderRelease={() => Keyboard.dismiss()}>

        <View id="width-limiter" style={{flexDirection: 'column', flex: 1, width: '95%'}}>

          <View id="top-spacer" style={{height: '10%'}}/>

          <View style={{ alignItems: 'center', height: '20%' }}>
            {this.renderImage()}
            <RkText rkType='h1' style={{color: 'white'}}>Security</RkText>
          </View>

          <View id="top-content-spacer" style={{height: '5%'}}/>

          <View style={{alignItems: 'center', flex: 1}}>
            <View style={{alignItems: 'flex-start', flex: 1}}>
              <View class='text-spacer' style={{height: 10}} />
              <RkText rkType='h6' style={{color: 'white'}}>Your data is owned by you, encrypted with your encryption keys and then stored on cloud storage. You own the encryption keys--that means nobody, not even us at referenda can access your data.</RkText>
              <View class='text-spacer' style={{height: 10}} />
              <RkText rkType='h6' style={{color: 'white'}}>Secure your encryption keys on this device by using a passcode or Face ID.</RkText>
            </View>

            <View style={{flex: 1}} />
            {ai}
          </View>

          <View style={{height: '25%'}}>
            <View style={{flex: 1}} />

            <SegmentedControlIOS
              selectedIndex={0}
              style={{marginBottom:10,
                      height: 40,
                      tintColor: '#a2a2a2',
                      backgroundColor: 'white',
                      borderStyle:'solid',
                      borderWidth:1,
                      borderColor:'white',
                      borderRadius:15}}
              values={this.state.biometryType ? [...ACCESS_CONTROL_OPTIONS, this.state.biometryType] : ACCESS_CONTROL_OPTIONS}
              onChange={({ nativeEvent }) => {
                this.setState({
                  accessControl: ACCESS_CONTROL_MAP[nativeEvent.selectedSegmentIndex],
                });
              }}
            />
            <GradientButton
              style={[styles.save, {marginTop: 5, height: 40}]}
              rkType='large'
              text='Next'
              onPress={this.onSignUpButtonPressed}
            />

            <View id='footer-spacer' style={{height: 10}} />

            <View style={styles.textRow}>
              <RkText rkType='primary3'>Already have an account?</RkText>
              <RkButton rkType='clear' onPress={this.onSignInButtonPressed}>
                <RkText rkType='header6'> Sign in now</RkText>
              </RkButton>
            </View>
          </View>

           <View id="bottom-spacer" style={{height: '5%'}}/>
        </View>
      </RkAvoidKeyboard>
    )
  }
}

const styles = RkStyleSheet.create(theme => ({
  screen: {
    // padding: 16,
    padding: 0,
    margin: 0,
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    // backgroundColor: theme.colors.screen.base,
    backgroundColor: '#a2a2a2'
  },
  image: {
    // marginBottom: 10,
    height: '100%',
    // height: scaleVertical(77),
    resizeMode: 'contain',
  },
  content: {
    justifyContent: 'space-between',
  },
  save: {
    // marginVertical: 20,
  },
  buttons: {
    flexDirection: 'row',
    // marginBottom: 24,
    // marginHorizontal: 24,
    justifyContent: 'space-around',
  },
  footer: {
    justifyContent: 'flex-end',
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
}));

const mapStateToProps = (state) => {
  return {
    payLoad: EngineSelectors.getPayload(state),
    phoneNumber: SettingsSelectors.getPhoneNumber(state),
    firstName: SettingsSelectors.getFirstName(state),
    lastName: SettingsSelectors.getLastName(state),
    userName: SettingsSelectors.getUserName(state),
    dob: SettingsSelectors.getDOB(state),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    engineCommandExec: (aCommand) => dispatch(EngineActions.engineCommandExec(aCommand))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(KeychainScreen)
