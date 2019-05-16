import React from 'react'
import {
  createStackNavigator,
  createAppContainer,
  createBottomTabNavigator,
  TabBarBottom,
  createSwitchNavigator,
  createDrawerNavigator
} from 'react-navigation'

import Ionicons from 'react-native-vector-icons/Ionicons'
import { AppRoutes } from '../navigation/RoutesBuilder'
import { SplashScreen } from '../screens'
import { withRkTheme } from 'react-native-ui-kitten'
import Transition from './transitions'
import AgeScreen from '../containers/AgeScreen'
import TelephoneScreen from '../containers/TelephoneScreen'
import NameScreen from '../containers/NameScreen'
import LoginScreen from '../containers/LoginScreen'
import KeychainScreen from '../containers/KeychainScreen'
import IntroductionScreen from '../components/IntroductionScreen'

import styles from '../styles/NavigationStyles'
import Settings from '../containers/SettingScreen'

// Manifest of possible screens
export default createAppContainer(
  createStackNavigator({
    First: {
      screen: SplashScreen
    },
    LoginMenu: {
      screen: IntroductionScreen
    },
    Login: {
      screen: LoginScreen,
    },
    Telephone: {
      screen: TelephoneScreen
    },
    Name: {
      screen: NameScreen
    },
    Age: {
      screen: AgeScreen
    },
    Keychain: {
      screen: KeychainScreen
    },
    Home: {
      screen: createDrawerNavigator(
        {
          ...AppRoutes
        },
        {
            contentComponent: (props) => {
              const SideMenu = withRkTheme(Settings)
              return <SideMenu {...props} />
            },
          }
        )
      }
    }, {
      // Default config for all screens
      headerMode: 'none',
      navigationOptions: {
        headerStyle: styles.header
      }
    })
)
