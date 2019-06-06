import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import {
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  RkText,
  RkStyleSheet,
  RkTheme,
} from 'react-native-ui-kitten';
import {
  RkSwitch,
  FindFriends,
} from '../Components';
import { FontAwesome } from '../Assets/icons';
import { FontIcons } from '../Assets/icons';
import { connect } from 'react-redux'
import { SettingsSelectors } from '../Redux/SettingsRedux'
const { userTypeInstance } = require('../Utils/UserType.js')

class SettingScreen extends Component {
  static navigationOptions = {
    header: null
  }
  state = {
    sendPush: true,
    shouldRefresh: false,
    twitterEnabled: true,
    googleEnabled: true,
    facebookEnabled: true,
  };

  onPushNotificationsSettingChanged = (value) => {
    this.setState({ sendPush: value });
  };

  onRefreshAutomaticallySettingChanged = (value) => {
    this.setState({ shouldRefresh: value });
  };

  onFindFriendsTwitterButtonPressed = () => {
    this.setState({ twitterEnabled: !this.state.twitterEnabled });
  };

  onFindFriendsGoogleButtonPressed = () => {
    this.setState({ googleEnabled: !this.state.googleEnabled });
  };

  onFindFriendsFacebookButtonPressed = () => {
    this.setState({ facebookEnabled: !this.state.facebookEnabled });
  };

  logout () {
    // this.props.dispatch(SettingsActions.settingsMenuToggle())
    // this.props.dispatch({ type: 'Navigation/NAVIGATE', routeName: 'Auth' })
    this.props.navigation.navigate('LoginMenu')
  }

  render = () => (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        {(!userTypeInstance.getUserType()) ? (null) : (<View style={styles.section}>
          <View style={[styles.row, styles.heading]}>
            <RkText rkType='primary header6'>CAMPAIGN FEATURES</RkText>
          </View>
          <View style={styles.row}>
            <FindFriends
              color={RkTheme.current.colors.twitter}
              text='Collect Donations'
              icon={FontAwesome.dollar}
              selected={this.state.twitterEnabled}
              onPress={() => this.props.navigation.navigate('CampaignerMenu')}
            />
          </View>
          <View style={styles.row}>
            <FindFriends
              color={RkTheme.current.colors.google}
              text='Campaign Feed'
              icon={FontIcons.newsPaper}
              selected={this.state.googleEnabled}
              onPress={() => this.props.navigation.navigate('SocialMenu')}
            />
          </View>
          <View style={styles.row}>
            <FindFriends
              color={RkTheme.current.colors.facebook}
              text='Social Canvass'
              icon={FontAwesome.register}
              selected={this.state.facebookEnabled}
              onPress={() => this.props.navigation.navigate('CanvasMenu')}
            />
          </View>
        </View>)}
        <View style={[styles.row, styles.heading]}>
          <RkText rkType='primary header6'>PROFILE SETTINGS</RkText>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.rowButton}>
            <RkText rkType='header6'>Edit Profile</RkText>
          </TouchableOpacity>
        </View>
        {(!userTypeInstance.getUserType()) ? (<View style={styles.row}>
          <FindFriends
            color={RkTheme.current.colors.google}
            text='Political Memberships'
            icon={FontAwesome.token}
            selected={this.state.googleEnabled}
            onPress={() => this.props.navigation.navigate('Cards')}
          />
        </View>) : null}
        {/*<View style={styles.row}>
          <TouchableOpacity style={styles.rowButton}>
            <RkText rkType='header6'>Change Password</RkText>
          </TouchableOpacity>
        </View>*/}
        <View style={styles.row}>
          <RkText rkType='header6'>Send Push Notifications</RkText>
          <RkSwitch
            style={styles.switch}
            value={this.state.sendPush}
            name="Push"
            onValueChange={this.onPushNotificationsSettingChanged}
          />
        </View>
        {/*<View style={styles.row}>
          <RkText rkType='header6'>Refresh Automatically</RkText>
          <RkSwitch
            style={styles.switch}
            value={this.state.shouldRefresh}
            name="Refresh"
            onValueChange={this.onRefreshAutomaticallySettingChanged}
          />
        </View>*/}
      </View>
      {(!userTypeInstance.getUserType()) ? (<View style={styles.section}>
        <View style={[styles.row, styles.heading]}>
          <RkText rkType='primary header6'>SOCIAL INTEGRATIONS</RkText>
        </View>
        <View style={styles.row}>
          <FindFriends
            color={RkTheme.current.colors.twitter}
            text='Find friends on Twitter'
            icon={FontAwesome.twitter}
            selected={this.state.twitterEnabled}
            onPress={this.onFindFriendsTwitterButtonPressed}
          />
        </View>
        {/*<View style={styles.row}>
          <FindFriends
            color={RkTheme.current.colors.google}
            text='Find friends on Google'
            icon={FontAwesome.google}
            selected={this.state.googleEnabled}
            onPress={this.onFindFriendsGoogleButtonPressed}
          />
        </View>*/}
        <View style={styles.row}>
          <FindFriends
            color={RkTheme.current.colors.facebook}
            text='Find friends on Facebook'
            icon={FontAwesome.facebook}
            selected={this.state.facebookEnabled}
            onPress={this.onFindFriendsFacebookButtonPressed}
          />
        </View>
      </View>) : null}
      <View style={styles.section}>
        <View style={[styles.row, styles.heading]}>
          <RkText rkType='primary header6'>SUPPORT</RkText>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.rowButton}>
            <RkText rkType='header6'>Help</RkText>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.rowButton}>
            <RkText rkType='header6'>Privacy Policy</RkText>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.rowButton}>
            <RkText rkType='header6'>Terms & Conditions</RkText>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.rowButton} onPress={() => this.logout()}>
            <RkText rkType='header6'>Logout</RkText>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = RkStyleSheet.create(theme => ({
  container: {
    backgroundColor: theme.colors.screen.base,
    paddingTop: 40
  },
  header: {
    paddingVertical: 25,
  },
  section: {
    marginVertical: 25,
  },
  heading: {
    paddingBottom: 12.5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 17.5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border.base,
    alignItems: 'center',
  },
  rowButton: {
    flex: 1,
    paddingVertical: 24,
  },
  switch: {
    marginVertical: 14,
  },
}));

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingScreen)
