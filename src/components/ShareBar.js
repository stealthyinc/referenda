import React, { Component } from "react";
import {
  Icon,
  Card,
  CardItem,
  Text,
  H2,
  Left,
  Right,
} from "native-base";
import {
  RedditShareButton,
  RedditIcon,
  TwitterShareButton,
  TwitterIcon,
  LinkedinShareButton,
  LinkedinIcon,
  EmailShareButton,
  EmailIcon,
  FacebookShareButton,
  FacebookIcon,
} from 'react-share';

import './ShareBar.css'

class ShareBar extends Component {
  render() {
    return (
      <Card style={{marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between'}}>
        <CardItem>
          <div className="Demo__some-network">
            <TwitterShareButton
              url="https://www.referenda.io"
              className="Demo__some-network__share-button">
              <TwitterIcon
                size={64}
                round />
            </TwitterShareButton>
          </div>
        </CardItem>
        <CardItem>
          <div className="Demo__some-network">
            <FacebookShareButton
              url="https://www.referenda.io"
              className="Demo__some-network__share-button">
              <FacebookIcon
                size={64}
                round />
            </FacebookShareButton>
          </div>
        </CardItem>
        <CardItem>
          <div className="Demo__some-network">
            <EmailShareButton
              url="https://www.referenda.io"
              className="Demo__some-network__share-button">
              <EmailIcon
                size={64}
                round />
            </EmailShareButton>
          </div>
        </CardItem>
      </Card>
    )
  }
}

export default ShareBar;
