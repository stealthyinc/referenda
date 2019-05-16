import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  View,
  Image,
  Keyboard,
} from 'react-native';
import {
  RkButton,
  RkText,
  RkTextInput,
  RkAvoidKeyboard,
  RkTheme,
  RkStyleSheet,
} from 'react-native-ui-kitten';
import { FontAwesome } from '../assets/icons';
import { GradientButton } from '../components/gradientButton';
import { scaleVertical } from '../utils/scale';
import NavigationType from '../navigation/propTypes';
import * as Keychain from 'react-native-keychain';
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../redux/YourRedux'

import EngineActions from '../redux/EngineRedux'
import {EngineCommand} from '../engine/commands/engineCommand'
const { userTypeInstance } = require('../utils/UserType.js')

class LoginScreen extends Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };

  static navigationOptions = {
    header: null,
  };

  state = {
    username: '',
    password: '',
    status: ''
  }

  componentDidMount() {
    this.load()
  }

  async load() {
    try {
      const credentials = await Keychain.getGenericPassword({service: 'vote.referenda'});
      if (credentials) {
        const engCmd =
          EngineCommand.signInCommand(credentials.username, credentials.password)
        this.props.engineCommandExec(engCmd)

        this.onLoginButtonPressed()
      } else {
        // this.setState({ status: 'No credentials stored.' });
        alert('No credentials stored.')
      }
    } catch (err) {
      this.setState({ status: 'Could not load credentials. ' + err });
    }
  }

  onLoginButtonPressed = () => {
    if (userTypeInstance.getUserType())
      this.props.navigation.navigate('CampaignerMenu');
    else
      this.props.navigation.navigate('SocialMenu');
  };

  onSignUpButtonPressed = () => {
    this.props.navigation.navigate('Telephone');
  };

  getThemeImageSource = (theme) => (
    theme.name === 'light' ?
      require('../assets/images/verified.png') : require('../assets/images/logoDark.png')
  );

  renderImage = () => (
    <Image style={styles.image} source={this.getThemeImageSource(RkTheme.current)} />
  );

  render () {
    // const username = this.state.username ? this.state.username : 'Username'
    // const password = this.state.password ? this.state.password : 'Password'
    return (
      <RkAvoidKeyboard
        style={styles.screen}
        onStartShouldSetResponder={() => true}
        onResponderRelease={() => Keyboard.dismiss()}>

        <View id="width-limiter" style={{flexDirection: 'column', flex: 1, width: '95%'}}>

          <View id="top-spacer" style={{height: '10%'}}/>

          <View style={{ alignItems: 'center', height: '20%' }}>
            {this.renderImage()}
            <RkText rkType='h1' style={{color: 'white'}}>Sign In</RkText>
          </View>

          <View id="top-content-spacer" style={{height: '5%'}}/>

          <View style={{alignItems: 'flex-start', flex: 1}}/>

          <View style={{height: '35%'}}>

            <View style={{flex: 1}} />

            {/*<RkTextInput rkType='rounded' placeholder={username} />
            <RkTextInput rkType='rounded' placeholder={password} secureTextEntry />*/}
            <GradientButton
              style={[styles.save, {marginTop: 5, height:40}]}
              rkType='large'
              text='Sign Up'
              onPress={this.onSignUpButtonPressed}
            />

            <View id='footer-spacer' style={{height: 10}} />

            {/*<View style={styles.textRow}>
              <RkText rkType='primary3'>Don’t have an account?</RkText>
              <RkButton rkType='clear' onPress={this.onSignUpButtonPressed}>
                <RkText rkType='header6'> Sign up now</RkText>
              </RkButton>
            </View>*/}

          </View>

          <View id="bottom-spacer" style={{height: '5%'}}/>
        </View>

      </RkAvoidKeyboard>
    );
  }
}

const styles = RkStyleSheet.create(theme => ({
  screen: {
    // padding: scaleVertical(16),
    padding: 0,
    margin: 0,
    width: '100%',
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'space-between',
    justifyContent: 'space-around',
    // backgroundColor: theme.colors.screen.base,
    backgroundColor: '#a2a2a2'
  },
  image: {
    // height: scaleVertical(77),
    height: '100%',
    resizeMode: 'contain',
  },
  header: {
    paddingBottom: scaleVertical(10),
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  content: {
    justifyContent: 'space-between',
  },
  save: {
    // marginVertical: 20,
  },
  buttons: {
    flexDirection: 'row',
    // marginBottom: scaleVertical(24),
    // marginHorizontal: 24,
    justifyContent: 'space-around',
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    borderColor: theme.colors.border.solid,
  },
  footer: {},
}));

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    engineCommandExec: (aCommand) => dispatch(EngineActions.engineCommandExec(aCommand))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)
