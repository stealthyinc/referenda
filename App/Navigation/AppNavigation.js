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

import styles from './Styles/NavigationStyles'
import Settings from '../Containers/SettingScreen'

// Manifest of possible screens
export default createAppContainer(
  createStackNavigator({
    First: {
      screen: SplashScreen
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
