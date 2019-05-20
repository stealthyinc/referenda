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
  TwitterShareButton,
  FacebookShareButton,
} from 'react-share';

const SocialBar = ({ chatFunction, socialFunction, bitcoinFunction, paymentFunction, likeFunction }) => (
  <CardItem bordered>
    <Left>
      <Button small rounded info onPress={chatFunction}>
        <Icon name='chatbubbles' />
      </Button>
    </Left>
    <Left>
      <Button small rounded warning onPress={bitcoinFunction}>
        <Icon name='logo-bitcoin' />
      </Button>
    </Left>
    {/*<Left>
      <Button small rounded info onPress={socialFunction}>
        <TwitterShareButton 
          url="https://www.referenda.io" 
          title="test"
          onPress={socialFunction}>
          <Icon name='logo-twitter' />
        </TwitterShareButton>
      </Button>
    </Left>*/}
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