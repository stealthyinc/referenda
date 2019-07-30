import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import Swiper from 'react-native-web-swiper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slideContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default class SwipeView extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Swiper loop={true}>
          <View style={[styles.slideContainer]}>
            <ImageBackground style={{width: '100%', height: '100%'}} source={require('../assets/bad.jpeg')}>
              <Text>Traditional social media is infested with trolls & bots.</Text>
            </ImageBackground>
          </View>
          <View style={[styles.slideContainer]}>
            <ImageBackground style={{width: '100%', height: '100%'}} source={require('../assets/good.jpeg')}>
              <Text>Authentic social communication with real stakeholders.</Text>
            </ImageBackground>
          </View>
          <View style={[styles.slideContainer]}>
            <ImageBackground style={{width: '100%', height: '100%'}} source={require('../assets/human.jpeg')}>
              <Text>Humane technology that prioritizes privacy and data security.</Text>
            </ImageBackground>
          </View>
        </Swiper>
      </View>
    );
  }
}
