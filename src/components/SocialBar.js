import React from 'react'
import {
  View,
  Linking
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

const SocialBar = ({ chatFunction, paymentFunction, likeFunction, likeCount, id, origin, campaignName, webview, shareFunction }) => {
  const likeText = (likeCount == '1') ? `${likeCount} Like` : `${likeCount} Likes`

  return (
    <Amplitude eventProperties={{campaign: campaignName, postId: id, origin, userId: firebaseInstance.getUserId()}}>
      {({ logEvent }) =>
        <CardItem bordered style={{paddingTop:10, paddingBottom:10, paddingRight:10, paddingLeft:10}}>
          <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', flex:1}}>

{ /* TODO: push the bitcoin functionality into the donation page */ }
{/*
            {(!webview) ? (<a href='https://checkout.opennode.co/p/55769f7d-ebcd-4543-8bbc-bedbe8c9dbe0' style={{textDecoration: 'none'}} target='_blank'>
              <Button bordered style={{borderColor:'lightgray'}} small rounded warning
                onPress={() => {
                logEvent('Bitcoin Button Pressed')}}>
                <Icon name='logo-bitcoin' />
              </Button>
            </a>) : (
              <Button bordered style={{borderColor:'lightgray'}} small rounded warning
                onPress={() => {
                logEvent('Bitcoin Button Pressed')
                Linking.openURL('https://checkout.opennode.co/p/55769f7d-ebcd-4543-8bbc-bedbe8c9dbe0')}}>
                <Icon name='logo-bitcoin' />
              </Button>
            )}

            <View style={{width:5}} />
*/}

            {getSocialButton('chatbubbles', 'Comment', 'blue', () => { logEvent('Message Button Pressed'); chatFunction() })}
            {getSocialButton('cash', 'Donate', 'green', () => { logEvent('Donation Button Pressed'); paymentFunction() })}
            {getSocialButton('heart', likeText, 'red', () => { logEvent('Like Button Pressed'); likeFunction() })}
            { (shareFunction) ?
              getSocialButton('share-alt', 'Share', 'blue', () => { logEvent('Feed share button pressed'); shareFunction() }) : undefined }
          </View>
        </CardItem>
      }
    </Amplitude>
  )
}

const getSocialButton = ( theIconName, theButtonText, theButtonColor='blue', buttonPressFn=()=>{} ) => {
  let info=false
  let success=false
  let warning=false
  let danger=false

  switch (theButtonColor) {
    case 'green':
      success=true
      break;
    case 'yellow':
      warning=true
      break;
    case 'red':
      danger=true
      break;
    default:  // blue
      info=true
  }

  if (theButtonText) {
    return (
      <Button
        style={{borderColor:'lightgray'}}
        bordered small rounded info={info} success={success} warning={warning} danger={danger}
        onPress={buttonPressFn}>
        <Icon style={{marginLeft:10, marginRight:5}} name={theIconName} />
        <Text style={{paddingLeft:0, paddingRight:0, marginRight:10, fontFamily:'arial', fontSize:12}} uppercase={false}>{theButtonText}</Text>
      </Button>
    )
  } else {
    return (
      <Button
        style={{borderColor:'lightgray'}}
        bordered small rounded info={info} success={success} warning={warning} danger={danger}
        onPress={buttonPressFn}>
        <Icon style={{marginLeft:10, marginRight:10}} name={theIconName} />
      </Button>
    )
  }
}

export default SocialBar
