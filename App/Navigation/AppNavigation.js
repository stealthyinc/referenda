import React from 'react'
import { createBottomTabNavigator, TabBarBottom, createSwitchNavigator } from 'react-navigation'
import { createStackNavigator, createAppContainer } from 'react-navigation'
import CameraRollScreen from '../Containers/CameraRollScreen'
import ArticleInputScreen from '../Containers/ArticleInputScreen'
import ChatScreen from '../Containers/ChatScreen'
import AgeScreen from '../Containers/AgeScreen'
import TelephoneScreen from '../Containers/TelephoneScreen'
import LoginScreen from '../Containers/LoginScreen'
import FeedScreen from '../Containers/FeedScreen'
import KeychainScreen from '../Containers/KeychainScreen'
import CameraScreen from '../Containers/CameraScreen'
import CalendarScreen from '../Containers/CalendarScreen'
import CombinedScreen from '../Containers/CombinedScreen'
import AuthLoadingScreen from '../Containers/AuthLoadingScreen'
import VideoScreen from '../Containers/VideoScreen'
import IntroductionScreen from '../Components/IntroductionScreen'

import Ionicons from 'react-native-vector-icons/Ionicons'
import { AppRoutes } from '../Navigation/RoutesBuilder'
import * as Screens from '../Screens'
import { withRkTheme } from 'react-native-ui-kitten'
import Transition from './Transitions';

import styles from './Styles/NavigationStyles'

const LoadNav = createStackNavigator({
  First: {
    screen: Screens.SplashScreen
  },
  Home: {
    screen: AuthLoadingScreen
  }
}, {
  initialRouteName: '',
  navigationOptions: {
    headerStyle: styles.header
  }
})

const AuthNav = createStackNavigator({
  Home: {
    screen: IntroductionScreen
  },
  Login: {
    screen: LoginScreen
  },
  Telephone: {
    screen: TelephoneScreen
  },
  Age: {
    screen: AgeScreen
  },
  Keychain: {
    screen: KeychainScreen
  }
}, {
  initialRouteName: '',
  navigationOptions: {
    headerStyle: styles.header
  }
})

const CalendarNav = createStackNavigator({
  Home: {
    screen: CalendarScreen
  }
}, {
  initialRouteName: '',
  headerMode: 'screen',
  cardStyle: { backgroundColor: 'transparent' },
  transitionConfig: Transition,
  navigationOptions: ({ navigation }) => ({
    gesturesEnabled: false,
    tabBarIcon: ({ focused, tintColor }) => {
      const { routeName } = navigation.state
      let iconName = `ios-calendar`
      return <Ionicons name={iconName} size={30} color={tintColor} />
    },
    headerStyle: styles.header
  }),
})

const FeedNav = createStackNavigator({
  Home: {
    screen: FeedScreen
  },
  Article: {
    screen: Screens.Article
  },
  Profile: {
    screen: Screens.ProfileV1
  },
  Comments: {
    screen: Screens.Comments
  },
  UserInfo: {
    screen: Screens.ProfileSettings
  },
  Create: {
    screen: ArticleInputScreen
  },
  CameraRoll: {
    screen: CameraRollScreen
  }
}, {
  initialRouteName: '',
  headerMode: 'screen',
  cardStyle: { backgroundColor: 'transparent' },
  transitionConfig: Transition,
  navigationOptions: ({ navigation }) => ({
    gesturesEnabled: false,
    tabBarIcon: ({ focused, tintColor }) => {
      const { routeName } = navigation.state
      let iconName = `ios-globe`
      return <Ionicons name={iconName} size={30} color={tintColor} />
    },
    headerStyle: styles.header
  }),
})

const MessageNav = createStackNavigator({
  Home: {
    screen: Screens.ChatList
  },
  ProfileV1: {
    screen: Screens.ProfileV1
  },
  Chat: {
    screen: Screens.Chat
  }
}, {
  initialRouteName: '',
  headerMode: 'screen',
  cardStyle: { backgroundColor: 'transparent' },
  transitionConfig: Transition,
  navigationOptions: ({ navigation }) => ({
    gesturesEnabled: false,
    tabBarIcon: ({ focused, tintColor }) => {
      const { routeName } = navigation.state
      let iconName = `ios-chatbubbles`
      return <Ionicons name={iconName} size={30} color={tintColor} />
    },
    headerStyle: styles.header
  }),
})

const NotificationNav = createStackNavigator({
  Home: {
    screen: Screens.Notifications
  }
}, {
  initialRouteName: '',
  headerMode: 'screen',
  cardStyle: { backgroundColor: 'transparent' },
  transitionConfig: Transition,
  navigationOptions: ({ navigation }) => ({
    gesturesEnabled: false,
    tabBarIcon: ({ focused, tintColor }) => {
      const { routeName } = navigation.state
      let iconName = `ios-notifications`
      return <Ionicons name={iconName} size={30} color={tintColor} />
    },
    headerStyle: styles.header
  }),
})

const CombinedNav = createStackNavigator({
  Home: {
    screen: CombinedScreen
  }
}, {
  initialRouteName: '',
  headerMode: 'screen',
  cardStyle: { backgroundColor: 'transparent' },
  transitionConfig: Transition,
  navigationOptions: ({ navigation }) => ({
    gesturesEnabled: false,
    tabBarIcon: ({ focused, tintColor }) => {
      const { routeName } = navigation.state
      let iconName = `ios-aperture`
      return <Ionicons name={iconName} size={30} color={tintColor} />
    },
  }),
})

const TabNav = createBottomTabNavigator({
  Feed: FeedNav,
  Events: CalendarNav,
  Combined: CombinedNav,
  Notifications: NotificationNav,
  Messages: MessageNav
}, {
  tabBarOptions: {
    activeTintColor: '#34bbed',
    showLabel: false,
    inactiveTintColor: 'gray'
  },
  tabBarComponent: TabBarBottom,
  tabBarPosition: 'bottom',
  animationEnabled: false,
  swipeEnabled: false
})

export default createAppContainer(
  createSwitchNavigator(
    {
      Load: LoadNav,
      Auth: AuthNav,
      App: TabNav
    }, 
    {
      headerMode: 'none',
      initialRouteName: 'Load',
      navigationOptions: {
        headerStyle: styles.header
      }
    }
  )
)
