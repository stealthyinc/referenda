import React from 'react';
import {
  Image,
} from 'react-native';
import { 
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Text,
  Button,
  Icon,
  Left,
  Right,
  Body 
} from 'native-base';

import { data } from '../data';

const moment = require('moment');

export default class Article extends React.Component {

  constructor(props) {
    super(props);
    const articleId = this.props.navigation.getParam('id', 1);
    this.data = data.getArticle(articleId);
  }

  onAvatarPressed = () => {
    // this.props.navigation.navigate('ProfileV2', { id: this.data.user.id });
  };

  render = () => (
    <Container>
      <Content>
        <Card style={{flex: 0}}>
          <CardItem bordered>
            <Left>
              <Thumbnail source={this.data.user.photo} />
              <Body>
                <Text>{this.data.header}</Text>
                <Text note>{moment().add(this.data.time, 'seconds').fromNow()}</Text>
              </Body>
            </Left>
          </CardItem>
          <CardItem bordered>
            <Left>
              <Button rounded success>
                <Icon name='chatbubbles' />
              </Button>
            </Left>
            <Left>
              <Button rounded info>
                <Icon name='logo-twitter' />
              </Button>
            </Left>
            <Right>
              <Button rounded warning>
                <Icon name='logo-bitcoin' />
              </Button>
            </Right>
            <Right>
              <Button rounded danger>
                <Icon name='heart' />
              </Button>
            </Right>
          </CardItem>
          <CardItem>
            <Body>
              <Image source={this.data.photo} style={{height: '40vh', width: '80vw', flex: 1}}/>
              <Text>
                {this.data.text}
              </Text>
            </Body>
          </CardItem>
        </Card>
      </Content>
    </Container>
  )
}
