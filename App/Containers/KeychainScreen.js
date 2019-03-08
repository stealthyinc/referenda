import React, { Component } from 'react';
import { connect } from 'react-redux'
import {
  View,
  Image,
  Keyboard,
  SegmentedControlIOS,
} from 'react-native';
import {
  RkButton,
  RkText,
  RkTextInput,
  RkStyleSheet,
  RkTheme,
  RkAvoidKeyboard,
} from 'react-native-ui-kitten';
import { GradientButton } from '../Components/';
import { scaleVertical } from '../Utils/scale';
import NavigationType from '../Navigation/propTypes';
import * as Keychain from 'react-native-keychain';
const { RefCrypto } = require('../Utils/RefCrypto')

const ACCESS_CONTROL_OPTIONS = ['None', 'Passcode', 'Password'];
const ACCESS_CONTROL_MAP = [null, Keychain.ACCESS_CONTROL.DEVICE_PASSCODE, Keychain.ACCESS_CONTROL.APPLICATION_PASSWORD, Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET]

class KeychainScreen extends Component {
  static navigationOptions = {
    header: null,
  }

  static propTypes = {
    navigation: NavigationType.isRequired,
  };

  state = {
    username: '',
    password: '',
    status: '',
    biometryType: null,
    accessControl: null,
  };

  getThemeImageSource = (theme) => (
    theme.name === 'light' ?
      require('../Assets/images/verified.png') : require('../Assets/images/logoDark.png')
  );

  renderImage = () => (
    <Image style={styles.image} source={this.getThemeImageSource(RkTheme.current)} />
  );

  componentDidMount() {
    Keychain.getSupportedBiometryType().then(biometryType => {
      this.setState({ biometryType });
    });
  }

  async save() {
    try {
      const username = RefCrypto.getPublicKey()
      const password = RefCrypto.getPrivateKey()
      await Keychain.setGenericPassword(
        username,
        password,
        { accessControl: this.state.accessControl }
      );
      this.setState({ username: '', password: '', status: 'Credentials saved!' });
    } catch (err) {
      this.setState({ status: 'Could not save credentials, ' + err });
    }
  }

  onSignUpButtonPressed = () => {
    this.save()
    this.props.navigation.navigate('App');
  };

  onSignInButtonPressed = () => {
    this.props.navigation.navigate('Telephone');
  };

  render = () => {
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

          <View style={{alignItems: 'flex-start', flex: 1}}>
            <View class='text-spacer' style={{height: 10}} />
            <RkText rkType='h6' style={{color: 'white'}}>Your data is owned by you, encrypted with your encryption keys and then stored on cloud storage. You own the encryption keys--that means nobody, not even us at referenda can access your data.</RkText>
            <View class='text-spacer' style={{height: 10}} />
            <RkText rkType='h6' style={{color: 'white'}}>Secure your encryption keys on this device by using a passcode or Face ID.</RkText>
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
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(KeychainScreen)
