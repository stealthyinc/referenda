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
import {
  SQIPCardEntry,
  SQIPApplePay,
  SQIPCore,
  SQIPGooglePay,
} from 'react-native-square-in-app-payments';

import Modal from 'react-native-modal';
import OrderModal from '../Components/OrderModal';
import GreenButton from '../Components/GreenButton';
import {
  SQUARE_APP_ID,
  CHARGE_SERVER_HOST,
  GOOGLE_PAY_LOCATION_ID,
  APPLE_PAY_MERCHANT_ID,
} from '../Utils/SquareConstants';
import {
  printCurlCommand,
  showAlert,
} from '../Utils/SquareUtils';
import chargeCardNonce from '../Utils/Charge';
import { GradientButton } from '../Components/gradientButton'

import { ifIphoneX } from 'react-native-iphone-x-helper'

require('../Images/iconCookie.png');

const applePayStatus = {
  none: 0,
  succeeded: 1,
  nonceNotCharged: 2,
};
import candidate from '../Assets/avatars/agatha2.png'

export default class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Campaign Donation'.toUpperCase(),
  };
  state = {
    showingBottomSheet: false,
    showingCardEntry: false,
    showingDigitalWallet: false,
    canUseDigitalWallet: false,
    applePayState: applePayStatus.none,
    applePayError: null,
  }

  constructor() {
    super();
    this.onStartCardEntry = this.startCardEntry.bind(this);
    this.onShowCardEntry = this.onShowCardEntry.bind(this);
    this.onCardNonceRequestSuccess = this.onCardNonceRequestSuccess.bind(this);
    this.onCardEntryCancel = this.onCardEntryCancel.bind(this);
    this.onApplePayRequestNonceSuccess = this.onApplePayRequestNonceSuccess.bind(this);
    this.onApplePayRequestNonceFailure = this.onApplePayRequestNonceFailure.bind(this);
    this.onApplePayComplete = this.onApplePayComplete.bind(this);
    this.onGooglePayRequestNonceSuccess = this.onGooglePayRequestNonceSuccess.bind(this);
    this.onGooglePayRequestNonceFailure = this.onGooglePayRequestNonceFailure.bind(this);
    this.onGooglePayCanceled = this.onGooglePayCanceled.bind(this);
    this.onShowDigitalWallet = this.onShowDigitalWallet.bind(this);
    this.showOrderScreen = this.showOrderScreen.bind(this);
    this.startCardEntry = this.startCardEntry.bind(this);
    this.closeOrderScreen = this.closeOrderScreen.bind(this);
  }

  async componentDidMount() {
    await SQIPCore.setSquareApplicationId(SQUARE_APP_ID);
    let digitalWalletEnabled = false;
    if (Platform.OS === 'ios') {
      await SQIPCardEntry.setIOSCardEntryTheme({
        saveButtonFont: {
          size: 30,
        },
        saveButtonTitle: 'Donate 💰',
        keyboardAppearance: 'Light',
        tintColor: {
          r: 36,
          g: 152,
          b: 141,
          a: 0.9,
        },
        textColor: {
          r: 36,
          g: 152,
          b: 141,
          a: 0.9,
        },
      });
      try {
        await SQIPApplePay.initializeApplePay(APPLE_PAY_MERCHANT_ID);
        digitalWalletEnabled = await SQIPApplePay.canUseApplePay();
      } catch (ex) {
        console.log(ex);
      }
    } else if (Platform.OS === 'android') {
      await SQIPGooglePay.initializeGooglePay(
        GOOGLE_PAY_LOCATION_ID, SQIPGooglePay.EnvironmentTest,
      );
      try {
        digitalWalletEnabled = await SQIPGooglePay.canUseGooglePay();
      } catch (ex) {
        console.log(ex);
      }
    }

    this.setState({
      canUseDigitalWallet: digitalWalletEnabled,
    });
  }

  async onApplePayRequestNonceSuccess(cardDetails) {
    if (this.chargeServerHostIsSet()) {
      try {
        await chargeCardNonce(cardDetails.nonce);
        await SQIPApplePay.completeApplePayAuthorization(true);
        this.setState({ applePayState: applePayStatus.succeeded });
      } catch (error) {
        await SQIPApplePay.completeApplePayAuthorization(false, error.message);
        this.setState({ applePayError: error.message });
      }
    } else {
      await SQIPApplePay.completeApplePayAuthorization(true);
      this.setState({ applePayState: applePayStatus.nonceNotCharged });
      printCurlCommand(cardDetails.nonce);
    }
  }

  async onApplePayRequestNonceFailure(errorInfo) {
    await SQIPApplePay.completeApplePayAuthorization(false, errorInfo.message);
    showAlert('Error processing Apple Pay payment', errorInfo.message);
  }

  async onApplePayComplete() {
    if (this.state.applePayState === applePayStatus.succeeded) {
      showAlert('Your order was successful',
        'Go to your Square dashbord to see this order reflected in the sales tab.');
    } else if (this.state.applePayState === applePayStatus.nonceNotCharged) {
      showAlert(
        'Nonce generated but not charged',
        'Check your console for a CURL command to charge the nonce, or replace CHARGE_SERVER_HOST with your server host.',
      );
    } else if (this.state.applePayError != null) {
      showAlert('Error processing Apple Pay payment', this.state.applePayError);
    } else { // the state is none, so they canceled
      this.showOrderScreen();
    }
  }

  async onGooglePayRequestNonceSuccess(cardDetails) {
    if (this.chargeServerHostIsSet()) {
      try {
        await chargeCardNonce(cardDetails.nonce);
        showAlert('Your order was successful',
          'Go to your Square dashbord to see this order reflected in the sales tab.');
      } catch (error) {
        showAlert('Error processing GooglePay payment', error.message);
      }
    } else {
      printCurlCommand(cardDetails.nonce);
      showAlert(
        'Nonce generated but not charged',
        'Check your console for a CURL command to charge the nonce, or replace CHARGE_SERVER_HOST with your server host.',
      );
    }
  }

  onGooglePayRequestNonceFailure(errorInfo) {
    showAlert('Could not create GooglePay nonce', errorInfo);
  }

  onGooglePayCanceled() {
    this.showOrderScreen();
  }

  async onCardNonceRequestSuccess(cardDetails) {
    if (this.chargeServerHostIsSet()) {
      try {
        await chargeCardNonce(cardDetails.nonce);
        SQIPCardEntry.completeCardEntry(() => {
          showAlert('Your order was successful',
            'Go to your Square dashbord to see this order reflected in the sales tab.');
        });
      } catch (error) {
        SQIPCardEntry.showCardNonceProcessingError(error.message);
      }
    } else {
      SQIPCardEntry.completeCardEntry(() => {
        printCurlCommand(cardDetails.nonce);
        showAlert(
          'Nonce generated but not charged',
          'Check your console for a CURL command to charge the nonce, or replace CHARGE_SERVER_HOST with your server host.',
        );
      });
    }
  }

  onCardEntryCancel() {
    this.showOrderScreen();
  }

  onShowDigitalWallet() {
    this.closeOrderScreen();
    this.setState({ showingDigitalWallet: true });
  }

  onShowCardEntry() {
    this.closeOrderScreen();
    this.setState({ showingCardEntry: true });
  }

  showOrderScreen() {
    this.setState({ showingBottomSheet: true });
  }

  closeOrderScreen() {
    this.setState({ showingBottomSheet: false });
  }

  applicationIdIsSet() { return SQUARE_APP_ID !== 'REPLACE_ME'; }

  chargeServerHostIsSet() { return CHARGE_SERVER_HOST !== 'REPLACE_ME'; }

  googlePayLocationIsSet() { return GOOGLE_PAY_LOCATION_ID !== 'REPLACE_ME'; }

  applePayMerchantIsSet() { return APPLE_PAY_MERCHANT_ID !== 'REPLACE_ME'; }

  checkStateAndPerform() {
    if (this.state.showingCardEntry) {
      // if application id is not set, we will let you know where to set it,
      // but the card entry will still open due to allowing visuals to be shown
      if (!this.applicationIdIsSet()) {
        showAlert('Missing Square Application ID',
          'To request a nonce, replace SQUARE_APP_ID in Constants.js with an Square Application ID.',
          this.startCardEntry);
      } else {
        this.startCardEntry();
      }
    } else if (this.state.showingDigitalWallet) {
      this.startDigitalWallet();
      this.setState({ showingDigitalWallet: false });
    }
  }

  async startCardEntry() {
    this.setState({ showingCardEntry: false });
    const cardEntryConfig = {
      collectPostalCode: true,
    };
    await SQIPCardEntry.startCardEntryFlow(
      cardEntryConfig,
      this.onCardNonceRequestSuccess,
      this.onCardEntryCancel,
    );
  }

  async startDigitalWallet() {
    if (Platform.OS === 'ios' && this.state.canUseDigitalWallet) {
      if (!this.applePayMerchantIsSet()) {
        showAlert('Missing Apple Merchant ID',
          'To request an Apple Pay nonce, replace APPLE_PAY_MERCHANT_ID'
          + ' in Constants.js with an Apple Merchant ID.');
      } else {
        await SQIPApplePay.requestApplePayNonce(
          {
            price: '1.00',
            summaryLabel: 'Test Item',
            countryCode: 'US',
            currencyCode: 'USD',
          },
          this.onApplePayRequestNonceSuccess,
          this.onApplePayRequestNonceFailure,
          this.onApplePayComplete,
        );
      }
    } else if (Platform.OS === 'android') {
      if (!this.googlePayLocationIsSet()) {
        showAlert('Missing GooglePay Location ID',
          'To request a GooglePay nonce, replace GOOGLE_PAY_LOCATION_ID'
          + ' in Constants.js with an Square Location ID.');
      } else {
        await SQIPGooglePay.requestGooglePayNonce(
          {
            price: '1.00',
            currencyCode: 'USD',
            priceStatus: SQIPGooglePay.TotalPriceStatusFinal,
          },
          this.onGooglePayRequestNonceSuccess,
          this.onGooglePayRequestNonceFailure,
          this.onGooglePayCanceled,
        );
      }
    }
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

          <Text style={styles.title}>Donor Information</Text>
{/*          <RkTextInput rkType='rounded' placeholder='First Name' onChangeText={(firstName) => {this.firstName = firstName }}/>
          <RkTextInput rkType='rounded' placeholder='Last Name' onChangeText={(lastName) => {this.lastName = lastName }}/> */}
          <RkTextInput rkType='rounded' placeholder='Mobile Phone Number' onChangeText={(phoneNumber) => {this.phoneNumber = phoneNumber }}/>
          <RkTextInput rkType='rounded' placeholder='Occupation*' onChangeText={(occupation) => {this.occupation = occupation }}/>
          <RkTextInput rkType='rounded' placeholder='Employer*' onChangeText={(employer) => {this.employer = employer }}/>
          {/* Make this asterisk a link to the relevant law for people to see / inspect. */}
          <Text style={styles.description}>*Campaign finance laws require occupation & employer.</Text>
          <GradientButton
            rkType='medium'
            text='Donate'
            style={{marginVertical:9}}
            onPress={this.showOrderScreen}/>
        </View>

        <Modal
          isVisible={this.state.showingBottomSheet}
          style={styles.bottomModal}
          onBackdropPress={this.closeOrderScreen}
          // set timeout due to iOS needing to make sure modal is closed
          // before presenting another view
          onModalHide={() => setTimeout(() => this.checkStateAndPerform(), 200)}
        >
          <View style={styles.modalContent}>
            <OrderModal
              onCloseOrderScreen={this.closeOrderScreen}
              onShowCardEntry={this.onShowCardEntry}
              onShowDigitalWallet={this.onShowDigitalWallet}
            />
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: '#78CCC5',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '6%',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    textAlign: 'center',
  },
  description: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
  },
  modalContent: {
    alignItems: 'flex-start',
    backgroundColor: 'white',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flex: 0,
    flexShrink: 1,
    justifyContent: 'flex-start',
  },
});
