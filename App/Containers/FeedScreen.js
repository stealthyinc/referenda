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
} from 'react-native-ui-kitten';
import { Avatar } from '../Components';
import { data } from '../Data';
import NavigationType from '../Navigation/propTypes';
import Ionicons from 'react-native-vector-icons/Ionicons'
import SettingsActions, { SettingsSelectors } from '../Redux/SettingsRedux'

import Video from 'react-native-video'

const moment = require('moment');
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
const styles = RkStyleSheet.create(theme => ({
  container: {
    backgroundColor: theme.colors.screen.scroll,
    paddingVertical: 8,
    paddingHorizontal: 14,
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
}));

const avatarArr = {
  0: require('../Data/img/avatars/Image0.png'),
  1: require('../Data/img/avatars/Image1.png'),
  2: require('../Data/img/avatars/Image2.png'),
  3: require('../Data/img/avatars/Image3.png'),
  4: require('../Data/img/avatars/Image4.png'),
  5: require('../Data/img/avatars/Image5.png'),
  6: require('../Data/img/avatars/Image6.png'),
  7: require('../Data/img/avatars/Image7.png'),
  8: require('../Data/img/avatars/Image8.png'),
  9: require('../Data/img/avatars/Image9.png'),
 10: require('../Data/img/avatars/Image10.png'),
 11: require('../Data/img/avatars/Image11.png'),
}

class FeedScreen extends Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    const randomAvatar = (params.phoneNumber) ? avatarArr[Math.floor(Math.random() * Math.floor(12))] : require('../Data/img/avatars/agatha.png')
    return {
      headerLeft: (
        <TouchableOpacity onPress={() => params.drawer()} style={{marginLeft: 10}}>
          <Image 
            source={randomAvatar}
            style={{height: 30, width: 30, borderRadius: 15}}/>
        </TouchableOpacity>
      ),
      headerRight: (
        <TouchableOpacity onPress={() => alert('New Proposal')} style={{marginRight: 10}}>
          <Ionicons name='ios-paper-plane' size={30} color='gray' />
        </TouchableOpacity>
      ),
      headerTitle: 'Proposals'.toUpperCase(),
      headerBackTitle: 'Back',
      headerTintColor: 'black',
    }
  };

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
    if (item.hasOwnProperty('video')) {
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
              <Avatar style={styles.avatar} rkType='circle small' img={item.user.photo} />
              <RkText rkType='header6'>{`${item.user.firstName} ${item.user.lastName}`}</RkText>
            </View>
            <RkText rkType='secondary2 hintColor'>{moment().add(item.time, 'seconds').fromNow()}</RkText>
          </View>
        </RkCard>
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
                <Avatar style={styles.avatar} rkType='circle small' img={item.user.photo} />
                <RkText rkType='header6'>{`${item.user.firstName} ${item.user.lastName}`}</RkText>
              </View>
              <RkText rkType='secondary2 hintColor'>{moment().add(item.time, 'seconds').fromNow()}</RkText>
            </View>
          </RkCard>
        </TouchableOpacity>
      );
    }
  }

  render = () => (
    <FlatList
      data={this.state.data}
      renderItem={this.renderItem}
      keyExtractor={this.extractItemKey}
      style={styles.container}
    />
  );
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
