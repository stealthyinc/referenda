import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  RkText,
  RkButton, RkStyleSheet,
} from 'react-native-ui-kitten';
import { Avatar } from '../../Components/avatar';
import { Gallery } from '../../Components/gallery';
import { data } from '../../Data';
import formatNumber from '../../Utils/textUtils';
import NavigationType from '../../Navigation/propTypes';
import { Dashboard } from '../dashboard'

export class ProfileV1 extends React.Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };
  static navigationOptions = {
    title: 'User Profile'.toUpperCase(),
  };

  state = {
    data: undefined,
  };

  constructor(props) {
    super(props);
    const id = this.props.navigation.getParam('id', 1);
    this.state.data = data.getUser(id);
  }

  render = () => (
    <ScrollView style={styles.root}>
      <TouchableOpacity style={[styles.header, styles.bordered]} onPress={() => this.props.navigation.navigate('Settings')}>
        <Avatar img={this.state.data.photo} rkType='big'/>
        <RkText rkType='header2'>{`${this.state.data.firstName} ${this.state.data.lastName}`}</RkText>
      </TouchableOpacity>
      <View style={[styles.userInfo, styles.bordered]}>
        <View style={styles.section}>
          <RkText rkType='header3' style={styles.space}>{this.state.data.postCount}</RkText>
          <RkText rkType='secondary1 hintColor'>Posts</RkText>
        </View>
        <View style={styles.section}>
          <RkText rkType='header3' style={styles.space}>{formatNumber(this.state.data.followersCount)}</RkText>
          <RkText rkType='secondary1 hintColor'>Followers</RkText>
        </View>
        <View style={styles.section}>
          <RkText rkType='header3' style={styles.space}>{this.state.data.followingCount}</RkText>
          <RkText rkType='secondary1 hintColor'>Following</RkText>
        </View>
      </View>
      <View style={styles.buttons}>
        <RkButton style={styles.button} rkType='clear link'>FOLLOW</RkButton>
        <View style={styles.separator} />
        <RkButton style={styles.button} rkType='clear link'>MESSAGE</RkButton>
      </View>
      {/*<Gallery items={this.state.data.images} />*/}
      <Dashboard />
    </ScrollView>
  );
}

const styles = RkStyleSheet.create(theme => ({
  root: {
    backgroundColor: theme.colors.screen.base,
  },
  header: {
    alignItems: 'center',
    paddingTop: 25,
    paddingBottom: 17,
  },
  userInfo: {
    flexDirection: 'row',
    paddingVertical: 18,
  },
  bordered: {
    borderBottomWidth: 1,
    borderColor: theme.colors.border.base,
  },
  section: {
    flex: 1,
    alignItems: 'center',
  },
  space: {
    marginBottom: 3,
  },
  separator: {
    backgroundColor: theme.colors.border.base,
    alignSelf: 'center',
    flexDirection: 'row',
    flex: 0,
    width: 1,
    height: 42,
  },
  buttons: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  button: {
    flex: 1,
    alignSelf: 'center',
  },
}));
