import React from 'react';
import {
  FlatList,
  View,
  Image,
  TouchableOpacity
} from 'react-native';
import { RkStyleSheet, RkText } from 'react-native-ui-kitten';
import { Avatar } from '../../Components';
import { data } from '../../Data';
import Ionicons from 'react-native-vector-icons/Ionicons'

const moment = require('moment');

export class Notifications extends React.Component {
  static navigationOptions = {
    title: 'Notifications'.toUpperCase(),
    headerLeft: (
      <TouchableOpacity onPress={() => alert('More Info')} style={{marginLeft: 10}}>
        <Ionicons name='ios-information-circle-outline' size={30} color='gray' />
      </TouchableOpacity>
    ),
    headerRight: (
      <TouchableOpacity onPress={() => alert('Settings')} style={{marginRight: 10}}>
        <Ionicons name='ios-cog' size={30} color='gray' />
      </TouchableOpacity>
    ),
  };

  state = {
    data: data.getNotifications(),
  };

  extractItemKey = (item) => `${item.id}`;

  renderAttachment = (item) => {
    const hasAttachment = item.attach !== undefined;
    return hasAttachment ? <View /> : <Image style={styles.attachment} source={item.attach} />;
  };

  renderItem = ({ item }) => (
    <View style={styles.container}>
      <Avatar
        img={item.user.photo}
        rkType='circle'
        style={styles.avatar}
        badge={item.type}
      />
      <View style={styles.content}>
        <View style={styles.mainContent}>
          <View style={styles.text}>
            <RkText>
              <RkText rkType='header6'>{`${item.user.firstName} ${item.user.lastName}`}</RkText>
              <RkText rkType='primary2'> {item.description}</RkText>
            </RkText>
          </View>
          <RkText
            rkType='secondary5 hintColor'>{moment().add(item.time, 'seconds').fromNow()}
          </RkText>
        </View>
        {this.renderAttachment(item)}
      </View>
    </View>
  );

  render = () => (
    <FlatList
      style={styles.root}
      data={this.state.data}
      renderItem={this.renderItem}
      keyExtractor={this.extractItemKey}
    />
  );
}

const styles = RkStyleSheet.create(theme => ({
  root: {
    backgroundColor: theme.colors.screen.base,
  },
  container: {
    padding: 16,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: theme.colors.border.base,
    alignItems: 'flex-start',
  },
  avatar: {},
  text: {
    marginBottom: 5,
  },
  content: {
    flex: 1,
    marginLeft: 16,
    marginRight: 0,
  },
  mainContent: {
    marginRight: 60,
  },
  img: {
    height: 50,
    width: 50,
    margin: 0,
  },
  attachment: {
    position: 'absolute',
    right: 0,
    height: 50,
    width: 50,
  },
}));