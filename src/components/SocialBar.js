import React from 'react'
import {
  Linking,
} from 'react-native';
import {
  CardItem,
  Button,
  Icon,
  Left,
  Right
} from 'native-base'

const SocialBar = ({ chatFunction, socialFunction, bitcoinFunction, paymentFunction, likeFunction }) => (
  <CardItem bordered>
    <Left>
      <Button small rounded light onPress={chatFunction}>
        <Icon name='chatbubbles' />
      </Button>
    </Left>
    <Left>
      <Button 
        small
        rounded
        warning
        onPress={() => Linking.openURL('https://commerce.coinbase.com/checkout/fffca773-3645-4d23-a442-b97ec395d365')}
      >
        <Icon name='logo-bitcoin' />
      </Button>
    </Left>
    <Right>
      <Button small rounded success onPress={paymentFunction}>
        <Icon name='cash' />
      </Button>
    </Right>
    <Right>
      <Button small rounded danger onPress={likeFunction}>
        <Icon name='heart' />
      </Button>
    </Right>
  </CardItem>
)

export default SocialBar