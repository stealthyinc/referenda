import React from 'react'
import {
  View,
  Linking,
} from 'react-native';
import {
  CardItem,
  Button,
  Icon,
  Text
} from 'native-base'
import {
  Amplitude,
} from "@amplitude/react-amplitude";
const { firebaseInstance } = require('../utils/firebaseWrapper.js')

const SocialBar = ({ chatFunction, paymentFunction, likeFunction, likeCount, id, origin, campaignName }) => (
  <Amplitude eventProperties={{campaign: campaignName, postId: id, origin, userId: firebaseInstance.getUserId()}}>
    {({ logEvent }) =>
      <CardItem bordered>
        <View style={{flexDirection:'row', justifyContent:'space-evenly', alignItems:'center', flex:1}}>
          <Button bordered style={{borderColor:'lightgray'}} small rounded info onPress={() => {
            logEvent('Message Button Pressed')
            chatFunction()}}>
            <Icon name='chatbubbles' />
          </Button>
          <View style={{width:5}} />
          <Button bordered style={{borderColor:'lightgray'}} small rounded warning
          onPress={() => {
            logEvent('Bitcoin Button Pressed')
            Linking.openURL('https://commerce.coinbase.com/checkout/fffca773-3645-4d23-a442-b97ec395d365')}}>
            <Icon name='logo-bitcoin' />
          </Button>
          <View style={{width:5}} />
          <Button bordered style={{borderColor:'lightgray'}} small rounded success onPress={() => {
            logEvent('Donation Button Pressed')
            paymentFunction()}}>
            <Icon name='cash' />
          </Button>
          <View style={{width:5}} />
          <Button iconLeft bordered style={{borderColor:'lightgray'}} small rounded danger onPress={() => {
            logEvent('Like Button Pressed')
            likeFunction()}}>
            <Icon name='heart' />
            <Text style={{fontFamily:'arial', fontSize:14, paddingLeft:5}}>{likeCount}</Text>
          </Button>
        </View>
      </CardItem>
    }
  </Amplitude>
)

export default SocialBar
