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
import { AppRoutes } from '../Navigation/RoutesBuilder'
import { SplashScreen } from '../Screens'
import { withRkTheme } from 'react-native-ui-kitten'
import Transition from './Transitions'
import AgeScreen from '../Containers/AgeScreen'
import TelephoneScreen from '../Containers/TelephoneScreen'
import NameScreen from '../Containers/NameScreen'
import LoginScreen from '../Containers/LoginScreen'
import KeychainScreen from '../Containers/KeychainScreen'
// import CampaignChoiceScreen from '../Components/CampaignChoiceScreen'
import IntroductionScreen from '../Components/IntroductionScreen'
import ScratchScreen from '../Components/ScratchScreen'

import styles from './Styles/NavigationStyles'
import Settings from '../Containers/SettingScreen'

// Manifest of possible screens
export default createAppContainer(
  createStackNavigator({
    First: {
      screen: SplashScreen
    },
    // First: {
    //   screen: ScratchScreen
    // },
    // CampaignChoice: {
    //   screen: CampaignChoiceScreen
    // },
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
