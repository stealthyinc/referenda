import React from 'react'
import {
  TouchableOpacity,
  Image } from 'react-native'
import NavigationType from '../Navigation/propTypes';

export const avatarArr = {
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

export const requireNavBar = { navigation: NavigationType.isRequired }

const { userTypeInstance } = require('../Utils/UserType.js')
const randomAvatar = (userTypeInstance.getUserType()) ? avatarArr[Math.floor(Math.random() * Math.floor(12))] : require('../Data/img/avatars/agatha.png')

export const getNoHeaderNavOptions = () => {
  return (
    ({navigation}) => {
      return {
        header: null,
        gesturesEnabled: false
      }
    }
  )
}

export const getNavOptions = (pageName='', leftHeader=true) => {
  return (
    ({navigation}) => {
      const params = navigation.state.params || {}
      let headerTitle = pageName

      if (pageName === 'Contribution') {
        // See if we set the state to change it to the voter's name:
        try {
          headerTitle = navigation.state.params.contributionHeaderTitle || pageName
        } catch (suppressedError) {}
      }

      const navBar = {
        headerTitle: headerTitle.toUpperCase(),
        headerBackTitle: 'Back',
        headerTintColor: 'black',
        gesturesEnabled: false,
      }
      if (leftHeader) {
        navBar.headerLeft = (
          <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{marginLeft: 10}}>
            <Image
              source={randomAvatar}
              style={{height: 30, width: 30, borderRadius: 15}}/>
          </TouchableOpacity>
        )
      }

      return navBar
    }
  )
}
