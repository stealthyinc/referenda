import React from 'react';
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
import { FontAwesome } from '../../Assets/icons';
import { GradientButton } from '../../Components/gradientButton';
import { scaleVertical } from '../../Utils/scale';
import NavigationType from '../../Navigation/propTypes';

export class LoginV2 extends React.Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };
  static navigationOptions = {
    header: null,
  };

  onLoginButtonPressed = () => {
    this.props.navigation.navigate('App');
  };

  onSignUpButtonPressed = () => {
    this.props.navigation.navigate('SignUp');
  };

  getThemeImageSource = (theme) => (
    theme.name === 'light' ?
      require('../../Assets/images/verified.png') : require('../../Assets/images/logoDark.png')
  );

  renderImage = () => (
    <Image style={styles.image} source={this.getThemeImageSource(RkTheme.current)} />
  );

  render = () => (
    <RkAvoidKeyboard
      style={styles.screen}
      onStartShouldSetResponder={() => true}
      onResponderRelease={() => Keyboard.dismiss()}>
      <View style={styles.header}>
        {this.renderImage()}
        <RkText rkType='h1'>Sign In</RkText>
        {/*<RkText rkType='light h1'>React Native</RkText>*/}
      </View>
      <View style={styles.content}>
        <View>
          <RkTextInput rkType='rounded' placeholder='Username' />
          <RkTextInput rkType='rounded' placeholder='Password' secureTextEntry />
          <GradientButton
            style={styles.save}
            rkType='large'
            text='LOGIN'
            onPress={this.onLoginButtonPressed}
          />
        </View>
        <View style={styles.footer}>
          <View style={styles.textRow}>
            <RkText rkType='primary3'>Don’t have an account?</RkText>
            <RkButton rkType='clear' onPress={this.onSignUpButtonPressed}>
              <RkText rkType='header6'> Sign up now</RkText>
            </RkButton>
          </View>
        </View>
      </View>
    </RkAvoidKeyboard>
  );
}

const styles = RkStyleSheet.create(theme => ({
  screen: {
    padding: scaleVertical(16),
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: theme.colors.screen.base,
  },
  image: {
    height: scaleVertical(77),
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
    marginVertical: 20,
  },
  buttons: {
    flexDirection: 'row',
    marginBottom: scaleVertical(24),
    marginHorizontal: 24,
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
