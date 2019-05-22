import React from 'react'
import {
  View,
  Linking,
} from 'react-native';
import {
  CardItem,
  Button,
  Icon
} from 'native-base'

const SocialBar = ({ chatFunction, socialFunction, bitcoinFunction, paymentFunction, likeFunction }) => (
  <CardItem bordered>
    <View style={{flexDirection:'row', justifyContent:'space-evenly', alignItems:'center', flex:1}}>
      <Button bordered style={{borderColor:'lightgray'}} small rounded info onPress={chatFunction}>
        <Icon name='chatbubbles' />
      </Button>
      <View style={{width:5}} />
      <Button bordered style={{borderColor:'lightgray'}} small rounded warning
      onPress={() => Linking.openURL('https://commerce.coinbase.com/checkout/fffca773-3645-4d23-a442-b97ec395d365')}>
        <Icon name='logo-bitcoin' />
      </Button>
      <View style={{width:5}} />
      <Button bordered style={{borderColor:'lightgray'}} small rounded success onPress={paymentFunction}>
        <Icon name='cash' />
      </Button>
      <View style={{width:5}} />
      <Button bordered style={{borderColor:'lightgray'}} small rounded danger onPress={likeFunction}>
        <Icon name='heart' />
      </Button>
    </View>
  </CardItem>
)

export default SocialBar
