import React from 'react';
import { View, Linking } from 'react-native';
import {
  RkText,
  RkButton,
  RkComponent,
} from 'react-native-ui-kitten';
import { FontAwesome } from '../Assets/icons';

const METHOD_DATA = [{
  supportedMethods: ['apple-pay'],
  paymentMethodTokenizationParameters: {
    parameters: {
      gateway: 'stripe',
      'stripe:publishableKey': 'pk_live_b5U1B98qKhvPrr2DqxF7SYEZ',
      'stripe:version': '5.0.0' // Only required on Android
    }
  },
  data: {
    merchantIdentifier: 'merchant.stealthy.inc',
    supportedNetworks: ['visa', 'mastercard', 'amex'],
    countryCode: 'US',
    currencyCode: 'USD'
  }
}];

const DETAILS = {
  id: 'basic-example',
  displayItems: [
    {
      label: 'Campaign Donation',
      amount: { currency: 'USD', value: '1.00' }
    }
  ],
  shippingOptions: [{
    id: 'standard',
    label: 'Accounting Address',
    amount: { currency: 'USD', value: '0.00' },
    detail: 'Required for campaign finance accounting' // `detail` is specific to React Native Payments
  }],
  total: {
    label: `Ammar Campa-Najjar - 2020 Campaign`,
    amount: { currency: 'USD', value: '1.00' }
  }
};

const OPTIONS = {
  requestShipping: true,
  requestPayerName: true,
  requestPayerPhone: true,
  requestPayerEmail: true,
};

// global.PaymentRequest = require('react-native-payments').PaymentRequest
const PaymentRequest = require('react-native-payments').PaymentRequest
// import { PaymentRequest } from 'react-native-payments'
const paymentRequest = new PaymentRequest(METHOD_DATA, DETAILS, OPTIONS);

export default class DonationBar extends RkComponent {
  componentName = 'DonationBar';
  typeMapping = {
    container: {},
    section: {},
    icon: {},
    label: {},
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      container, section, icon, label,
    } = this.defineStyles();
    return (
      <View style={container}>
        <View style={section}>
          <RkButton
            rkType='clear'
            onPress={() => paymentRequest.show()}
          >
            <RkText rkType='awesome success' style={icon}>{FontAwesome.card}</RkText>
          </RkButton>
        </View>
        <View style={section}>
          <RkButton
            rkType='clear'
            onPress={() => Linking.openURL('https://commerce.coinbase.com/checkout/fffca773-3645-4d23-a442-b97ec395d365')}
          >
            <RkText rkType='awesome warning' style={icon}>{FontAwesome.bitcoin}</RkText>
          </RkButton>
        </View>
      </View>
    );
  }
}
