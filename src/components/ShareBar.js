import React, { Component } from "react";
import {
  Card,
  CardItem,
} from "native-base";
import {
  TwitterShareButton,
  TwitterIcon,
  EmailShareButton,
  EmailIcon,
  FacebookShareButton,
  FacebookIcon,
} from 'react-share';
import './ShareBar.css'
import {
  Amplitude,
} from "@amplitude/react-amplitude";
const { firebaseInstance } = require('../utils/firebaseWrapper.js')


class ShareBar extends Component {
  render() {
    let content = {
      url:'https://www.app.referenda.io',
      twitterTitle:'Article on Referenda',
      facebookQuote:'Content from Referenda',
      emailSubject:'Referenda Articles',
      emailBody:''
    }
    let id = undefined
    try {
      if (this.props.content) {
        content = this.props.content
        id = this.props.content.id
      }
    } catch (suppressedError) {}

    const iconSize = 64
    return (
      <Amplitude eventProperties={{campaign: this.props.campaignName, postId: id, userId: firebaseInstance.getUserId()}}>
        {({ logEvent }) =>
          <Card id='shareCard' style={{
            borderLeftWidth:0, borderRightWidth:0, borderTopWidth:0, borderBottomWidth: 0,
            backgroundColor:'transparent', flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <CardItem style={{backgroundColor:'transparent'}} >
              <TwitterShareButton
                onPress={() => logEvent('Twitter share button pressed')}
                url={content.url}
                title={content.twitterTitle}>
                <TwitterIcon size={iconSize} round />
              </TwitterShareButton>
            </CardItem>
            <CardItem style={{backgroundColor:'transparent'}}>
              <FacebookShareButton
                onPress={() => logEvent('Facebook share button pressed')}
                url={content.url}
                quote={content.facebookQuote}>
                <FacebookIcon size={iconSize} round />
              </FacebookShareButton>
            </CardItem>
            <CardItem style={{backgroundColor:'transparent'}}>
              <EmailShareButton
                onPress={() => logEvent('Email share button pressed')}
                url={content.url}
                subject={content.emailSubject}
                body={content.emailBody}>
                <EmailIcon size={iconSize} round />
              </EmailShareButton>
            </CardItem>
          </Card>
        }
      </Amplitude>
    )
  }
}

export default ShareBar;
