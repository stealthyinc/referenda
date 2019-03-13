import React, { Component } from 'react'
import {
  View,
  Image,
  Keyboard,
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
import { connect } from 'react-redux'
import * as Keychain from 'react-native-keychain';
import SettingsActions from '../Redux/SettingsRedux'
const { userTypeInstance } = require('../Utils/UserType.js')

class TelephoneScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  static propTypes = {
    navigation: NavigationType.isRequired,
  };

  getThemeImageSource = (theme) => (
    theme.name === 'light' ?
      require('../Assets/images/verified.png') : require('../Assets/images/logoDark.png')
  );

  renderImage = () => (
    <Image style={styles.image} source={this.getThemeImageSource(RkTheme.current)} />
  );

  onTelephoneButtonPressed = () => {
    this.props.storePhoneNumber(this.state.phoneNumber)
    if (this.state.phoneNumber)
      userTypeInstance.setUserType(false)
    else
      userTypeInstance.setUserType(true)
    this.props.navigation.navigate('Age');
  };

  onSignInButtonPressed = () => {
    this.props.navigation.navigate('Login');
  };

  state = {
    username: '',
    password: '',
    status: '',
    phoneNumber: ''
  }

  async reset() {
    try {
      await Keychain.resetGenericPassword();
      this.setState({
        status: 'Credentials Reset!',
        username: '',
        password: '',
      });
    } catch (err) {
      this.setState({ status: 'Could not reset credentials, ' + err });
    }
  }

  render = () => (
    <RkAvoidKeyboard
      style={styles.screen}
      onStartShouldSetResponder={() => true}
      onResponderRelease={() => Keyboard.dismiss()}>

      <View id="width-limiter" style={{flexDirection: 'column', flex: 1, width: '95%'}}>

        <View id="top-spacer" style={{height: '10%'}}/>

        <View style={{ alignItems: 'center', height: '20%' }}>
          {this.renderImage()}
          <RkText rkType='h1' style={{color: 'white'}}>Phone Number</RkText>
        </View>

        <View id="top-content-spacer" style={{height: '5%'}}/>

        <View style={{alignItems: 'flex-start', flex: 1}}>
          <View class='text-spacer' style={{height: 10}} />
          <RkText rkType='h6' style={{color: 'white'}}>Referenda requires your phone number to provide you unique access to our service. This prevents bots and other false identities from participating on the platform.</RkText>
          <View class='text-spacer' style={{height: 10}} />
          <RkText rkType='h6' style={{color: 'white'}}>Importantly, we do not store your phone number. Instead we store a unique one-way hash of your number, protecting your identity.</RkText>
        </View>

        <View style={{height: '25%'}}>
          <View style={{flex: 1}} />
          <RkTextInput rkType='rounded' placeholder='Phone Number' onChangeText={(phoneNumber) => this.setState({ phoneNumber })}/>
          <GradientButton
            style={[styles.save, {marginTop: 5, height: 40}]}
            rkType='large'
            text='Next'
            onPress={this.onTelephoneButtonPressed}
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

const styles = RkStyleSheet.create(theme => ({
  screen: {
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
    height: '100%',
    // marginBottom: 10,
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
    storePhoneNumber: (phoneNumber) => dispatch(SettingsActions.storePhoneNumber(phoneNumber))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TelephoneScreen)
