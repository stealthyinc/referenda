import React, { Component } from 'react'
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native'

import AppIntroSlider from 'react-native-app-intro-slider';
import Ionicons from 'react-native-vector-icons/Ionicons'

import folder from '../Assets/images/folder.png'

// import security from '../Assets/images/molecular.png'

import censor from '../Assets/images/censor.png'
// From: https://www.pexels.com/photo/man-wearing-gray-coat-standing-in-the-middle-of-the-road-936142/
import chat from '../Assets/images/launch1l-your-voice.jpg'
// From: https://www.pexels.com/photo/dark-fire-time-paper-33930/
import security from '../Assets/images/launch2-your-time.jpg'
// From: https://www.pexels.com/photo/boy-holding-sparkler-1565521/
import blockchain from '../Assets/images/launch3-your-community.jpg'

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
    key: 'somethun',
    title: 'Your voice matters.',
    text: 'Referenda makes your voice heard by your political representatives on issues that matter to you for actionable change.',
    image: chat,
    imageStyle: styles.image,
    colors: ['#63E2FF', '#B066FE'],
  },
  {
    key: 'somethun1',
    title: 'Your time is important.',
    text: 'Don\'t waste time sending form emails or making scripted calls that often go ignored. Representatives listen and even interact with you on Referenda.',
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

//
// const styles = StyleSheet.create({
//   buttonCircle: {
//     width: 40,
//     height: 40,
//     backgroundColor: 'rgba(0, 0, 0, .2)',
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   image: {
//     width: '100%',
//     height: '60%',
//   },
//   title: {
//     fontSize: 62,
//     color: 'white'
//   },
//   text: {
//     fontSize: 24,
//     color: 'white'
//   }
// });

// const slides = [
//   {
//     key: 'Secure Messaging',
//     title: 'Referenda',
//     text: 'Chat with your friends without Zuck snooping',
//     image: chat,
//     imageStyle: styles.image,
//     titleStyle: styles.title,
//     textStyle: styles.text,
//     backgroundColor: 'black'
//   },
//   {
//     key: 'Private Cloud Storage',
//     title: 'Referenda',
//     text: `You own your data,\naccessible by you alone`,
//     image: folder,
//     imageStyle: styles.image,
//     titleStyle: styles.title,
//     textStyle: styles.text,
//     backgroundColor: 'black'
//   },
//   {
//     key: 'Individual Encryption',
//     title: 'Referenda',
//     text: 'You hold your encryption keys, not a big company',
//     image: security,
//     imageStyle: styles.image,
//     titleStyle: styles.title,
//     textStyle: styles.text,
//     backgroundColor: 'black'
//   },
//   {
//     key: 'Blockchain Identity',
//     title: 'Referenda',
//     text: 'Find your friends without a central database',
//     image: blockchain,
//     imageStyle: styles.image,
//     titleStyle: styles.title,
//     textStyle: styles.text,
//     backgroundColor: 'black'
//   },
//   {
//     key: 'Censorship Free',
//     title: 'Referenda',
//     text: 'Nobody can prohibit your freedom of expression',
//     image: censor,
//     imageStyle: styles.image,
//     titleStyle: styles.title,
//     textStyle: styles.text,
//     backgroundColor: 'black'
//   },
// ];

export default class Introduction extends Component {
  static navigationOptions = {
    header: null
  };

  constructor (props) {
    super(props)
  }

  _renderItem = props => (
    <View
      style={[styles.mainContent, {
        paddingTop: props.topSpacer,
        paddingBottom: props.bottomSpacer,
        width: props.width,
        height: props.height,
        backgroundColor: 'white'
      }]}
    >
      <View style={{width:'100%', flexDirection:'row', justifyContent: 'flex-start'}}>
        <Image
          id='splash-screen-img'
          style={{height:'100%', marginLeft:'4%', marginRight:'2%', width:'10%', resizeMode: 'contain'}}
          source={verified}/>
        <Text style={{fontSize:32, textAlign:'left', color:'black'}}>Referenda</Text>
      </View>
      <Image style={styles.image} source={props.image} />
      <View>
        <Text style={styles.title}>{props.title}</Text>
        <Text style={styles.text}>{props.text}</Text>
      </View>
    </View>
  );

  render() {
    return (
      <AppIntroSlider
        slides={slides}
        renderItem={this._renderItem}
        bottomButton
        buttonStyle={{borderRadius:15, backgroundColor:'#FF8C00'}}
        onDone={() => this.props.navigation.navigate('SignIn')}
        dotStyle={{backgroundColor: 'black'}}
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
