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
  Alert,
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  Dimensions,
  ActivityIndicator,
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
  SQIPGooglePay,
} from 'react-native-square-in-app-payments';

import DonationActions, { DonationSelectors } from '../Redux/DonationRedux'

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

import EngineActions, { EngineSelectors } from '../Redux/EngineRedux'
import {EngineCommand} from '../Engine/commands/engineCommand'

const applePayStatus = {
  none: 0,
  succeeded: 1,
  nonceNotCharged: 2,
};
import candidate from '../Assets/avatars/agatha2.png'

class ChargeScreen extends Component {
  static navigationOptions = {
    title: 'Campaign Donation'.toUpperCase(),
  };

  constructor() {
    super();
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
    this.startDigitalWallet = this.startDigitalWallet.bind(this);
    this.closeOrderScreen = this.closeOrderScreen.bind(this);

    this.state = {
      showingBottomSheet: false,
      showingCardEntry: false,
      showingDigitalWallet: false,
      canUseDigitalWallet: false,
      applePayState: applePayStatus.none,
      applePayError: null,
      waitOnPayNowOperation: false,
      waitOnPayLaterOperation: false,
      waitingOnCommand: '',
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.waitOnPayLaterOperation) {
      if (nextProps.hasOwnProperty('invoiceSuccess') &&
          nextProps.invoiceSuccess !== null) {

        const engCmd =
          EngineCommand.textDonationCommand(this.props.donationRecord)
        this.props.engineCommandExec(engCmd)

        // Reset the state for invoicing and begin waiting for the command we
        // just launched to complete ...
        this.setState({
          waitOnPayLaterOperation: false,
          waitingOnCommand: engCmd.getCommandType()
        })
      }
      //
      // Needs to check for invoiceFetching false and invoiceSuccess null, but
      // that will may be problematic. Move the underlying code to engine so we
      // can handle errors and deal with process & state more accurately. TODO
    } else if (this.state.waitOnPayNowOperation) {
      // PBJ: this is not tested -- need you to test
      if (nextProps.hasOwnProperty('donationSuccess') &&
          nextProps.donationSuccess !== null) {

        const engCmd =
          EngineCommand.creditCardDonationCommand(this.props.donationRecord, nextProps.donationSuccess)
        this.props.engineCommandExec(engCmd)
        // Reset the state for invoicing and begin waiting for the command we
        // just launched to complete ...
        this.setState({
          waitOnPayNowOperation: false,
          waitingOnCommand: engCmd.getCommandType()
        })
      }
    } else if (this.state.waitingOnCommand &&
               nextProps.hasOwnProperty('payLoad') &&
               nextProps.payLoad.hasOwnProperty('commandType') &&
               (nextProps.payLoad.commandType === this.state.waitingOnCommand)) {
      console.log(`ChargeScreen - ${nextProps.payLoad.commandType} completed.`)
      if (nextProps.donationSuccess.errorMessage) {
        Alert.alert(
          'Credit Card Error',
          nextProps.donationSuccess.errorMessage,
          [
            {
              text: 'Close',
              onPress: () => this.setState({ 
                waitOnPayNowOperation: false,
                waitingOnCommand: ''
              }),
              style: 'cancel',
            },
          ],
        )
      }
      else {
        this.props.navigation.navigate('Donation Complete')
      }
    }
  }

  async componentDidMount() {
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
        console.log("digitalWalletEnabled", digitalWalletEnabled)
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
        this.onPayNowPressed(cardDetails.nonce)
        // this.props.chargeSquareRequest()
        // showAlert(
        //   'Nonce generated but not charged',
        //   'Check your console for a CURL command to charge the nonce, or replace CHARGE_SERVER_HOST with your server host.',
        // );
      });
    }
  }

  onCardEntryCancel() {
    // this.showOrderScreen();
  }

  onShowDigitalWallet() {
    // this.closeOrderScreen();
    this.setState({ showingDigitalWallet: true });
  }

  onShowCardEntry() {
    // this.closeOrderScreen();
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

  // TODO: PBJ call this from whereever the CC transaction starts to wait for a
  // response
  onPayNowPressed = (nonce) => {
    this.setState({waitOnPayNowOperation: true})
    // TODO: PBJ call whatever starts the CC transaction here ...
    console.log("GOING TO SAGAS WITH NONCE", nonce)
    this.props.chargeSquareRequest(nonce)
  }

  onPayLaterPressed = () => {
    this.setState({waitOnPayLaterOperation: true})
    this.props.invoiceSquareRequest()
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

    // Construct string info from props
    //
    const {
      donationError,
      donationRecord,
      donationSuccess,
      donationFetching,
    } = this.props

    let under200Exception = false
    try {
      const amount = parseFloat(donationRecord.amount)
      // under200Exception = (amount < 200.00)
    } catch (suppressedError) {
      // Sigh ...
    }

    //ACTODO: here's the info to send to firebase and throw up a spinner
    console.log("donationError", donationError)
    console.log("donationSuccess", donationSuccess)
    console.log("donationFetching", donationFetching)
    const nameStr = `Name: ${donationRecord.firstName} ${donationRecord.lastName}`
    const phoneStr = `Mobile Phone: ${donationRecord.phoneNumber}`
    const occupationStr = `Occupation: ${donationRecord.occupation}`
    const employerStr = `Employer: ${donationRecord.employer}`
    const amountStr = `Amount: ${donationRecord.amount}`

    const occupation = (under200Exception) ?
      undefined: ( <Text style={styles.summary}>{occupationStr}</Text> )
    const employer = (under200Exception) ?
      undefined : ( <Text style={styles.summary}>{employerStr}</Text> )

    const {
      waitOnPayLaterOperation,
      waitOnPayNowOperation,
      waitingOnCommand
    } = this.state

    const ai = (waitOnPayLaterOperation ||
                waitOnPayNowOperation ||
                waitingOnCommand) ?
      ( <View>
          <ActivityIndicator size='large' color='#FFFFFF'/>
          <Text style={[styles.summary, {marginBottom: 9}]}>Processing donation ...</Text>
        </View> ) :
      undefined

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

          {ai}
          <Text style={styles.title}>Donation Summary</Text>
          <Text style={styles.summary}>{nameStr}</Text>
          <Text style={styles.summary}>{phoneStr}</Text>
          {occupation}
          {employer}
          <Text style={styles.summary}>{amountStr}</Text>
          <GradientButton
            rkType='medium'
            text='Pay Now (Credit Card)'
            style={{marginVertical:9}}
            onPress={this.startCardEntry}/>
          {/*<GradientButton
            rkType='medium'
            text={(Platform.OS === 'ios') ? 'Apple Pay' : 'Google Pay'}
            style={{marginVertical:9}}
            onPress={this.startDigitalWallet}/>*/}
          <GradientButton
            rkType='medium'
            text='Pay Later (Text a Link)'
            style={{marginVertical:9}}
            onPress={this.onPayLaterPressed}/>
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
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  summary: {
    color: '#FFFFFF',
    fontSize: 20,
    textAlign: 'left',
    width: '100%',
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

// donation flow is CC
// invoice flow is pay later (text a link)


const mapStateToProps = (state) => {
  return {
    donationError: DonationSelectors.getDonationError(state),
    donationSuccess: DonationSelectors.getDonationSuccess(state),
    donationFetching: DonationSelectors.getDonationFetching(state),
    donationRecord: DonationSelectors.getDonationRecord(state),
    invoiceError: DonationSelectors.getInvoiceError(state),
    invoiceSuccess: DonationSelectors.getInvoiceSuccess(state),
    invoiceFetching: DonationSelectors.getInvoiceFetching(state),
    twilioError: DonationSelectors.getTwilioError(state),
    twilioSuccess: DonationSelectors.getTwilioSuccess(state),
    twilioFetching: DonationSelectors.getTwilioFetching(state),
    payLoad: EngineSelectors.getPayload(state),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    invoiceSquareRequest: () => dispatch(DonationActions.invoiceRequest()),
    chargeSquareRequest: (data) => dispatch(DonationActions.donationRequest(data)),
    engineCommandExec: (aCommand) => dispatch(EngineActions.engineCommandExec(aCommand)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChargeScreen)
