import React from 'react'
import {
  CardItem,
  Button,
  Icon,
  Left,
  Right,
  Body
} from 'native-base'
import {
  View
} from 'react-native';
import {
  TwitterShareButton,
  FacebookShareButton,
} from 'react-share';

const SocialBar = ({ chatFunction, socialFunction, bitcoinFunction, paymentFunction, likeFunction }) => (
  <CardItem bordered>
    <View style={{flexDirection:'row', justifyContent:'space-evenly', alignItems:'center', flex:1}}>
      <Button small rounded info onPress={chatFunction}>
        <Icon name='chatbubbles' />
      </Button>
      <View style={{width:5}} />
      <Button small rounded warning onPress={bitcoinFunction}>
        <Icon name='logo-bitcoin' />
      </Button>
      <View style={{width:5}} />
    {/* <Button small rounded info onPress={socialFunction}>
        <TwitterShareButton
          url="https://www.referenda.io"
          title="test"
          onPress={socialFunction}>
          <Icon name='logo-twitter' />
        </TwitterShareButton>
      </Button>
      <View style={{width:5}} /> */}
      <Button small rounded success onPress={paymentFunction}>
        <Icon name='cash' />
      </Button>
      <View style={{width:5}} />
      <Button small rounded danger onPress={likeFunction}>
        <Icon name='heart' />
      </Button>
    </View>
  </CardItem>
)

export default SocialBar
