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

  // async reset() {
  //   try {
  //     await Keychain.resetGenericPassword();
  //     this.setState({
  //       status: 'Credentials Reset!',
  //       username: '',
  //       password: '',
  //     });
  //   } catch (err) {
  //     this.setState({ status: 'Could not reset credentials, ' + err });
  //   }
  // }

  onSignUpButtonPressed = () => {
    this.save()
    this.props.navigation.navigate('App');
  };

  onSignInButtonPressed = () => {
    this.props.navigation.navigate('Telephone');
  };

  render = () => (
    <RkAvoidKeyboard
      style={styles.screen}
      onStartShouldSetResponder={() => true}
      onResponderRelease={() => Keyboard.dismiss()}>
      <View style={{ alignItems: 'center' }}>
        {this.renderImage()}
        <RkText rkType='h1'>Access Control</RkText>
      </View>
      <View style={styles.content}>
        <View>
          <SegmentedControlIOS
            selectedIndex={0}
            values={this.state.biometryType ? [...ACCESS_CONTROL_OPTIONS, this.state.biometryType] : ACCESS_CONTROL_OPTIONS}
            onChange={({ nativeEvent }) => {
              this.setState({
                accessControl: ACCESS_CONTROL_MAP[nativeEvent.selectedSegmentIndex],
              });
            }}
          />
          <GradientButton
            style={styles.save}
            rkType='large'
            text='NEXT'
            onPress={this.onSignUpButtonPressed}
          />
        </View>
        <View style={styles.footer}>
          <View style={styles.textRow}>
            <RkText rkType='primary3'>Already have an account?</RkText>
            <RkButton rkType='clear' onPress={this.onSignInButtonPressed}>
              <RkText rkType='header6'> Sign in now</RkText>
            </RkButton>
          </View>
        </View>
      </View>
    </RkAvoidKeyboard>
  )
}

const styles = RkStyleSheet.create(theme => ({
  screen: {
    padding: 16,
    flex: 1,
    justifyContent: 'space-around',
    backgroundColor: theme.colors.screen.base,
  },
  image: {
    marginBottom: 10,
    height: scaleVertical(77),
    resizeMode: 'contain',
  },
  content: {
    justifyContent: 'space-between',
  },
  save: {
    marginVertical: 20,
  },
  buttons: {
    flexDirection: 'row',
    marginBottom: 24,
    marginHorizontal: 24,
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
