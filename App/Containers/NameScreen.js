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

class NameScreen extends Component {
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

  onNextButtonPressed = () => {
    // TODO:

    // this.props.storePhoneNumber(this.state.phoneNumber)
    // if (this.state.phoneNumber)
    //   userTypeInstance.setUserType(false)
    // else
    //   userTypeInstance.setUserType(true)
    console.log('NameScreen "next" button pressed.')
    this.props.navigation.navigate('Age');
  };

  onSignInButtonPressed = () => {
    this.props.navigation.navigate('Login');
  };

  state = {
    firstName: '',
    lastName: '',
    userName: ''
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
          <RkText rkType='h1' style={{color: 'white'}}>Name Information</RkText>
        </View>

        <View id="top-content-spacer" style={{height: '5%'}}/>

        <View style={{alignItems: 'flex-start', flex: 1}}>
          <View class='text-spacer' style={{height: 10}} />
          <RkText rkType='h6' style={{color: 'white'}}>Referenda uses your name information to track campaigning achievements (i.e. donations & conversations).</RkText>
        </View>

        <View style={{height: '45%'}}>
          <View style={{flex: 1}} />
          <RkTextInput rkType='rounded' placeholder='First Name' onChangeText={(firstName) => this.setState({ firstName })}/>
          <RkTextInput rkType='rounded' placeholder='Last Name' onChangeText={(lastName) => this.setState({ lastName })}/>
          <RkTextInput rkType='rounded' placeholder='Username' onChangeText={(userName) => this.setState({ userName })}/>
          <GradientButton
            style={[styles.save, {marginTop: 5, height: 40}]}
            rkType='large'
            text='Next'
            onPress={this.onNextButtonPressed}
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
    // storePhoneNumber: (phoneNumber) => dispatch(SettingsActions.storePhoneNumber(phoneNumber))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NameScreen)
