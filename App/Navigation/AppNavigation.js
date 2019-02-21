import React from 'react'
import { createDrawerNavigator, createBottomTabNavigator, TabBarBottom, createSwitchNavigator } from 'react-navigation'
import { createStackNavigator, createAppContainer } from 'react-navigation'
import CameraScreen from '../Containers/CameraScreen'
import VideoScreen from '../Containers/VideoScreen'

import Ionicons from 'react-native-vector-icons/Ionicons'
import { AppRoutes } from '../Navigation/RoutesBuilder'
import * as Screens from '../Screens'
import { withRkTheme } from 'react-native-ui-kitten'
import Transition from './Transitions';

import styles from './Styles/NavigationStyles'

// Manifest of possible screens
// const PrimaryNav = createStackNavigator({
//   First: {
//     screen: Screens.SplashScreen,
//   },
//   Home: {
//     screen: createDrawerNavigator(
//       {
//         ...AppRoutes,
//       },
//       {
//         contentComponent: (props) => {
//           const SideMenu = withRkTheme(Screens.SideMenu);
//           return <SideMenu {...props} />;
//         },
//       },
//     ),
//   },
// }, {
//   // Default config for all screens
//   headerMode: 'none',
//   initialRouteName: '',
//   navigationOptions: {
//     headerStyle: styles.header
//   }
// })

const AuthNav = createStackNavigator({
  First: {
    screen: Screens.SplashScreen
  },
  Home: {
    screen: Screens.LoginV2
  },
  SignUp: {
    screen: Screens.SignUp
  }
}, {
  initialRouteName: '',
  navigationOptions: {
    headerStyle: styles.header
  }
})

const FeedNav = createStackNavigator({
  Home: {
    screen: Screens.Blogposts
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
      let iconName = `ios-paper`
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
      let iconName = `ios-chatboxes`
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

const CameraNav = createStackNavigator({
  Home: {
    screen: CameraScreen
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
      let iconName = `ios-camera`
      return <Ionicons name={iconName} size={30} color={tintColor} />
    },
    headerStyle: styles.header
  }),
})

const TabNav = createBottomTabNavigator({
  Feed: FeedNav,
  Camera: CameraNav,
  Notifications: NotificationNav,
  Messages: MessageNav
}, {
  tabBarOptions: {
    activeTintColor: '#34bbed',
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
      Auth: AuthNav,
      Tab: TabNav
    }, 
    {
      headerMode: 'none',
      initialRouteName: 'Auth',
      navigationOptions: {
        headerStyle: styles.header
      }
    }
  )
)
