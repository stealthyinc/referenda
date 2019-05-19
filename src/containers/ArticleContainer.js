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
          <CardItem>
            <Left>
              <Thumbnail source={this.data.user.photo} />
              <Body>
                <Text>{this.data.header}</Text>
                <Text note>{moment().add(this.data.time, 'seconds').fromNow()}</Text>
              </Body>
            </Left>
          </CardItem>
          <CardItem>
            <Button iconLeft transparent light>
              <Icon name='arrow-back' />
              <Text>Back</Text>
            </Button>
            <Button iconRight transparent light>
              <Text>Next</Text>
              <Icon name='arrow-forward' />
            </Button>
          </CardItem>
          <CardItem>
            <Body>
              <Image source={this.data.photo} style={{height: 300, width: 580, flex: 1}}/>
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
