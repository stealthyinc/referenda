import React, { Component } from 'react'
import {
  Image,
  View,
  TouchableOpacity
} from 'react-native'
import { 
  Button,
  Container,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Text,
  Left,
  Right,
  Icon,
  Body 
} from 'native-base'
import ModalContainer from './ModalContainer'
import PhoneNumber from '../components/PhoneNumber'
import ShareBar from '../components/ShareBar'
import SocialBar from '../components/SocialBar'

import { data } from '../data'

const moment = require('moment')

export default class Article extends Component {
  constructor(props) {
    super(props)
    const articleId = this.props.navigation.getParam('id', 1)
    this.data = data.getArticle(articleId)
    this.state = {
      showShareModal: false,
      showPhoneModal: false
    }
  }
  toggleShareModal = () => {
    this.setState({showShareModal: !this.state.showShareModal})
  }
  togglePhoneModal = () => {
    this.setState({showPhoneModal: !this.state.showPhoneModal})
  }
  render = () => (
    <View>
      <ModalContainer 
        component={<ShareBar />}
        showModal={this.state.showShareModal}
        toggleModal={this.toggleShareModal}
        modalHeader='Social Share'
      />
      <ModalContainer 
        component={<PhoneNumber />}
        showModal={this.state.showPhoneModal}
        toggleModal={this.togglePhoneModal}
        modalHeader='Text Campaign Donation Link'
      />
      <Container>
        <Content>
          <Card style={{flex: 0}}>
            <CardItem bordered>
              <Left>
                <TouchableOpacity
                  delayPressIn={70}
                  activeOpacity={0.8}
                   onPress={() => this.props.navigation.navigate('Home')}>
                  <Thumbnail source={this.data.user.photo} />
                </TouchableOpacity>
                <Body>
                  <Text>{this.data.header}</Text>
                  <Text note>{moment().add(this.data.time, 'seconds').fromNow()}</Text>
                </Body>
              </Left>
              <Right>
                <Button 
                  small
                  rounded
                  info
                  onPress={() => this.toggleShareModal()}
                >
                  <Icon name='share-alt' />
                </Button>
              </Right>
            </CardItem>
            <SocialBar 
              paymentFunction={() => this.togglePhoneModal()}
            />
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
    </View>
  )
}