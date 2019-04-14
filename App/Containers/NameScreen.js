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

  constructor() {
    super()
    this.firstName = ''
    this.lastName = ''
    this.userName = ''

    this.state = {
      validFirstName: false,
      validLastName: false,
      validUserName: false
    }
  }

  getThemeImageSource = (theme) => (
    theme.name === 'light' ?
      require('../Assets/images/verified.png') : require('../Assets/images/logoDark.png')
  );

  renderImage = () => (
    <Image style={styles.image} source={this.getThemeImageSource(RkTheme.current)} />
  );

  onNextButtonPressed = () => {
    this.props.storeNameInfo(this.firstName, this.lastName, this.userName)

    console.log('NameScreen "next" button pressed.')
    this.props.navigation.navigate('Age');
  };

  onSignInButtonPressed = () => {
    this.props.navigation.navigate('Login');
  };

  onFirstNameChange = (aFirstName) => {
    this.firstName = aFirstName

    try {
      if (aFirstName && (aFirstName.length >= 1)) {
        if (!this.state.validFirstName) {
          this.setState({validFirstName: true})
        }
      } else if (this.state.validFirstName) {
        this.setState({validFirstName: false})
      }
    } catch (error) {
      if (this.state.validFirstName) {
        this.setState({validFirstName: false})
      }
    }
  }

  onLastNameChange = (aLastName) => {
    this.lastName = aLastName

    try {
      if (aLastName && (aLastName.length >= 1)) {
        if (!this.state.validLastName) {
          this.setState({validLastName: true})
        }
      } else if (this.state.validLastName) {
        this.setState({validLastName: false})
      }
    } catch (error) {
      if (this.state.validLastName) {
        this.setState({validLastName: false})
      }
    }
  }

  onUserNameChange = (aUserName) => {
    this.userName = aUserName

    try {
      if (aUserName && (aUserName.length >= 3)) {
        if (!this.state.validUserName) {
          this.setState({validUserName: true})
        }
      } else if (this.state.validUserName) {
        this.setState({validUserName: false})
      }
    } catch (error) {
      if (this.state.validUserName) {
        this.setState({validUserName: false})
      }
    }
  }

  render = () => {
    const activateNextButton = this.state.validFirstName &&
                               this.state.validLastName &&
                               this.state.validUserName

    const nextButton = (activateNextButton) ?
       (
         <GradientButton
         style={{marginTop: 5, height: 40}}
         rkType='large'
         text='Next'
         onPress={this.onNextButtonPressed}
       />
      ) :
      (
       <GradientButton
         colors={['#d2d2d2', '#d2d2d2']}
         style={{marginTop: 5, height: 40}}
         rkType='large'
         text='Next'
       />
      )

    const firstNameInputStyle =
      {backgroundColor: (this.state.validFirstName ? 'white' : '#FFE4E1')}
    const lastNameInputStyle =
      {backgroundColor: (this.state.validLastName ? 'white' : '#FFE4E1')}
    const userNameInputStyle =
      {backgroundColor: (this.state.validUserName ? 'white' : '#FFE4E1')}


    return (
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
            <RkTextInput style={firstNameInputStyle} rkType='rounded' placeholder='First Name' onChangeText={this.onFirstNameChange}/>
            <RkTextInput style={lastNameInputStyle} rkType='rounded' placeholder='Last Name' onChangeText={this.onLastNameChange}/>
            <RkTextInput style={userNameInputStyle} rkType='rounded' placeholder='Username' onChangeText={this.onUserNameChange}/>
            {nextButton}
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
    storeNameInfo: (firstName, lastName, userName) =>
      dispatch(SettingsActions.storeNameInfo(firstName, lastName, userName))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NameScreen)
