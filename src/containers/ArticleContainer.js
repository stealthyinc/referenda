import React from 'react';
import {
  ScrollView,
  Image,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  Card,
  Text,
  Thumbnail
} from 'native-base';
import { data } from '../data';

const moment = require('moment');

export default class Article extends React.Component {

  constructor(props) {
    super(props);
    const articleId = this.props.navigation.getParam('id', 1);
    this.data = data.getArticle(articleId);
  }

  onAvatarPressed = () => {
    // this.props.navigation.navigate('ProfileV2', { id: this.data.user.id });
  };

  render = () => (
    <ScrollView style={styles.root}>
      <Card rkType='article'>
        <Image rkCardImg source={this.data.photo} />
        <View rkCardHeader>
          <View>
            <Text style={styles.title} rkType='header4'>{this.data.header}</Text>
            <Text rkType='secondary2 hintColor'>
              {moment().add(this.data.time, 'seconds').fromNow()}
            </Text>
          </View>
          <TouchableOpacity onPress={this.onAvatarPressed}>
            <Thumbnail source={this.data.user.photo} />
          </TouchableOpacity>
        </View>
        <View rkCardContent>
          <View>
            <Text rkType='secondary5'>{this.data.text}</Text>
          </View>
        </View>
        <View rkCardFooter>
          <SocialBar />
        </View>
      </Card>
    </ScrollView>
  )
}

const styles = RkStyleSheet.create(theme => ({
  root: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: theme.colors.screen.base,
  },
  title: {
    marginBottom: 5,
  },
}));
