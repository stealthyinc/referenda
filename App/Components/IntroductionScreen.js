import React, { Component } from 'react'
import {
  Animated,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View
} from 'react-native'

import {
  RkButton,
  RkText,
  RkStyleSheet,
} from 'react-native-ui-kitten'

import AppIntroSlider from 'react-native-app-intro-slider';
import Ionicons from 'react-native-vector-icons/Ionicons'

import folder from '../Assets/images/folder.png'

// import security from '../Assets/images/molecular.png'

import candidate from '../Assets/images/launch0-candidate.jpg'
// import candidate from '../Assets/images/launch1-candidate.jpg'
// import censor from '../Assets/images/censor.png'
// From: https://www.pexels.com/photo/man-wearing-gray-coat-standing-in-the-middle-of-the-road-936142/
import chat from '../Assets/images/launch1-your-voice.jpg'
// From: https://www.pexels.com/photo/dark-fire-time-paper-33930/
// import security from '../Assets/images/launch2-your-time.jpg'
// From: https://www.pexels.com/photo/clear-glass-with-red-sand-grainer-39396/
import security from '../Assets/images/launch2c-your-time.jpg'
// From: https://www.pexels.com/photo/boy-holding-sparkler-1565521/
import blockchain from '../Assets/images/launch3b-your-community.jpg'

import verified from '../Assets/images/verified.png'

import { GradientButton } from './gradientButton'

import { ifIphoneX } from 'react-native-iphone-x-helper'

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  image: {
    width: '100%',
    height: '70%',
  },
  text: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.8)',
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    color: 'black',
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginBottom: 16,
  }
});

const slides = [
  // TODO: make this appear the first time--after sign-in, have something else.
  // TODO: make this a bundle that is fetched online (to support multiple
  //       campaigns)--or alternately a pointer to a site specific to the
  //       the campaign.
  {
    key: 'donation0',
    title: 'Agatha Bacelar for Congress 🇺🇸',
    text: 'You\'ve been invited to help Agatha\'s campaign for the 117th US congress seat representing California district 12!',
    image: candidate,
    imageStyle: styles.image,
    colors: ['#63E2FF', '#B066FE'],
  },
  // {
  //   key: 'somethun0',
  //   title: 'Agatha Bacelar for Congress 🇺🇸',
  //   text: 'You\'ve been invited by Agatha\'s campaign to join the discussion on Referenda for California district 12s 117th congressional campaign.',
  //   image: candidate,
  //   imageStyle: styles.image,
  //   colors: ['#63E2FF', '#B066FE'],
  // },
  // {
  //   key: 'somethun',
  //   title: 'Your voice matters.',
  //   text: 'Referenda makes your voice heard by your political leaders for actionable change.',
  //   image: chat,
  //   imageStyle: styles.image,
  //   colors: ['#63E2FF', '#B066FE'],
  // },
  // {
  //   key: 'somethun1',
  //   title: 'Your time is important.',
  //   text: 'Interact with your representatives on Referenda, instead of sending form emails and making scripted calls that get ignored.',
  //   image: security,
  //   colors: ['#A3A1FF', '#3A3897'],
  // },
  // {
  //   key: 'somethun2',
  //   title: 'Make a difference.',
  //   text: 'It\'s easy to participate and even lead initiatives in your community with Referenda. Regardless of your partisanship.',
  //   image: blockchain,
  //   colors: ['#29ABE2', '#4F00BC'],
  // },
];

export default class Introduction extends Component {
  static navigationOptions = {
    header: null
  };

  constructor (props) {
    super(props)
  }

  // ImageBackground was Image sandwiched btwn views with style={styles.image}
  _renderItem = (props) => {
    let titleColor = 'white'

    return (
      <ImageBackground
        style={{ flex: 1,
                 alignItems: 'center',
                 justifyContent: 'space-between',
                 paddingTop: '7%',
                 ...ifIphoneX({
                   paddingTop: '12%',
                 }, {
                   paddingTop: '7%',
                 }),
                 paddingBottom: '3%',
                 paddingHorizontal: '7%',
                 width: props.width,
                 height: props.height }}
        source={props.image} >

        <View style={{width:'100%', flexDirection:'row', justifyContent: 'flex-start'}}>
          <Image
            id='splash-screen-img'
            style={{height:'100%', marginRight:5, width:'10%', resizeMode: 'contain'}}
            source={verified}/>
          <Text style={{fontSize:32, textAlign:'left', color:titleColor}}>Referenda</Text>
        </View>

        <View style={{flex: 0.85}} />

        <View>
          <Text style={[styles.title, {color:titleColor}]}>{props.title}</Text>
          <Text style={[styles.text, {color:titleColor}]}>{props.text}</Text>
        </View>

        <View style={{flex: 0.15}} />

        <View id='button-view' style={{height: 40,
                                       width: '100%',
                                       flexDirection: 'row',
                                       justifyContent: 'space-between'}}>
          <GradientButton
            colors={['#d2d2d2', '#828282']}
            style={[{height:'100%', width:'33%'}]}
            rkType='large'
            text='Sign In'
            onPress={() => this.props.navigation.navigate('Login')}
          />
          <GradientButton
            style={[{height:'100%', width:'33%'}]}
            rkType='large'
            text='Sign Up'
            onPress={() => this.props.navigation.navigate('Telephone')}
          />
        </View>

      </ImageBackground>
    );
  }

  render() {
    return (
      <AppIntroSlider
        slides={slides}
        renderItem={this._renderItem}
        hideNextButton
        hideDoneButton
        buttonStyle={{borderRadius:15, backgroundColor:'#FF8C00'}}
        onDone={() => this.props.navigation.navigate('Login')}
        dotStyle={{backgroundColor: 'white'}}
        activeDotStyle={{backgroundColor: 'green'}}
      />
    );
  }
}
