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

class DonatorAmountScreen extends Component {
  static navigationOptions = {
    title: 'Campaign Donation'.toUpperCase(),
  };

  state = {
  }

  constructor() {
    super();
    this.donationRecord = {}
  }

  componentDidMount() {
    // redux is immutable, setting that obj will not allow changes
    this.donationRecord = JSON.parse(JSON.stringify(this.props.donationRecord))
    // TODO: might need to force re-render if values are non-default (i.e. user
    //       pressed back button.)
  }

  getDonationButton(anAmount) {
    // TODO: special case if other
    //
    const buttonText = `\$${anAmount}`
    return (
      <GradientButton
        rkType='medium'
        text={buttonText}
        style={styles.buttonStyle}
        onPress={() => {this.onDonationButtonPressed(anAmount)}}/>
    )
  }

  onDonationButtonPressed = (anAmount) => {
    const amountStr = `\$${anAmount}`
    this.donationRecord.amount = amountStr
    this.props.storeDonationRecord(this.donationRecord)
    this.props.navigation.navigate('Donator Info')
  }

  onNextButtonPressed = () => {
    this.props.storeDonationRecord(this.donationRecord)
    this.props.navigation.navigate('Donator Info')
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
      <View style={[styles.container, {paddingVertical: `${verticalPaddingPercent}%`}]}>
        <View style={{width: '100%', height: '100%', flexDirection:'column', alignItems:'center', justifyContent:'flex-end'}}>

          <View style={{width: '100%', flex: 1, alignItems:'center', justifyContent:'center'}}>
            { /*<Image source={candidate} style={{height: '25%', borderRadius: 150}}/> */}
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

          <Text style={styles.title}>Donor Contribution</Text>

          <View style={{width: '100%', marginVertical: 9, flexDirection:'row', justifyContent:'flex-start'}}>
            <View style={styles.buttonBarLeftStyle}>
              {this.getDonationButton('5')}
              {this.getDonationButton('10')}
              {this.getDonationButton('25')}
              {this.getDonationButton('50')}
            </View>
            <View style={styles.buttonBarRightStyle}>
              {this.getDonationButton('100')}
              {this.getDonationButton('250')}
              {this.getDonationButton('500')}
              {this.getDonationButton('Other')}
            </View>
          </View>
{/*
          <GradientButton
            rkType='medium'
            text='Next'
            style={styles.buttonStyle}
            onPress={() => {this.props.navigation.navigate('Donator Info')}}/>
            */}
        </View>
      </View>
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
  buttonBarLeftStyle: {
    width: '50%',
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'flex-end',
    paddingRight: '3%'
  },
  buttonBarRightStyle: {
    width: '50%',
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'flex-end',
    paddingLeft: '3%'
  },
  buttonStyle: {
    marginVertical:9
  },
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

export default connect(mapStateToProps, mapDispatchToProps)(DonatorAmountScreen)
