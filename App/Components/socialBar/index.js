import React from 'react';
import { View, Linking } from 'react-native';
import {
  RkText,
  RkButton,
  RkComponent,
} from 'react-native-ui-kitten';
import { FontAwesome } from '../../Assets/icons';

import {
  shareOnTwitter,
} from 'react-native-social-share';

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
    label: `Agatha Bacelar - 2020 Campaign`,
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

export class SocialBar extends RkComponent {
  componentName = 'SocialBar';
  typeMapping = {
    container: {},
    section: {},
    icon: {},
    label: {},
  };
  static data = {
    likes: 18,
    comments: 26,
    shares: 5,
  };

  constructor(props) {
    super(props);
    this.state = {
      likes: this.props.likes || SocialBar.data.likes,
      comments: this.props.comments || SocialBar.data.comments,
      shares: this.props.shares || SocialBar.data.shares,
    };
  }

  onLikeButtonPressed = () => {
    const defaultCount = SocialBar.data.likes;
    this.setState({
      likes: this.state.likes === defaultCount ? this.state.likes + 1 : defaultCount,
    });
  };

  onCommentButtonPressed = () => {
    const defaultCount = SocialBar.data.comments;
    // this.setState({
    //   comments: this.state.comments === defaultCount ? this.state.comments + 1 : defaultCount,
    // });
    this.props.navigation.navigate('Comments')
  };

  onShareButtonPressed = () => {
    const defaultCount = SocialBar.data.shares;
    this.setState({
      shares: this.state.shares === defaultCount ? this.state.shares + 1 : defaultCount,
    });
    shareOnTwitter({
        'text':'Agatha Campaign Information',
        'link':'https://google.com/',
      },
      (results) => {
        console.log(results);
      }
    );
  };

  render() {
    const {
      container, section, icon, label,
    } = this.defineStyles();

    const likes = this.state.likes + (this.props.showLabel ? ' Likes' : '');
    const comments = this.state.comments + (this.props.showLabel ? ' Comments' : '');
    const shares = this.state.shares + (this.props.showLabel ? ' Shares' : '');

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
        <View style={section}>
          <RkButton rkType='clear' onPress={this.onLikeButtonPressed}>
            <RkText rkType='awesome primary' style={icon}>{FontAwesome.heart}</RkText>
            <RkText rkType='primary4 hintColor' style={label}>{likes}</RkText>
          </RkButton>
        </View>
        <View style={section}>
          <RkButton rkType='clear' onPress={this.onCommentButtonPressed}>
            <RkText rkType='awesome hintColor' style={icon}>{FontAwesome.comment}</RkText>
            <RkText rkType='primary4 hintColor' style={label}>{comments}</RkText>
          </RkButton>
        </View>
        <View style={section}>
          <RkButton rkType='clear' onPress={this.onShareButtonPressed}>
            <RkText rkType='awesome info' style={icon}>{FontAwesome.twitter}</RkText>
            <RkText rkType='primary4 hintColor' style={label}>{shares}</RkText>
          </RkButton>
        </View>
      </View>
    );
  }
}
