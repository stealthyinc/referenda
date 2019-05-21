import React, { Component } from "react";
import {
  Button,
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

class ShareBar extends Component {
  render() {
    return (
      <Card style={{marginBottom: 15}}>
        <CardItem header bordered>
          <H2>Social Share Applications</H2>
        </CardItem>
        <CardItem>
          <Left>
            <TwitterShareButton 
              style={{flexDirection: 'row'}}
              url="https://www.referenda.io" 
             >
              <TwitterIcon size={32} round={true} />
              <Text>Share on Twitter</Text>
            </TwitterShareButton>
          </Left>
          <Right>
            <Icon name="arrow-forward" />
          </Right>
        </CardItem>
        <CardItem>
          <Left>
            <FacebookShareButton 
              style={{flexDirection: 'row'}}
              url="https://www.referenda.io" 
             >
              <FacebookIcon size={32} round={true} />
              <Text>Share on Facebook</Text>
            </FacebookShareButton>
          </Left>
          <Right>
            <Icon name="arrow-forward" />
          </Right>
        </CardItem>
        <CardItem>
          <Left>
            <RedditShareButton 
              style={{flexDirection: 'row'}}
              url="https://www.referenda.io" 
             >
              <RedditIcon size={32} round={true} />
              <Text>Share on Reddit</Text>
            </RedditShareButton>
          </Left>
          <Right>
            <Icon name="arrow-forward" />
          </Right>
        </CardItem>
        <CardItem>
          <Left>
            <LinkedinShareButton 
              style={{flexDirection: 'row'}}
              url="https://www.referenda.io" 
             >
              <LinkedinIcon size={32} round={true} />
              <Text>Share on LinkedIn</Text>
            </LinkedinShareButton>
          </Left>
          <Right>
            <Icon name="arrow-forward" />
          </Right>
        </CardItem>
        <CardItem>
          <Left>
            <EmailShareButton 
              style={{flexDirection: 'row'}}
              url="https://www.referenda.io" 
             >
              <EmailIcon size={32} round={true} />
              <Text>Share via Mail</Text>
            </EmailShareButton>
          </Left>
          <Right>
            <Icon name="arrow-forward" />
          </Right>
        </CardItem>
      </Card>
    )
  }
}

export default ShareBar;
