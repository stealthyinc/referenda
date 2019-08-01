import React from 'react';
import { Dimensions, ImageBackground, StyleSheet, Text, View } from 'react-native';
import Swiper from 'react-native-web-swiper';
import { isMobile } from "react-device-detect";

const C = require('../utils/constants.js')

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slideContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postTitleText: {
    fontFamily:'arial',
    fontSize: (isMobile ? 24 : 32),
    color: 'rgba(255,255,255,0.95)',
    marginTop:20,
    marginBottom:30
  },
  postBodyText: {
    fontFamily:'arial',
    fontSize: (isMobile ? 20 : 24),
    color: 'rgba(255,255,255,0.9)',
  },
});

export default class SwipeView extends React.Component {
  constructor(props) {
    super(props)

    const { width, height } = Dimensions.get('window')
    this.width = width
    this.height = height
  }
  getSlide = (anImage, aTitle, aSubTitle) => {
    let textRibbonOffset = 0
    if (this.width > 3*C.MIN_CARD_WIDTH) {
      textRibbonOffset = (this.width - 3*C.MIN_CARD_WIDTH) / 2
    } else if (this.width > 2*C.MIN_CARD_WIDTH) {
      textRibbonOffset = (this.width - 2*C.MIN_CARD_WIDTH) / 2
    } else if (this.width > C.MIN_CARD_WIDTH) {
      textRibbonOffset = (this.width - C.MIN_CARD_WIDTH) / 2
    }

    const imgBgStyle = {width: '100%', height: '100%', flexDirection: 'row'}
    const textBoxStyle = {width: 400, height: '100%', paddingVertical:25, paddingHorizontal: 35, flexDirection: 'column', backgroundColor:'rgba(0,0,0,0.65)'}

    return (
      <View style={[styles.slideContainer]}>
        <ImageBackground style={imgBgStyle} source={anImage}>
          <View style={{width:textRibbonOffset}} />
          <View style={textBoxStyle}>
            <Text style={styles.postTitleText}>{aTitle}</Text>
            <Text style={styles.postBodyText}>{aSubTitle}</Text>
          </View>
        </ImageBackground>
      </View>
    )
  }

  render() {
    const { width, height } = Dimensions.get('window')
    this.width = width
    this.height = height

    const textRibbonOffset = (width - 3*C.MIN_CARD_WIDTH) / 2
    const swiperControlOffset = textRibbonOffset + C.MIN_CARD_WIDTH

    return (
      <View style={styles.container}>
        <Swiper
          loop={true}
          autoplayTimeout={5}
          controlsWrapperStyle={{marginLeft:swiperControlOffset, marginRight:10}}
          prevButtonText=''
          nextButtonText='Next >'
          nextButtonStyle={{fontSize:18,fontWeight:'bold'}}>
          {this.getSlide(require('../assets/bad.jpeg'),
                        'Traditional social media is infested with trolls & bots.',
                        'Online discourse is easily manipulated...see US 🇺🇸 Elections, Brexit, fake news, etc...')}
         {this.getSlide(require('../assets/good.jpeg'),
                        'Authentic social communication with real stakeholders.',
                        'Referenda is an authentic private social network for humans in a movement, district, state, or country')}
         {this.getSlide(require('../assets/human.jpeg'),
                        'Humane technology that prioritizes privacy and data security.',
                        'We are focused on providing actual utility to stakeholders and not be at the mercy of Advertisers and Clicks')}
        </Swiper>
      </View>
    );
  }
}
