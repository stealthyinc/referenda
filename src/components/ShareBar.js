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
    const iconSize = 64
    return (
      <Card id='shareCard' style={{borderStyle:'none', backgroundColor:'transparent', flexDirection: 'row', justifyContent: 'space-evenly'}}>
        <CardItem style={{backgroundColor:'transparent'}} >
          <TwitterShareButton url="https://www.referenda.io">
            <TwitterIcon size={iconSize} round />
          </TwitterShareButton>
        </CardItem>
        <CardItem style={{backgroundColor:'transparent'}}>
          <FacebookShareButton url="https://www.referenda.io">
            <FacebookIcon size={iconSize} round />
          </FacebookShareButton>
        </CardItem>
        <CardItem style={{backgroundColor:'transparent'}}>
          <EmailShareButton url="https://www.referenda.io">
            <EmailIcon size={iconSize} round />
          </EmailShareButton>
        </CardItem>
      </Card>
    )
  }
}

export default ShareBar;
