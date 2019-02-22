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
import blockchain from '../Assets/images/blockchain.png'
import security from '../Assets/images/molecular.png'
import censor from '../Assets/images/censor.png'
import chat from '../Assets/images/chat.png'

const styles = StyleSheet.create({
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 160,
    height: 160,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold'
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold'
  }
});

const slides = [
  {
    key: 'Secure Messaging',
    title: 'Secure Messaging',
    text: 'Chat with your friends without Zuck snooping',
    image: chat,
    imageStyle: styles.image,
    titleStyle: styles.title,
    textStyle: styles.text,
    backgroundColor: '#3b5998'
  },
  {
    key: 'Private Cloud Storage',
    title: 'Private Cloud Storage',
    text: `You own your data,\naccessible by you alone`,
    image: folder,
    imageStyle: styles.image,
    titleStyle: styles.title,
    textStyle: styles.text,
    backgroundColor: '#22bcb5'
  },
  {
    key: 'Individual Encryption',
    title: 'Individual Encryption',
    text: 'You hold your encryption keys, not a big company',
    image: security,
    imageStyle: styles.image,
    titleStyle: styles.title,
    textStyle: styles.text,
    backgroundColor: '#A3A1FF'
  },
  {
    key: 'Blockchain Identity',
    title: 'Blockchain Identity',
    text: 'Find your friends without a central database',
    image: blockchain,
    imageStyle: styles.image,
    titleStyle: styles.title,
    textStyle: styles.text,
    backgroundColor: '#29ABE2'
  },
  {
    key: 'Censorship Free',
    title: 'Censorship Free',
    text: 'Nobody can prohibit your freedom of expression',
    image: censor,
    imageStyle: styles.image,
    titleStyle: styles.title,
    textStyle: styles.text,
    backgroundColor: '#8ac724'
  },
];

export default class Introduction extends Component {
  static navigationOptions = {
    header: null
  };
  constructor (props) {
    super(props)
  }
  _renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Ionicons
          name="md-arrow-round-forward"
          color="rgba(255, 255, 255, .9)"
          size={24}
          style={{ backgroundColor: 'transparent' }}
        />
      </View>
    );
  }
  _renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Ionicons
          name="md-checkmark"
          color="rgba(255, 255, 255, .9)"
          size={24}
          style={{ backgroundColor: 'transparent' }}
        />
      </View>
    );
  }
  render () {
    return (
      <AppIntroSlider 
        slides={slides}
        renderDoneButton={this._renderDoneButton}
        renderNextButton={this._renderNextButton}
        onDone={() => this.props.navigation.navigate('SignIn')}
      />
    )
  }
}
