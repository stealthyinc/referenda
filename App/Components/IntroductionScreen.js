import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Animated,
  AsyncStorage,   // Deprecated: TODO PBJ help on install / pod work for this: https://github.com/react-native-community/async-storage
  FlatList,
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
import {Picker} from 'native-base';
import AppIntroSlider from 'react-native-app-intro-slider';
import Ionicons from 'react-native-vector-icons/Ionicons'
import folder from '../Assets/images/folder.png'
// import security from '../Assets/images/molecular.png'
// import candidate from '../Assets/images/launch0-candidate.jpg'
import candidate from '../Assets/images/launch2-candidate.jpg'
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
import * as Keychain from 'react-native-keychain';
import EngineActions from '../Redux/EngineRedux'
import {EngineCommand} from '../Engine/commands/engineCommand'

import LinearGradient from 'react-native-linear-gradient';

const { userTypeInstance } = require('../Utils/UserType.js')
// const { firebaseInstance } = require('../Utils/firebaseWrapper.js')
const { Analytics } = require('../Utils/Analytics.js')

import { Metrics } from '../Themes/'
const UIF = require('../Utils/UIFactory.js')
const { candidateData } = require('../Data/CandidateData.js')

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
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    color: 'black',
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginBottom: 16,
  }
});

// const slides = [
//   // TODO: make this appear the first time--after sign-in, have something else.
//   // TODO: make this a bundle that is fetched online (to support multiple
//   //       campaigns)--or alternately a pointer to a site specific to the
//   //       the campaign.
//   {
//     key: 'donation0',
//     title: candidateData.getLoginTitle(),
//     text: candidateData.getLoginDescription(),
//     image: candidateData.getLoginPhoto(),
//     imageStyle: styles.image,
//     colors: ['#63E2FF', '#B066FE'],
//   },
//   // {
//   //   key: 'somethun0',
//   //   title: 'Agatha Bacelar for Congress 🇺🇸',
//   //   text: 'You\'ve been invited by Agatha\'s campaign to join the discussion on Referenda for California district 12s 117th congressional campaign.',
//   //   image: candidate,
//   //   imageStyle: styles.image,
//   //   colors: ['#63E2FF', '#B066FE'],
//   // },
//   // {
//   //   key: 'somethun',
//   //   title: 'Your voice matters.',
//   //   text: 'Referenda makes your voice heard by your political leaders for actionable change.',
//   //   image: chat,
//   //   imageStyle: styles.image,
//   //   colors: ['#63E2FF', '#B066FE'],
//   // },
//   // {
//   //   key: 'somethun1',
//   //   title: 'Your time is important.',
//   //   text: 'Interact with your representatives on Referenda, instead of sending form emails and making scripted calls that get ignored.',
//   //   image: security,
//   //   colors: ['#A3A1FF', '#3A3897'],
//   // },
//   // {
//   //   key: 'somethun2',
//   //   title: 'Make a difference.',
//   //   text: 'It\'s easy to participate and even lead initiatives in your community with Referenda. Regardless of your partisanship.',
//   //   image: blockchain,
//   //   colors: ['#29ABE2', '#4F00BC'],
//   // },
// ];

const INDEX_KEY = '@referendaStore:campaignIndex'

class IntroductionScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: null,
      gesturesEnabled: false
    }
  }

  constructor (props) {
    super(props)
    // this.props.navigation.navigate('Start')
    this.state = {
      selectedCampaign: undefined,
      showCampaignPicker: false
    }

    try {
      AsyncStorage.getItem(INDEX_KEY)
      .then((value) => {
        console.log(`constructor AsyncStorage read: ${value}`)
        if ((value !== null) && (value !== undefined)) {
          const intValue = parseInt(value)
          candidateData.setCandidateIndex(intValue)
          this.setState({'selectedCampaign': intValue})
        }
      })
    } catch (suppressedError) {}
  }

  state = {
    username: '',
    password: '',
    status: ''
  }

  // componentDidMount() {
  //   this.reset()
  // }

  // // TODO: actually call this?
  // async reset() {
  //   try {
  //     await Keychain.resetGenericPassword({service: 'vote.referenda'});
  //   } catch (err) {
  //     this.setState({ status: 'Could not reset credentials, ' + err });
  //   }
  // }

  async load() {
    try {
      const credentials = await Keychain.getGenericPassword({service: 'vote.referenda'});
      if (credentials) {
        const engCmd =
          EngineCommand.signInCommand(credentials.username, credentials.password)
        this.props.engineCommandExec(engCmd)
        Analytics.setCredentials(credentials.username)

        this.onLoginButtonPressed()
      } else {
        // this.setState({ status: 'No credentials stored.' });
        alert('No credentials stored.')
      }
    } catch (err) {
      this.setState({ status: 'Could not load credentials. ' + err });
    }
  }

  onLoginButtonPressed = () => {
    // if (userTypeInstance.getUserType())
    //   this.props.navigation.navigate('CampaignerMenu');
    // else
    //   this.props.navigation.navigate('SocialMenu');
    this.props.navigation.navigate('Start')
  };

  handleCampaignSelection = (value) => {
    candidateData.setCandidateIndex(value)
    this.setState({
      'selectedCampaign': value,
      'showCampaignPicker': !this.state.showCampaignPicker})

    try {
      AsyncStorage.setItem(INDEX_KEY, value.toString())
    } catch (suppressedError) {
      console.log(`Suppressed Error (handleCampaignSelection): ${suppressedError}`)
    }
  }

  handleCampaignPickerToggle = () => {
    this.setState({'showCampaignPicker': !this.state.showCampaignPicker})
  }

  getCampaignPicker = () => {

    if (this.state.showCampaignPicker) {
      const campaignOptions = [UIF.getVerticalSpacer(Metrics.navBarHeight)]

      let keyVal = Date.now()
      for (const indexCandidatePair of candidateData.getIndexCandidateMap()) {
        campaignOptions.push(UIF.getListButton(
          indexCandidatePair.candidate,
          undefined,
          indexCandidatePair.index,
          this.handleCampaignSelection,
          'white',
          'gray'))
      }

      return (UIF.getOptionsModal(
        UIF.getScrollingContainer(
          campaignOptions
        )
      ))
    } else {
      const buttonText = (this.state.selectedCampaign !== undefined) ?
        'Change Campaign' : 'Choose a Campaign'
      const colors = (this.state.selectedCampaign !== undefined) ?
         ['#d2d2d2', '#828282'] : undefined

      return (
        <GradientButton
          colors={colors}
          style={[{height:30, width:'65%'}]}
          rkType='large'
          text={buttonText}
          onPress={() => this.handleCampaignPickerToggle()} />
      )
    }
  }

  // ImageBackground was Image sandwiched btwn views with style={styles.image}
  _renderItem = (props) => {
    let titleColor = 'white'
    // firebaseInstance.setFirebaseData('global/mobile/', {1: 'testing 126'})
    if (this.state.selectedCampaign === undefined) {
      return (
        <View style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'black'}}>

          { /*
          <View style={{width:'100%', flexDirection:'row', justifyContent: 'flex-start'}}>
            <Image
              id='splash-screen-img'
              style={{height:'100%', marginRight:5, width:'10%', resizeMode: 'contain'}}
              source={verified}/>
            <Text style={{fontSize:32, textAlign:'left', color:titleColor}}>Referenda</Text>
          </View> */ }

          <View id='top-spacer' style={{flex: 4}} />

          <View style={{'alignItems': 'center'}}>
            <RkText rkType='basic' style={{fontSize:62, color:'white'}}>Referenda</RkText>
          </View>

          <View id='mid-spacer' style={{alignItems: 'center', width:'100%', flex:14}}>
            <Image
              id='splash-screen-img'
              style={{height:'75%', width:'75%', marginTop:'12%', resizeMode: 'contain'}}
              source={verified}/>
          </View>

          <View style={{width: '100%', flexDirection:'row', justifyContent:'center', alignItems:'center', flex:4}}>
              {this.getCampaignPicker()}
          </View>
        </View>
      )
    } else {
      return (
        <ImageBackground
          style={{ flex: 1 }}
          source={props.image} >
          <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.0)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.7)']}
            start={{x:0, y:0}} end={{x:0, y:1}}
            style={{flex:1,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    ...ifIphoneX({
                      paddingTop: '15%',
                    }, {
                      paddingTop: '10%',
                    }),
                    paddingBottom: '2%',
                    paddingHorizontal: '4%'}}>

          <View style={{width: '100%', flex:0.3, flexDirection:'column', justifyContent:'flex-start'}}>
            <View style={{width:'100%', flexDirection:'row', justifyContent: 'flex-start'}}>
              <Image
                id='splash-screen-img'
                style={{height:'100%', marginRight:5, width:'10%', resizeMode: 'contain'}}
                source={verified}/>
              <Text style={{fontSize:32, textAlign:'left', color:titleColor}}>Referenda</Text>
            </View>
          </View>

          <View style={{width: '100%', flex:0.7, flexDirection:'column', justifyContent:'flex-end'}}>
            <Text style={[styles.title, {color:titleColor}]}>{props.title}</Text>
            <Text style={[styles.text, {color:titleColor}]}>{props.text}</Text>

            <View id='button-view' style={{height: 30,
                                           width: '100%',
                                           flexDirection: 'row',
                                           justifyContent: 'space-between'}}>
              <GradientButton
                colors={['#d2d2d2', '#828282']}
                style={[{height:'100%', width:'33%'}]}
                rkType='large'
                text='Sign In'
                onPress={() => this.load()}
              />
              <GradientButton
                style={[{height:'100%', width:'33%'}]}
                rkType='large'
                text='Sign Up'
                onPress={() => this.props.navigation.navigate('Telephone')}
              />
            </View>

            <View style={{width: '100%', flexDirection:'row', justifyContent:'center', alignItems:'center', marginTop:(2*16)}}>
                {this.getCampaignPicker()}
            </View>

          </View>
        </LinearGradient>
        </ImageBackground>
      );
    }
  }

  render() {
    return (
      this._renderItem(
        {
          key: 'donation0',
          title: candidateData.getLoginTitle(),
          text: candidateData.getLoginDescription(),
          image: candidateData.getLoginPhoto(),
          imageStyle: styles.image,
          colors: ['#63E2FF', '#B066FE'],
        }
      )
    )

  //   const slides = [
  //     // TODO: make this appear the first time--after sign-in, have something else.
  //     // TODO: make this a bundle that is fetched online (to support multiple
  //     //       campaigns)--or alternately a pointer to a site specific to the
  //     //       the campaign.
  //     {
  //       key: 'donation0',
  //       title: candidateData.getLoginTitle(),
  //       text: candidateData.getLoginDescription(),
  //       image: candidateData.getLoginPhoto(),
  //       imageStyle: styles.image,
  //       colors: ['#63E2FF', '#B066FE'],
  //     },
  //   ]
  //   return (
  //     <AppIntroSlider
  //       slides={slides}
  //       renderItem={this._renderItem}
  //       hideNextButton
  //       hideDoneButton
  //       buttonStyle={{borderRadius:15, backgroundColor:'#FF8C00'}}
  //       onDone={() => this.props.navigation.navigate('Login')}
  //       dotStyle={{backgroundColor: 'white'}}
  //       activeDotStyle={{backgroundColor: 'green'}}
  //     />
  //   );
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    engineCommandExec: (aCommand) => dispatch(EngineActions.engineCommandExec(aCommand))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IntroductionScreen)
