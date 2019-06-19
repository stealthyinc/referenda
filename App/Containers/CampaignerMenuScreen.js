/*
 Copyright 2019 Square Inc.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
import React, { Component } from 'react';
import { connect } from 'react-redux'
import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  RkButton,
  RkText,
  RkTextInput,
  RkStyleSheet,
  RkTheme,
  RkAvoidKeyboard,
} from 'react-native-ui-kitten';
import NavigationType from '../Navigation/propTypes';
import { GradientButton } from '../Components/gradientButton'
import DonationActions, { DonationSelectors } from '../Redux/DonationRedux'

import candidate from '../Assets/avatars/campa.jpg'
import { ifIphoneX } from 'react-native-iphone-x-helper'

// Styles
const styles = RkStyleSheet.create(theme => ({
    headerPanelView: {
      width: '100%',
      ...ifIphoneX({
        height: 88,
        paddingTop: 44,
      }, {
        height: 64,
        paddingTop: 20,
      }),
      paddingRight: 14,
      paddingLeft: 14,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomColor: 'rgba(220,220,220,1)',
      borderBottomStyle: 'solid',
      borderBottomWidth: 1
    },
    headerPanelText: {
      fontSize: 17,
      fontWeight: '600',
      color: 'rgba(0,0,0,0.9)',
      marginHorizontal: 16,
      padding:0,
      marginTop: 0,
      marginBottom: 0,
      textAlign: 'center',
      flex: 0.7
    },
    headerPanelRight: {
      flex: 0.1,
      justifyContent: 'center',
      textAlign: 'center'
    },
    container: {
      backgroundColor: '#78CCC5',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: '6%',
    },
    title: {
      color: '#FFFFFF',
      fontSize: 36,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    description: {
      color: '#FFFFFF',
      fontSize: 14,
      textAlign: 'center',
    },
    buttonBarLeftStyle: {
      width: '50%',
      flexDirection:'column',
      alignItems:'center',
      justifyContent:'flex-end',
      paddingRight: '3%'
    },
    buttonBarRightStyle: {
      width: '50%',
      flexDirection:'column',
      alignItems:'center',
      justifyContent:'flex-end',
      paddingLeft: '3%'
    },
    buttonStyle: {
      marginVertical:9
    },
  }));

class CampaignerMenuScreen extends Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    return {
      // headerLeft: (
      //   <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{marginLeft: 10}}>
      //     <Image
      //       source={randomAvatar}
      //       style={{height: 30, width: 30, borderRadius: 15}}/>
      //   </TouchableOpacity>
      // ),
      headerTitle: 'Fundraising'.toUpperCase(),
      headerBackTitle: 'Back',
      headerTintColor: 'black',
      gesturesEnabled: false,
    }
  };

  // static navigationOptions = {
  //   // title: 'Campaign Donation'.toUpperCase(),
  //   header: null,
  //   gesturesEnabled: false,
  // };

  constructor() {
    super();
  }

  render() {
    // Calculate dimensions for the Agatha image:
    //
    const headerHeightPercent = 7
    const verticalPaddingPercent = 3
    const imageHeightViewPortPercent = 50

    let {width, height} = Dimensions.get('window')
    const mainViewHeight = height
                           - (height * 2 * verticalPaddingPercent / 100)
                           - (height * headerHeightPercent / 100)
    const upperViewHeight = mainViewHeight * imageHeightViewPortPercent / 100
    const imageDimension = Math.floor(upperViewHeight)
    const imageBorderRadius = Math.floor(imageDimension / 2)
    return (
      <View style={[styles.container, {paddingVertical: `${verticalPaddingPercent}%`}]}>
        <View style={{width: '100%', height: '100%', flexDirection:'column', alignItems:'center', justifyContent:'flex-end'}}>
          <View style={{width: '100%', flex: 1, alignItems:'center', justifyContent:'center'}}>
            <Image
              source={candidate}
              style={{
                height: imageDimension,
                width: imageDimension,
                borderRadius: imageBorderRadius,
                borderWidth: 1,
                borderColor: '#389C95',
                resizeMode: 'contain'}}/>
            <RkText
              rkType='large'
              style={{color:'#ffffff', marginTop:9}}>Ammar for Congress 🇺🇸</RkText>
          </View>

          <GradientButton
            rkType='medium'
            text='New Donation'
            style={styles.buttonStyle}
            onPress={() => { this.props.navigation.navigate('Donator Amount') }}/>

          <GradientButton
            rkType='medium'
            text='Progress'
            style={styles.buttonStyle}
            onPress={() => {this.props.navigation.navigate('Campaign Progress')}}/>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CampaignerMenuScreen)
