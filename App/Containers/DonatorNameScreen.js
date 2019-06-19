/*
 Copyright 2019 Square Inc.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
import React, { Component } from 'react';
import { connect } from 'react-redux'
import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  Dimensions,
} from 'react-native';
import {
  RkButton,
  RkText,
  RkTextInput,
  RkStyleSheet,
  RkTheme,
  RkAvoidKeyboard,
} from 'react-native-ui-kitten';
import { GradientButton } from '../Components/gradientButton'
import DonationActions, { DonationSelectors } from '../Redux/DonationRedux'

import candidate from '../Assets/avatars/campa.jpg'

class DonatorNameScreen extends Component {
  static navigationOptions = {
    title: 'Campaign Donation'.toUpperCase(),
  };

  constructor() {
    super();
    this.donationRecord = {}
    this.state = {
      validFirstName: false,
      validLastName: false,
    }
  }

  componentDidMount() {
    const donationRecord = JSON.parse(JSON.stringify(this.props.donationRecord))
    if (donationRecord.hasOwnProperty('firstName')) {
      this.validateFirstName(donationRecord.firstName)
    }
    if (donationRecord.hasOwnProperty('lastName')) {
      this.validateLastName(donationRecord.lastName)
    }
  }

  onFirstName = (aFirstName) => {
    this.donationRecord.firstName = aFirstName
    this.storeInRedux()
    this.validateFirstName(aFirstName)
  }

  validateFirstName = (aFirstName) => {
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

  onLastname = (aLastName) => {
    this.donationRecord.lastName = aLastName
    this.storeInRedux()
    this.validateLastName(aLastName)
  }

  validateLastName = (aLastName) => {
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

  storeInRedux = () => {
    const reduxDonationRecord = JSON.parse(JSON.stringify(this.props.donationRecord))
    const merge = Object.assign(reduxDonationRecord, this.donationRecord)
    this.props.storeDonationRecord(merge)
  }

  onNextButtonPressed = () => {
    this.storeInRedux()
    this.props.navigation.navigate('Donation')
  }

  getInputElement = (aPlaceHolder, aCallback, aStyle, aValue=undefined, isPhoneNumber=false) => {
    const keyboardType = (isPhoneNumber) ? 'phone-pad' : 'default'
    if (aValue) {
      return (
        <RkTextInput
          rkType='rounded'
          keyboardType={keyboardType}
          placeholder={aPlaceHolder}
          style={aStyle}
          value={aValue}
          onChangeText={aCallback}
          />
      )
    }

    return (
      <RkTextInput
        rkType='rounded'
        keyboardType={keyboardType}
        placeholder={aPlaceHolder}
        style={aStyle}
        onChangeText={aCallback}
        />
    )
  }

  render() {
    // Calculate dimensions for the Agatha image:
    //
    const headerHeightPercent = 7
    const verticalPaddingPercent = 3
    const imageHeightViewPortPercent = 30

    let {width, height} = Dimensions.get('window')
    const mainViewHeight = height
                           - (height * 2 * verticalPaddingPercent / 100)
                           - (height * headerHeightPercent / 100)
    const upperViewHeight = mainViewHeight * imageHeightViewPortPercent / 100
    const imageDimension = Math.floor(upperViewHeight)
    const imageBorderRadius = Math.floor(imageDimension / 2)

    const donationRecord = JSON.parse(JSON.stringify(this.props.donationRecord))

    // Determine if next button is active and indicate incorrect fields
    //
    const activateNextButton = this.state.validFirstName &&
                               this.state.validLastName
    const nextButton = (activateNextButton) ?
      (
        <GradientButton
        style={styles.buttonStyle}
        rkType='medium'
        text='Next'
        onPress={this.onNextButtonPressed} />
     ) :
     (
      <GradientButton
        colors={['#d2d2d2', '#d2d2d2']}
        style={styles.buttonStyle}
        rkType='medium'
        text='Next' />
     )

    const firstNameInputStyle =
      {backgroundColor: (this.state.validFirstName ? 'white' : '#FFE4E1')}
    const lastNameInputStyle =
      {backgroundColor: (this.state.validLastName ? 'white' : '#FFE4E1')}

    return (
      <RkAvoidKeyboard style={[styles.container, {paddingVertical: `${verticalPaddingPercent}%`}]}>
        <View style={{width: '100%', height: '100%', flexDirection:'column', alignItems:'center', justifyContent:'flex-end'}}>

        <View style={{width: '100%', flex: 1, alignItems:'center', justifyContent:'center'}}>
          <Image
            source={candidate}
            style={{
              height: imageDimension,
              width: imageDimension,
              borderRadius: imageBorderRadius,
              borderWidth: 1,
              borderColor: '#389C95',
              resizeMode: 'contain'}}/>
        </View>

          <Text style={styles.title}>Donor Information</Text>
          {this.getInputElement('First Name', this.onFirstName, firstNameInputStyle, donationRecord.firstName)}
          {this.getInputElement('Last Name', this.onLastname, lastNameInputStyle, donationRecord.lastName)}
          {/* <RkTextInput rkType='rounded' placeholder='First Name' onChangeText={(firstName) => {this.onFirstName(firstName) }}/>
          <RkTextInput rkType='rounded' placeholder='Last Name' onChangeText={(lastName) => {this.onLastname(lastName) }}/> */}
          {nextButton}
          {/* <GradientButton
            rkType='medium'
            text='Next'
            style={styles.buttonStyle}
            onPress={this.onNextButtonPressed}/> */}
        </View>
      </RkAvoidKeyboard>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#78CCC5',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '6%',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
  },
  buttonStyle: {
    marginVertical:9
  }
});

const mapStateToProps = (state) => {
  return {
    donationRecord: DonationSelectors.getDonationRecord(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    storeDonationRecord: (donationRecord) =>
      dispatch(DonationActions.storeDonationRecord(donationRecord))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DonatorNameScreen)
