import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from 'react-native'
import {
  Button,
  Card,
  CardItem,
  Thumbnail,
  Text,
  Icon,
  Body
} from 'native-base'
import ModalContainer from './ModalContainer'
import PhoneNumber from '../components/PhoneNumber'
import ShareBar from '../components/ShareBar'
import SocialBar from '../components/SocialBar'
import AppSignUp from '../components/AppSignUp'

import Feed from './FeedContainer'
import { isMobile } from "react-device-detect";
import FitImage from 'react-native-fit-image';
import ReactPlayer from 'react-player'
import Hyperlink from 'react-native-hyperlink'
const C = require('../utils/constants.js')

const moment = require('moment')

export default class Article extends Component {

  constructor(props) {
    super(props)

    this.shareModalContent = undefined

    this.state = {
      showShareModal: false,
      showPhoneModal: false,
      showMessageModal: false,
    }
  }

  toggleShareModal = (aPost=undefined) => {
    if (aPost) {
      // The 2nd variant of this conditional isn't done yet, but will be when we
      // release publically.
      const url = (this.props.campaignName) ?
        `https://www.referenda.io/${this.props.campaignName}/${aPost.id}` :
        `${this.props.mediaUrlRoot}/${aPost.id}`

      this.shareModelContent = {
          url:url,
          twitterTitle: aPost.title,
          facebookQuote: aPost.title,
          emailSubject: aPost.title,
          emailBody: Feed.getTruncatedStr(aPost.description, 255)
        }
    } else {
      this.shareModelContent = undefined
    }

    this.setState({showShareModal: !this.state.showShareModal})
  }

  togglePhoneModal = () => {
    this.setState({showPhoneModal: !this.state.showPhoneModal})
  }

  toggleMessageModal = () => {
    this.setState({showMessageModal: !this.state.showMessageModal})
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
        const itemUrl = `${this.props.mediaUrlRoot}/${item.media.fileName}`
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
    if (this.props.mediaUrlRoot in C.FIRST_CARD_WORKAROUND) {
      fcData = C.FIRST_CARD_WORKAROUND[this.props.mediaUrlRoot]
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
            <Body style={{marginHorizontal:10}}>
              <TouchableOpacity
                delayPressIn={70}
                activeOpacity={0.8}
                 onPress={() => toggleFn()}>
                <Text style={styles.postTitleText}>
                  {item.title}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                delayPressIn={70}
                activeOpacity={0.8}
                 onPress={() => toggleFn()}>
                <Text style={styles.postTimeText}>{timeStr}</Text>
              </TouchableOpacity>
            </Body>

            <Button
              bordered style={{borderColor:'lightgray'}}
              small
              rounded
              info
              onPress={() => this.toggleShareModal(item)}>
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
                <SocialBar
                  chatFunction={() => this.toggleMessageModal()}
                  paymentFunction={() => this.togglePhoneModal()}
                  likeFunction={() => this.props.handlePostLike(item.id)}
                  likeCount={item.likes}
                />
              </View>
              <View style={{padding:10, width:'100%'}}>
                <Hyperlink linkDefault={true} linkStyle={{color: '#2980b9', textDecorationLine:'underline' }}>
                  <Text style={styles.postBodyText}>
                    {item.description}
                  </Text>
                </Hyperlink>
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
    } else {
      zoomStyle.maxWidth = '90vw'
      zoomStyle.maxHeight = '80vh'
    }
    return (
      <View style={zoomStyle}>
        <ModalContainer
          component={<ShareBar content={this.shareModelContent}/>}
          showModal={this.state.showShareModal}
          toggleModal={this.toggleShareModal}
          modalHeader='Social Share'
        />
        <ModalContainer
          component={<PhoneNumber campaignName={this.props.campaignName} toggleModal={this.togglePhoneModal} />}
          showModal={this.state.showPhoneModal}
          toggleModal={this.togglePhoneModal}
          modalHeader='Text Campaign Donation Link'
        />
        <ModalContainer
          component={<AppSignUp toggleModal={this.toggleMessageModal}/>}
          showModal={this.state.showMessageModal}
          toggleModal={this.toggleMessageModal}
          modalHeader='App Sign Up'
        />
        {this.renderItem(this.props.item, this.props.toggleModal)}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  postTitleText: {
    flex: 1,
    flexWrap: 'wrap',
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
