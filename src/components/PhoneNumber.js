import React, { Component } from 'react'
import { View } from 'react-native'
import 'react-phone-number-input/style.css'
import 'react-responsive-ui/style.css'
import PhoneInput from 'react-phone-number-input/react-responsive-ui'
import {
  Card,
  CardItem,
  H1,
  H2,
  Header,
  Button,
  Text,
  Input,
  Left,
  Icon,
  Right,
  Spinner
} from "native-base";
import { isMobile } from "react-device-detect";
const SQUARE_URL = process.env.REACT_APP_SQUARE_URL
const request = require('request-promise')

export default class PhoneNumber extends Component {
  constructor(props) {
    super(props)

    this.state = {
      phoneNumber: '',
      amount: undefined,
      showSpinner: false,
      showToast: false,
      error: ''
    }

    this.props = props
  }


  renderButton = (amount) => {
    return (
      <Button
        onPress={() => this.setState({amount})}
        bordered={!(this.state.amount === amount)}
        success
        style={{
          borderRadius:15, borderColor: 'lightgray', marginLeft: 5, marginBottom: 5}}
      >
        <Text style={{textAlign: 'center', width:'4em', paddingLeft: 5, paddingRight: 5, fontFamily: 'arial',}}>${amount}</Text>
      </Button>
    )
  }


  renderSpinner = () => {
    if (this.state.showSpinner) {
      return <Spinner />
    }
    else {
      return null
    }
  }

  renderHeader = () => {
    if (this.state.error) {
      return (
        <Header centered style={{backgroundColor: '#d9534f'}}>
          <H1 style={{marginTop: 5, color: 'white'}}>Donation Unsuccessful</H1>
        </Header>
      )
    }
    else {
      return null
    }
  }

  renderButtonContent = () => {
    if (isMobile) {
      return (
        <View style={{width: '100%', flexDirection: 'column', justifyContent: 'space-between'}}>
          <CardItem style={{width:'100%', flexDirection: 'row', justifyContent: 'center'}}>
            {this.renderButton(5)}
            {this.renderButton(10)}
            {this.renderButton(25)}
            {this.renderButton(50)}
          </CardItem>
          <CardItem style={{width:'100%', flexDirection: 'row', justifyContent: 'center'}}>
            {this.renderButton(100)}
            {this.renderButton(250)}
            {this.renderButton(500)}
            <Button
              bordered
              success
              style={{borderColor:'lightgray', borderRadius: 15, marginLeft: 5, marginBottom: 5}}
            >
              <Input style={{textAlign: 'center', width:'4em', fontFamily:'arial', fontSize:14}}
                     placeholder="$____" value={this.state.amount}
                     onChangeText={(text) => this.setState({amount: text})}/>
            </Button>
          </CardItem>
        </View>
      )
    }
    else {
      return (
        <CardItem style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          {this.renderButton(5)}
          {this.renderButton(10)}
          {this.renderButton(25)}
          {this.renderButton(50)}
          {this.renderButton(100)}
          {this.renderButton(250)}
          {this.renderButton(500)}
          <Button
            bordered
            success
            style={{borderColor:'lightgray', borderWidth: 5, borderRadius: 15, marginLeft: 5, marginBottom: 5}}
          >
            <Input
              style={{textAlign: 'center', width:'4em', fontFamily:'arial', fontSize:14}}
              placeholder="$Other" value={this.state.amount} onChangeText={(text) => this.setState({amount: text})}/>
          </Button>
        </CardItem>
      )
    }
  }

  render () {
    return (
      <Card style={{marginBottom: 15}}>
        {this.renderHeader()}
        <CardItem header bordered>
          <Left>
            <H2>Text Campaign Donation Link</H2>
          </Left>
          <Right>
            <Button rounded onClick={()=>this.props.toggleModal()} danger style={{marginBottom: 15}}>
              <Icon active name="close" />
            </Button>
          </Right>
        </CardItem>
        {this.renderSpinner()}
        {this.renderButtonContent()}
        <CardItem bordered>
          <PhoneInput
            style={{width: '70vw'}}
            country="US"
            placeholder="Enter phone number"
            value={ this.state.phoneNumber }
            onChange={ phone => this.setState({ phoneNumber: phone }) } />
        </CardItem>
        <CardItem>
          <View style={{flexDirection: 'row', width:'100%', justifyContent:'center'}}>
            <Button
              success
              disabled={(!this.state.amount || !(this.state.phoneNumber && this.state.phoneNumber.length > 11))}
              style={{ borderRadius: 15, margin: 15 }}
              onPress={() => this.sendInformation() }
            >
              <Text
                uppercase={false}
                style={{width:'10em', textAlign: 'center', fontFamily:'arial', fontSize: (isMobile ? 17 : 20)}}>Submit</Text>
            </Button>
          </View>
        </CardItem>
      </Card>
    )
  }


  /* Non-render related / UI related code below here
  /*
  /****************************************************************************/

  getAmountInCentsFromDonation(aDonationStrUSD) {
    //
    // Convert from USD to Cents, discard fractional portion:
    const totalCents = Math.floor(parseFloat(aDonationStrUSD) * 100)
    //
    // Calculate 1% commission, rounded to the nearest cent:
    const feeCents = Math.ceil(totalCents / 100)
    //
    return {
      totalCents: totalCents,
      proceedsCents: (totalCents - feeCents),
      feeCents: feeCents
    }
  }

  sendInformation = async () => {
    this.setState({showSpinner: true})
    let candidateName = ''
    let locationId = ''
    if (this.props.campaignName === 'agatha') {
      candidateName = `Agatha Bacelar's`
      locationId = '0WNJSXGSXWG89'
    }
    else if (this.props.campaignName === 'guaido') {
      candidateName = `Juan Guaido's`
      locationId = 'NVXZ9K1H1K3T5'
    }
    else {
      candidateName = `Default Politician's`
      locationId = 'NVXZ9K1H1K3T5'
    }
    const message = `Thank you for your donation to ${candidateName} Campaign. Here's a helpful link for you to donate. We will notify you when the Referenda App is ready!`
    const campaign_message = `Donation to ${candidateName} Campaign`
    const amounts = this.getAmountInCentsFromDonation(this.state.amount)
    const feeAmount = amounts.feeCents
    const donationAmount = amounts.proceedsCents
    const data = {
      message,
      campaign_message,
      locationId,
      donationAmount,
      feeAmount,
      phoneNumber: this.state.phoneNumber,
      pre_populate_shipping_address: {},
      isMobile: false
    }
    return request(`${SQUARE_URL}/createCheckout`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      form: data,
    })
    .then((response) => {
      this.setState({showSpinner: false})
      this.props.toggleModal()
      return response
    })
    .catch((error) => {
      this.setState({error, showSpinner: false})
      // console.error(error);
    });
  }
}
