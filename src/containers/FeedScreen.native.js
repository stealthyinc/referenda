import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  FlatList,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  RkCard, RkStyleSheet,
  RkText,
  RkButton,
  RkTextInput
} from 'react-native-ui-kitten';
import {
  Avatar,
  GradientButton,
} from '../components';
import { FontAwesome } from '../assets/icons';
import { data } from '../data';
import NavigationType from '../navigation/propTypes';
import Ionicons from 'react-native-vector-icons/Ionicons'
import SettingsActions, { SettingsSelectors } from '../redux/SettingsRedux'

import Video from 'react-native-video'
import { ifIphoneX } from 'react-native-iphone-x-helper'
const { userTypeInstance } = require('../utils/UserType.js')

const moment = require('moment');
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../redux/YourRedux'


const avatarArr = {
  0: require('../data/img/avatars/Image0.png'),
  1: require('../data/img/avatars/Image1.png'),
  2: require('../data/img/avatars/Image2.png'),
  3: require('../data/img/avatars/Image3.png'),
  4: require('../data/img/avatars/Image4.png'),
  5: require('../data/img/avatars/Image5.png'),
  6: require('../data/img/avatars/Image6.png'),
  7: require('../data/img/avatars/Image7.png'),
  8: require('../data/img/avatars/Image8.png'),
  9: require('../data/img/avatars/Image9.png'),
 10: require('../data/img/avatars/Image10.png'),
 11: require('../data/img/avatars/Image11.png'),
}

const randomAvatar = (userTypeInstance.getUserType()) ? avatarArr[Math.floor(Math.random() * Math.floor(12))] : require('../data/img/avatars/agatha.png')

// Styles
const styles = RkStyleSheet.create(theme => ({
    headerPanelView: {
      backgroundColor: theme.colors.screen.scroll,
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
    headerPanelLeft: {
      flex: 0.1,
      justifyContent: 'center',
      textAlign: 'center',
    },
    headerPanelRight: {
      flex: 0.1,
      justifyContent: 'center',
      textAlign: 'center'
    },
    container: {
      backgroundColor: theme.colors.screen.scroll,
      paddingVertical: 8,
      paddingHorizontal: 14,
      flex: 1,
      width: '100%',
    },
    card: {
      marginVertical: 8,
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      marginRight: 17,
    },
    icon: {
      fontSize: 24,
    },
    button: {
      right: 17
    }
  }));

class FeedScreen extends Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };
  // static navigationOptions = ({ navigation }) => {
  //   const params = navigation.state.params || {}
  //   const randomAvatar = (params.phoneNumber) ? avatarArr[Math.floor(Math.random() * Math.floor(12))] : require('../data/img/avatars/agatha.png')
  //   return {
  //     headerLeft: (
  //       <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{marginLeft: 10}}>
  //         <Image
  //           source={randomAvatar}
  //           style={{height: 30, width: 30, borderRadius: 15}}/>
  //       </TouchableOpacity>
  //     ),
  //     headerRight: (userTypeInstance.getUserType()) ? (
  //       <TouchableOpacity onPress={() => navigation.navigate('Create')} style={{marginRight: 10}}>
  //         <Ionicons name='ios-paper-plane' size={30} color='gray' />
  //       </TouchableOpacity>
  //     ) : null,
  //     headerTitle: 'Home'.toUpperCase(),
  //     headerBackTitle: 'Back',
  //     headerTintColor: 'black',
  //   }
  // };
  static navigationOptions = ({ navigation }) => {
    return {
      header: null,
      gesturesEnabled: false,
    }
  }

  state = {
    data: data.getArticles('article')
  };

  async componentDidMount () {
    this.props.navigation.setParams({ navigation: this.props.navigation, drawer: this.props.settingsMenuToggle, phoneNumber: this.props.phoneNumber })
  }

  extractItemKey = (item) => `${item.id}`;

  onItemPressed = (item) => {
    this.props.navigation.navigate('Article', { id: item.id });
  };

  renderItem = ({ item }) => {
    if (item && item.hasOwnProperty('video')) {
      return (
        <RkCard rkType='blog' style={styles.card}>
          <Video rkCardImg
                 controls={true}
                 muted={true}
                 resizeMode='cover'
                 source={item.video} />
          <View rkCardHeader style={styles.content}>
            <RkText style={styles.section} rkType='header4'>{item.title}</RkText>
          </View>
          <View rkCardContent>
            <View>
              <RkText rkType='primary3 mediumLine' numberOfLines={2}>{item.text}</RkText>
            </View>
          </View>
          <View rkCardFooter>
            <View style={styles.userInfo}>
              <Avatar style={styles.avatar} rkType='circle small' img={require('../data/img/avatars/agatha.png')} />
              <RkText rkType='header6'>{`Agatha Bacelar`}</RkText>
            </View>
            <RkText rkType='secondary2 hintColor'>{moment().add(item.time, 'seconds').fromNow()}</RkText>
          </View>
        </RkCard>
      );
    } else if (item && item.hasOwnProperty('survey') && item.survey) {
      let surveySummary = `${item.text}`
      return (
        <View>
          <TouchableOpacity
            delayPressIn={70}
            activeOpacity={0.8}
            onPress={() => this.onItemPressed(item)}>
            <RkCard rkType='blog' style={styles.card}>
              <Image rkCardImg source={item.photo} />
              <View rkCardContent>
                <View>
                  <RkText rkType='primary3 mediumLine' numberOfLines={2}>{surveySummary}</RkText>
                </View>
              </View>
              <View rkCardContent>
                 <RkTextInput
                   rkType='bordered rounded iconRight'
                   placeholder='$29,800.00'
                   keyboardType='numeric'
                   maxLength={11}
                 />
              </View>
              <View rkCardFooter>
                <View style={styles.userInfo}>
                <Avatar style={styles.avatar} rkType='circle small' img={require('../data/img/avatars/agatha.png')} />
                <RkText rkType='header6'>{`Agatha Bacelar`}</RkText>
                </View>
                <RkText rkType='secondary2 hintColor'>{moment().add(item.time, 'seconds').fromNow()}</RkText>
              </View>
            </RkCard>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <TouchableOpacity
          delayPressIn={70}
          activeOpacity={0.8}
          onPress={() => this.onItemPressed(item)}>
          <RkCard rkType='blog' style={styles.card}>
            <Image rkCardImg source={item.photo} />
            <View rkCardHeader style={styles.content}>
              <RkText style={styles.section} rkType='header4'>{item.title}</RkText>
            </View>
            <View rkCardContent>
              <View>
                <RkText rkType='primary3 mediumLine' numberOfLines={2}>{item.text}</RkText>
              </View>
            </View>
            <View rkCardFooter>
              <View style={styles.userInfo}>
                <Avatar style={styles.avatar} rkType='circle small' img={require('../data/img/avatars/agatha.png')} />
                <RkText rkType='header6'>{`Agatha Bacelar`}</RkText>
              </View>
              <RkText rkType='secondary2 hintColor'>{moment().add(item.time, 'seconds').fromNow()}</RkText>
            </View>
          </RkCard>
        </TouchableOpacity>
      );
    }
  }

  getHeader() {
    return (
      <View style={styles.headerPanelView}>

        <View id='headerIcon' style={{flex:0.1, justifyContent: 'center', textAlign: 'center'}}>
          <TouchableOpacity
            onPress={() => this.props.navigation.toggleDrawer()}>
            <Image
              source={randomAvatar}
              style={{height: 30, width: 30, borderRadius: 15}}/>
          </TouchableOpacity>
        </View>

        <RkText
          key={this.uniqueKey++}
          style={styles.headerPanelText}>CAMPAIGN NEWS</RkText>

        <View id='headerRight' style={styles.headerPanelRight} />

      </View>
    )
  }

  render() {
    let header = this.getHeader()
    return (
      <View style={{width:'100%', flex:1}}>
        {header}
        <FlatList
          data={this.state.data}
          renderItem={this.renderItem}
          keyExtractor={this.extractItemKey}
          style={styles.container}
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    phoneNumber: SettingsSelectors.getPhoneNumber(state),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    settingsMenuToggle: () => dispatch(SettingsActions.settingsMenuToggle())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedScreen)
