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

// import candidate from '../Assets/images/launch0-candidate.jpg'
// import candidate from '../Assets/images/launch1-candidate.png'
import candidate from '../Assets/images/launch2-candidate.jpg'
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
    color: 'rgba(0, 0, 0, 0.8)',
    backgroundColor: 'transparent',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    color: 'black',
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginBottom: 16,
  },
  save: {
    marginVertical: 9,
  }
});

const slides = [
  {
    key: 'somethun0',
    title: 'Juan Guaidó for President 🇻🇪',
    text: 'You\'ve been invited by Juan\'s campaign to join the discussion on Referenda for Venezuela\'s Presidential Campaign.',
    image: candidate,
    imageStyle: styles.image,
    colors: ['#63E2FF', '#B066FE'],
  },
  {
    key: 'somethun',
    title: 'Your voice matters.',
    text: 'Referenda makes your voice heard by your political leaders for actionable change.',
    image: chat,
    imageStyle: styles.image,
    colors: ['#63E2FF', '#B066FE'],
  },
  {
    key: 'somethun1',
    title: 'Your time is important.',
    text: 'Interact with your representatives on Referenda, instead of sending form emails and making scripted calls that get ignored.',
    image: security,
    colors: ['#A3A1FF', '#3A3897'],
  },
  {
    key: 'somethun2',
    title: 'Make a difference.',
    text: 'It\'s easy to participate and even lead initiatives in your community with Referenda. Regardless of your partisanship.',
    image: blockchain,
    colors: ['#29ABE2', '#4F00BC'],
  },
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
    // let titleColor = (props.title === 'Your time is important.') ?
    //   'black' : 'white'
    let titleColor = 'white'

    return (
      <ImageBackground style={{flex: 1}} source={props.image} >
        <View
          style={[styles.mainContent, {
            paddingTop: props.topSpacer,
            paddingBottom: props.bottomSpacer,
            width: props.width,
            height: props.height,
            backgroundColor: 'transparent'
          }]}
        >
          <View style={{width:'100%', flexDirection:'row', justifyContent: 'flex-start'}}>
            <Image
              id='splash-screen-img'
              style={{height:'100%', marginLeft:'4%', marginRight:'2%', width:'10%', resizeMode: 'contain'}}
              source={verified}/>
            <Text style={{fontSize:32, textAlign:'left', color:titleColor}}>Referenda</Text>
          </View>
          <View id='middle-spacer' style={{height: '70%'}} />
          <View>
            <Text style={[styles.title, {color:titleColor}]}>{props.title}</Text>
            <Text style={[styles.text, {color:titleColor}]}>{props.text}</Text>
          </View>
          <View id='middle-bottom-spacer' style={{height: '8%'}} />
          <View id='button-view' style={{height: 40,
                                         width: '95%',
                                         flexDirection: 'row',
                                         justifyContent: 'space-between'}}>
            <GradientButton
              colors={['#d2d2d2', '#828282']}
              style={[{height:'100%', width:'35%'}]}
              rkType='large'
              text='Sign In'
              onPress={() => this.props.navigation.navigate('Login')}
            />
            <GradientButton
              style={[{height:'100%', width:'35%'}]}
              rkType='large'
              text='Sign Up'
              onPress={() => this.props.navigation.navigate('Telephone')}
            />
          </View>
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

  // _renderNextButton = () => {
  //   return (
  //     <View style={styles.buttonCircle}>
  //       <Ionicons
  //         name="md-arrow-round-forward"
  //         color="rgba(255, 255, 255, .9)"
  //         size={24}
  //         style={{ backgroundColor: 'transparent' }}
  //       />
  //     </View>
  //   );
  // }
  // _renderDoneButton = () => {
  //   return (
  //     <View style={styles.buttonCircle}>
  //       <Ionicons
  //         name="md-checkmark"
  //         color="rgba(255, 255, 255, .9)"
  //         size={24}
  //         style={{ backgroundColor: 'transparent' }}
  //       />
  //     </View>
  //   );
  // }
  // render () {
  //   return (
  //     <AppIntroSlider
  //       slides={slides}
  //       dotStyle={{backgroundColor: 'white'}}
  //       activeDotStyle={{backgroundColor: 'green'}}
  //       renderDoneButton={this._renderDoneButton}
  //       renderNextButton={this._renderNextButton}
  //       onDone={() => this.props.navigation.navigate('SignIn')}
  //     />
  //   )
  // }
}
