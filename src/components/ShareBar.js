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

class ShareBar extends Component {
  render() {
    let content = {
      url:'https://www.referenda.io',
      twitterTitle:'Article on Referenda',
      facebookQuote:'Content from Referenda',
      emailSubject:'Referenda Articles',
      emailBody:''
    }
    try {
      if (this.props.content) {
        content = this.props.content
      }
    } catch (suppressedError) {}

    const iconSize = 64
    return (
      <Card id='shareCard' style={{
        borderLeftWidth:0, borderRightWidth:0, borderTopWidth:0, borderBottomWidth: 0,
        backgroundColor:'transparent', flexDirection: 'row', justifyContent: 'space-evenly'}}>
        <CardItem style={{backgroundColor:'transparent'}} >
          <TwitterShareButton
            url={content.url}
            title={content.twitterTitle}>
            <TwitterIcon size={iconSize} round />
          </TwitterShareButton>
        </CardItem>
        <CardItem style={{backgroundColor:'transparent'}}>
          <FacebookShareButton
            url={content.url}
            quote={content.facebookQuote}>
            <FacebookIcon size={iconSize} round />
          </FacebookShareButton>
        </CardItem>
        <CardItem style={{backgroundColor:'transparent'}}>
          <EmailShareButton
          url={content.url}
          subject={content.emailSubject}
          body={content.emailBody}>
            <EmailIcon size={iconSize} round />
          </EmailShareButton>
        </CardItem>
      </Card>
    )
  }
}

export default ShareBar;
