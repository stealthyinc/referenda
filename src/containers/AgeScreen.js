import React, { Component } from 'react'
import {
  Text,
  View,
  Image,
  Keyboard,
  TouchableOpacity
} from 'react-native';
import {
  RkButton,
  RkText,
  RkTextInput,
  RkStyleSheet,
  RkTheme,
  RkPicker,
  RkAvoidKeyboard,
} from 'react-native-ui-kitten';
import { GradientButton } from '../components/';
import { scaleVertical } from '../utils/scale';
import NavigationType from '../navigation/propTypes';
import { connect } from 'react-redux'
import SettingsActions from '../redux/SettingsRedux'

const data = [
     [{key: 1, value: 'Jun'},
     {key: 2, value: 'Feb'},
     {key: 3, value: 'Mar'},
     {key: 4, value: 'Apr'}],
     [1, 2, 3, 4, 5],
     [2017, 2018, 2019]
]

class AgeScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  static propTypes = {
    navigation: NavigationType.isRequired,
  };

  state = {
    pickerVisible: false,
    pickedValue: [{ key: 8, value: 'Jan' }, 26, 2001],
  };

  constructor(props) {
    super(props);
    this.pickerItems = {
      days: this.generateArrayFromRange(1, 31),
      months: [
        { key: 1, value: 'Jun' },
        { key: 2, value: 'Feb' },
        { key: 3, value: 'Mar' },
        { key: 4, value: 'Apr' },
        { key: 5, value: 'May' },
        { key: 6, value: 'Jun' },
        { key: 7, value: 'Jul' },
        { key: 8, value: 'Aug' },
        { key: 9, value: 'Sep' },
        { key: 10, value: 'Oct' },
        { key: 11, value: 'Nov' },
        { key: 12, value: 'Dec' },
      ],
      years: this.generateArrayFromRange(1915, 2001),
    };
  }

  onDateTouchablePress = () => {
    this.setState({ pickerVisible: true });
  };

  onPickerCancelButtonPress = () => {
    this.setState({ pickerVisible: false });
  };

  onPickerConfirmButtonPress = (value) => {
    this.setState({
      pickedValue: value,
      pickerVisible: false,
    });
  };

  // eslint-disable-next-line arrow-body-style
  generateArrayFromRange = (start, finish) => {
    return Array(...Array((finish - start) + 1)).map((_, i) => start + i);
  };

  getThemeImageSource = (theme) => (
    theme.name === 'light' ?
      require('../assets/images/verified.png') : require('../assets/images/logoDark.png')
  );

  renderImage = () => (
    <Image style={styles.image} source={this.getThemeImageSource(RkTheme.current)} />
  );

  onAgeButtonPressed = () => {
    // TODO: convert this.state.dob to a UTC using the date methods
    //
    this.props.storeDob(Date.now())

    this.props.navigation.navigate('Keychain');
  };

  onSignInButtonPressed = () => {
    this.props.navigation.navigate('Login');
  };

  render = () => {
    const dob = `${this.state.pickedValue[0].value}-${this.state.pickedValue[1]}-${this.state.pickedValue[2]}`
//this.onDateTouchablePress
    return (
      <RkAvoidKeyboard
        style={styles.screen}
        onStartShouldSetResponder={() => true}
        onResponderRelease={() => Keyboard.dismiss()}>

        <View id="width-limiter" style={{flexDirection: 'column', flex: 1, width: '95%'}}>

          <View id="top-spacer" style={{height: '10%'}}/>

          <View style={{ alignItems: 'center', height: '20%' }}>
            {this.renderImage()}
            <RkText rkType='h1' style={{color: 'white'}}>Age</RkText>
          </View>

          <View id="top-content-spacer" style={{height: '5%'}}/>

          <View style={{alignItems: 'flex-start', flex: 1}}>
            <View class='text-spacer' style={{height: 10}} />
            <RkText rkType='h6' style={{color: 'white'}}>You must be at least 13 years of age to use Referenda. Confirm this below by specifying your date of birth.</RkText>
          </View>

          <View style={{height: '25%'}}>
            <View style={{flex: 1}} />

            <View style={styles.componentRow}>
              <RkTextInput rkType='rounded' placeholder={dob} onFocus={this.onDateTouchablePress}/>
              <RkPicker
                title='Set Age'
                data={[this.pickerItems.months, this.pickerItems.days, this.pickerItems.years]}
                selectedOptions={this.state.pickedValue}
                visible={this.state.pickerVisible}
                onConfirm={this.onPickerConfirmButtonPress}
                onCancel={this.onPickerCancelButtonPress}
              />
            </View>

            <GradientButton
              style={[styles.save, {marginTop: 5, height: 40}]}
              rkType='large'
              text='Next'
              onPress={this.onAgeButtonPressed}
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
      </RkAvoidKeyboard>);
    }
}

const styles = RkStyleSheet.create(theme => ({
  componentRow: {
    // flexDirection: 'row',
    // alignItems: 'center',
    // marginBottom: 25,
  },
  caption: {
    marginLeft: 16,
  },
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
    // height: scaleVertical(77),
    height: '100%',
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
    storeDob: (dob) => dispatch(SettingsActions.storeDob(dob))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AgeScreen)
