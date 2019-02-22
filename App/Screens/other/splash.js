import React from 'react';
import {
  StyleSheet,
  Image,
  View,
  Dimensions,
  StatusBar,
} from 'react-native';
import {
  RkText,
  RkTheme,
} from 'react-native-ui-kitten';
import {
  StackActions,
  NavigationActions,
} from 'react-navigation';
import { ProgressBar } from '../../Components';
import { KittenTheme } from '../../Config/Theme';
import { scale, scaleVertical } from '../../Utils/scale';
import NavigationType from '../../Navigation/propTypes';

import verified from './../../Assets/images/verified.png'

const delay = 500;

export class SplashScreen extends React.Component {
  static navigationOptions = {
    header: null
  };
  static propTypes = {
    navigation: NavigationType.isRequired,
  };
  state = {
    progress: 0,
  };

  componentDidMount() {
    StatusBar.setHidden(true, 'none');
    RkTheme.setTheme(KittenTheme);
    this.timer = setInterval(this.updateProgress, delay);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  updateProgress = () => {
    if (this.state.progress === 1) {
      clearInterval(this.timer);
      setTimeout(this.onLoaded, delay);
    } else {
      const randProgress = this.state.progress + (Math.random() * 0.5);
      this.setState({ progress: randProgress > 1 ? 1 : randProgress });
    }
  };

  onLoaded = () => {
    StatusBar.setHidden(false, 'slide');
    const toHome = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Home' })],
    });
    this.props.navigation.dispatch(toHome);
  };

//           style={[styles.image, { width: Dimensions.get('window').width }]}
  render = () => (
    <View style={styles.container}>
      <View id='top-spacer' style={{flex: 4}}/>

      <View style={styles.text}>
        <RkText rkType='basic' style={styles.appName}>Referenda</RkText>
      </View>

      <View id='mid-spacer' style={{alignItems: 'center', flex: 14}}>
        <Image
          id='splash-screen-img'
          style={{height:'75%', width:'75%', marginTop:'12%', resizeMode: 'contain'}}
          source={verified}/>
      </View>

      <View style={styles.text}>
        <RkText rkType='light' style={styles.hero}>Stealthy Inc.</RkText>
      </View>

      <View id='bottom-spacer-1' style={{flex: 1}}/>

      <ProgressBar
        color={RkTheme.current.colors.accent}
        style={styles.progress}
        progress={this.state.progress}
        width={scale(320)}/>

      <View id='bottom-spacer-2' style={{flex: 1}}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: KittenTheme.colors.screen.base,
    justifyContent: 'space-between',
    flex: 1,
  },
  image: {
    resizeMode: 'contain',
  },
  text: {
    alignItems: 'center',
  },
  hero: {
    fontSize: 20,
  },
  appName: {
    fontSize: 62,
  },
  progress: {
    alignSelf: 'center',
    marginBottom: 35,
    backgroundColor: '#e5e5e5',
  },
});
