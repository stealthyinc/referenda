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
  Linking,
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

import candidate from '../Assets/avatars/agatha2.png'

class DonatorInfoScreen extends Component {
  static navigationOptions = {
    title: 'Campaign Donation'.toUpperCase(),
  };

  constructor() {
    super();
    this.donationRecord = {}
    this.state = {
      validPhoneNumber: false,
      validOccupation: false,
      validEmployer: false
    }
  }

  componentDidMount() {
    const donationRecord = JSON.parse(JSON.stringify(this.props.donationRecord))
    if (donationRecord.hasOwnProperty('phoneNumber')) {
      this.validatePhoneNumber(donationRecord.phoneNumber)
    }
    if (donationRecord.hasOwnProperty('occupation')) {
      this.validateOccupation((donationRecord.occupation))
    }
    if (donationRecord.hasOwnProperty('employer')) {
      this.validateEmployer(donationRecord.employer)
    }
  }

  onPhoneNumber = (aPhoneNumber) => {
    this.donationRecord.phoneNumber = aPhoneNumber
    this.storeInRedux()
    this.validatePhoneNumber(aPhoneNumber)
  }

  validatePhoneNumber = (aPhoneNumber) => {
    // TODO: Eventually use this (possibly after a basic sanity check as it's
    //       expensive in time according to the doc, but it catches all the
    //       peculiarities of NANP phone numbers):
    //         - https://github.com/googlei18n/libphonenumber
    //
    const phoneValidator = /^\d{10}$/;
    if (aPhoneNumber.match(phoneValidator) && !this.state.validPhoneNumber) {
      this.setState({validPhoneNumber: true})
    } else if (this.state.validPhoneNumber) {
      this.setState({validPhoneNumber: false})
    }
  }

  onOccupation = (anOccupation) => {
    this.donationRecord.occupation = anOccupation
    this.storeInRedux()
    this.validateOccupation(anOccupation)
  }

  validateOccupation = (anOccupation) => {
    try {
      if (anOccupation && (anOccupation.length >= 3)) {
        if (!this.state.validOccupation) {
          this.setState({validOccupation: true})
        }
      } else if (this.state.validOccupation) {
        this.setState({validOccupation: false})
      }
    } catch (error) {
      if (this.state.validOccupation) {
        this.setState({validOccupation: false})
      }
    }
  }

  onEmployer = (anEmployer) => {
    this.donationRecord.employer = anEmployer
    this.storeInRedux()
    this.validateEmployer(anEmployer)
  }

  validateEmployer = (anEmployer) => {
    try {
      if (anEmployer && (anEmployer.length >= 1)) {
        if (!this.state.validEmployer) {
          this.setState({validEmployer: true})
        }
      } else if (this.state.validEmployer) {
        this.setState({validEmployer: false})
      }
    } catch (error) {
      if (this.state.validEmployer) {
        this.setState({validEmployer: false})
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
    this.props.navigation.navigate('Donator Name')
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
    const activateNextButton = this.state.validPhoneNumber &&
                               this.state.validOccupation &&
                               this.state.validEmployer
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

    const phoneNumberInputStyle =
      {backgroundColor: (this.state.validPhoneNumber ? 'white' : '#FFE4E1')}
    const occupationInputStyle =
      {backgroundColor: (this.state.validOccupation ? 'white' : '#FFE4E1')}
    const employerInputStyle =
      {backgroundColor: (this.state.validEmployer ? 'white' : '#FFE4E1')}

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
          {this.getInputElement('Mobile Phone Number', this.onPhoneNumber, phoneNumberInputStyle, donationRecord.phoneNumber, true)}
          {this.getInputElement('Occupation*', this.onOccupation, occupationInputStyle, donationRecord.occupation)}
          {this.getInputElement('Employer*', this.onEmployer, employerInputStyle, donationRecord.employer)}

          {/*<RkTextInput
            rkType='rounded'
            placeholder='Mobile Phone Number'
            keyboardType='phone-pad'
            onChangeText={(phoneNumber) => { this.onPhoneNumber(phoneNumber) }}/>
          <RkTextInput rkType='rounded' placeholder='Occupation*' onChangeText={(occupation) => { this.onOccupation(occupation) }}/>
          <RkTextInput rkType='rounded' placeholder='Employer*' onChangeText={(employer) => { this.onEmployer(employer) }}/>*/}
          {/* Make this asterisk a link to the relevant law for people to see / inspect. */}
          <Text style={{color: 'blue'}} onPress={() => Linking.openURL('https://transition.fec.gov/pages/brochures/fecfeca.shtml#Disclosure')}>
            *Campaign finance laws require occupation & employer.
          </Text>

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

export default connect(mapStateToProps, mapDispatchToProps)(DonatorInfoScreen)
