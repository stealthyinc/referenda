import React from 'react';
import {
  FlatList,
  View,
  Image,
  TouchableOpacity
} from 'react-native';
import {
  RkButton,
  RkCard,
  RkText, 
  RkStyleSheet,
} from 'react-native-ui-kitten';
import { FontIcons } from '../assets/icons';
import { Avatar } from '../components/avatar';
import { SocialBar } from '../components/socialBar';
import { data } from '../data';
import ListContainer from './ListContainer'
import * as blockstack from 'blockstack'

const firebase = require('firebase');
const moment = require('moment');

export default class Feed extends React.Component {
  static navigationOptions = {
    title: 'Feed'.toUpperCase(),
  };
  constructor(props) {
    super(props);
    const isSignedIn = this.checkSignedInStatus();
    const userData = isSignedIn && this.loadUserData();
    const person = (userData.username) ? new blockstack.Person(userData.profile) : false;
    this.state = {
      userData,
      person,
      isSignedIn,
      data: data.getArticles('article'),
    };
    if (!firebase.auth().currentUser) {
      firebase.auth().signInAnonymously()
      .then(() => {
        // this.anonalytics.setDatabase(firebase);
      });
    }
  }
  checkSignedInStatus() {
    if (blockstack.isUserSignedIn()) {
      return true;
    } else if (blockstack.isSignInPending()) {
      blockstack.handlePendingSignIn().then(() => {
        window.location = window.location.origin;
      });
      return false;
    }
    return false;
  }
  loadUserData() {
    return blockstack.loadUserData();
  }
  extractItemKey = (item) => `${item.id}`;
  onItemPressed = (item) => {
    this.props.navigation.navigate('Article', { id: item.id });
  }
  handleLogin = () => {
    if (this.state.isSignedIn) {
      blockstack.signUserOut(window.location.href);
    }
    else {
      const origin = window.location.origin;
      blockstack.redirectToSignIn(origin, `${origin}/manifest.json`, ['store_write', 'publish_data']); 
    }
  }
  renderItem = ({ item }) => (
    <TouchableOpacity
      delayPressIn={70}
      activeOpacity={0.8}
      onPress={() => this.onItemPressed(item)}>
      <RkCard style={styles.card}>
        <View rkCardHeader>
          <Avatar
            rkType='small'
            style={styles.avatar}
            img={item.user.photo}
          />
          <View>
            <RkText rkType='header4'>{`${item.user.firstName} ${item.user.lastName}`}</RkText>
            <RkText rkType='secondary2 hintColor'>{moment().add(item.time, 'seconds').fromNow()}</RkText>
          </View>
        </View>
        <Image rkCardImg source={item.photo} />
        <View rkCardContent>
          <RkText rkType='secondary5'>{item.text}</RkText>
        </View>
        <View rkCardFooter>
          <SocialBar />
        </View >
      </RkCard>
    </TouchableOpacity>
  );
  render = () => (
    <View>
      <View style={styles.main}>
        <RkButton
          rkType={(this.state.isSignedIn) ? 'clear' : 'primary'}
          style={{ height: 60, width: 60 }}
          key='LoginMenu'
          onPress={() => this.handleLogin()}
        >
          <RkText style={styles.icon} rkType='primary moon small'>
            {FontIcons.login}
          </RkText>
        </RkButton>
        <RkButton
          rkType='clear'
          style={{ height: 60, width: 60 }}
          key='ArticleMenu'
          onPress={() => this.onItemPressed(null)}>
          <RkText style={styles.icon} rkType='primary moon small'>
            {FontIcons.article}
          </RkText>
        </RkButton>
      </View>
      <FlatList
        data={this.state.data}
        renderItem={this.renderItem}
        keyExtractor={this.extractItemKey}
        style={styles.container}
      />
    </View>
  );
}

const styles = RkStyleSheet.create(theme => ({
  container: {
    backgroundColor: theme.colors.screen.scroll,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  card: {
    marginVertical: 8,
  },
  avatar: {
    marginRight: 16,
  },
  main: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#ffffff"
  },
  icon: {
    margin: 5,
  },
}));
