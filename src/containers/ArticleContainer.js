import React, { Component } from 'react'
import {
  Image,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView
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

import { isMobile } from "react-device-detect";
import FitImage from 'react-native-fit-image';
import ReactPlayer from 'react-player'
const C = require('../utils/constants.js')

const moment = require('moment')

export default class Article extends Component {

  constructor(props) {
    super(props)
    this.mediaUrlRoot = this.props.mediaUrlRoot
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

  // TODO: when time permits refactor this and renderItem in FeedContainer
  //       into common code within a utils file or item file ....
  //
  renderItem = (item, toggleFn) => {
    if (!item || !toggleFn) {
      return undefined
    }

    let image = undefined
    try {
      if (item.media) {
        const itemUrl = `${this.mediaUrlRoot}/${item.media.fileName}`
        if (item.media.type === C.MEDIA_TYPES.IMAGE) {
          image = ( <FitImage source={{uri: itemUrl}} /> )
        } else if (item.media.type === C.MEDIA_TYPES.VIDEO) {
          image = ( <ReactPlayer width='100%' controls={true} light={false} muted={true} playing={true} url={itemUrl} /> )
        }
      }
    } catch (suppressedError) {
      console.log(`Couldn't render item.\n${suppressedError}`)
    }

    let timeStr = moment(item.time).fromNow()

    let fcData = {
      avatarImg: undefined,
      fcBackgroundImg: undefined,
      nameStr: 'Your Name',
      positionStr: 'Your Position',
      followers: '0'
    }
    if (this.mediaUrlRoot in C.FIRST_CARD_WORKAROUND) {
      fcData = C.FIRST_CARD_WORKAROUND[this.mediaUrlRoot]
    }

    return (
      <ScrollView style={{width:'100%', height:'100%'}}>
        <Card style={{flex: 0, marginLeft:(isMobile? 2 : 0), marginRight:(isMobile ? 2 : 0)}}>
          <CardItem bordered>
            <TouchableOpacity
              delayPressIn={70}
              activeOpacity={0.8}
               onPress={() => toggleFn()}>
              <Thumbnail source={fcData.avatarImg}/>
            </TouchableOpacity>
            <TouchableOpacity
              delayPressIn={70}
              activeOpacity={0.8}
               onPress={() => toggleFn()}>
              <Body style={{marginHorizontal:10}}>
                <Text style={styles.postTitleText}>
                  {item.title}
                </Text>
                <Text style={styles.postTimeText}>{timeStr}</Text>
              </Body>
            </TouchableOpacity>
            <Button
              bordered style={{borderColor:'lightgray'}}
              small
              rounded
              info
              onPress={() => this.toggleShareModal(item.id)}>
              <Icon name='share-alt' />
            </Button>
          </CardItem>

          <CardItem>
            <Body>
              {/* FitImage needs this view or it doesn't understand the width to size the image height to.' */}
              <View style={{width:'100%'}}>
                {image}
              </View>
              <View style={{width:'100%'}}>
                <SocialBar paymentFunction={() => this.togglePhoneModal()} />
              </View>
              <View style={{padding:10, width:'100%'}}>
                <Text style={styles.postBodyText}>
                  {item.description}
                </Text>
              </View>
            </Body>
          </CardItem>
        </Card>
      </ScrollView>
    );
  }

  render = () => {
    let MAX_ZOOM_CARD_DIM = 768
    let zoomStyle = {}
    if (!isMobile) {
      zoomStyle.maxWidth = MAX_ZOOM_CARD_DIM
      zoomStyle.maxHeight = MAX_ZOOM_CARD_DIM
    }
    return (
      <View style={zoomStyle}>
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
        {this.renderItem(this.props.item, this.props.toggleModal)}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  postTitleText: {
    fontFamily:'arial',
    fontSize: (isMobile ? 20 : 27)
  },
  postTimeText: {
    fontFamily:'arial',
    fontSize: (isMobile ? 14 : 21),
    fontStyle: 'italic',
    color:'lightgray'
  },
  postBodyText: {
    fontFamily:'arial',
    fontSize: (isMobile ? 14 : 21),
  },
});
