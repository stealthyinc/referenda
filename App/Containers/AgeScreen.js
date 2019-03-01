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
import { GradientButton } from '../Components/';
import { scaleVertical } from '../Utils/scale';
import NavigationType from '../Navigation/propTypes';
import { connect } from 'react-redux'

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
      require('../Assets/images/verified.png') : require('../Assets/images/logoDark.png')
  );

  renderImage = () => (
    <Image style={styles.image} source={this.getThemeImageSource(RkTheme.current)} />
  );

  onAgeButtonPressed = () => {
    this.props.navigation.navigate('Keychain');
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
        <RkText rkType='h1'>Age</RkText>
      </View>
      <View style={styles.content}>
        <View style={styles.componentRow}>
          <TouchableOpacity onPress={this.onDateTouchablePress}>
            <RkText rkType='primary'>
              {this.state.pickedValue[0].value}.
              {this.state.pickedValue[1]}.
              {this.state.pickedValue[2]}
            </RkText>
          </TouchableOpacity>
          <RkPicker
            title='Set Age'
            data={[this.pickerItems.months, this.pickerItems.days, this.pickerItems.years]}
            selectedOptions={this.state.pickedValue}
            visible={this.state.pickerVisible}
            onConfirm={this.onPickerConfirmButtonPress}
            onCancel={this.onPickerCancelButtonPress}
          />
        </View>
        <View>
          <GradientButton
            style={styles.save}
            rkType='large'
            text='NEXT'
            onPress={this.onAgeButtonPressed}
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
  componentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  caption: {
    marginLeft: 16,
  },
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

export default connect(mapStateToProps, mapDispatchToProps)(AgeScreen)
