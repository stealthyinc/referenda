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

import candidate from '../Assets/avatars/agatha2.png'

class DonatorInfoScreen extends Component {
  static navigationOptions = {
    title: 'Campaign Donation'.toUpperCase(),
  };

  constructor() {
    super();
    this.donationRecord = {}
  }

  onPhoneNumber = (aPhoneNumber) => {
    this.donationRecord.phoneNumber = aPhoneNumber
  }

  onOccupation = (anOccupation) => {
    this.donationRecord.occupation = anOccupation
  }

  onEmployer = (anEmployer) => {
    this.donationRecord.employer = anEmployer
  }

  onNextButtonPressed = () => {
    const reduxDonationRecord = JSON.parse(JSON.stringify(this.props.donationRecord))
    const merge = Object.assign(reduxDonationRecord, this.donationRecord)
    this.props.storeDonationRecord(merge)
    this.props.navigation.navigate('Donator Name')
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
          <RkTextInput
            rkType='rounded'
            placeholder='Mobile Phone Number'
            keyboardType='phone-pad'
            onChangeText={(phoneNumber) => { this.onPhoneNumber(phoneNumber) }}/>
          <RkTextInput rkType='rounded' placeholder='Occupation*' onChangeText={(occupation) => { this.onOccupation(occupation) }}/>
          <RkTextInput rkType='rounded' placeholder='Employer*' onChangeText={(employer) => { this.onEmployer(employer) }}/>
          {/* Make this asterisk a link to the relevant law for people to see / inspect. */}
          <Text style={styles.description}>*Campaign finance laws require occupation & employer.</Text>
          <GradientButton
            rkType='medium'
            text='Next'
            style={styles.buttonStyle}
            onPress={this.onNextButtonPressed}/>
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
