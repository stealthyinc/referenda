import React, { Component } from 'react'
import 'react-phone-number-input/style.css'
import 'react-responsive-ui/style.css'
import PhoneInput from 'react-phone-number-input/react-responsive-ui'
import {
  Card,
  CardItem,
  H2,
  Button,
  Text
} from "native-base";

export default class PhoneNumber extends Component {
  state = {
    value: ''
  }
  render() {
    return (
      <Card style={{marginBottom: 15}}>
        <CardItem header>
          <H2>Text Campaign Donation Link</H2>
        </CardItem>
        <CardItem bordered>
          <PhoneInput
            country="US"
            placeholder="Enter phone number"
            value={ this.state.phone }
            onChange={ phone => this.setState({ phone }) } />
        </CardItem>
        <CardItem>
          <Button success block style={{ margin: 15 }}>
            <Text>Submit</Text>
          </Button>
        </CardItem>
      </Card>
    )
  }
}