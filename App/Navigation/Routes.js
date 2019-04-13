import _ from 'lodash';
import { FontIcons } from '../Assets/icons';
import * as Screens from '../Screens/index';
import CameraRollScreen from '../Containers/CameraRollScreen'
import ArticleInputScreen from '../Containers/ArticleInputScreen'
import ChatScreen from '../Containers/ChatScreen'
//import AgeScreen from '../Containers/AgeScreen'
//import TelephoneScreen from '../Containers/TelephoneScreen'
//import NameScreen from '../Containers/NameScreen'
//import LoginScreen from '../Containers/LoginScreen'
import FeedScreen from '../Containers/FeedScreen'
import CameraScreen from '../Containers/CameraScreen'
import CardsScreen from '../Containers/CardsScreen'
import CampaignerScreen from '../Containers/CampaignerScreen'
import CalendarScreen from '../Containers/CalendarScreen'
import CombinedScreen from '../Containers/CombinedScreen'
import AuthLoadingScreen from '../Containers/AuthLoadingScreen'
import VideoScreen from '../Containers/VideoScreen'
import DonatorInfoScreen from '../Containers/DonatorInfoScreen'
import DonatorNameScreen from '../Containers/DonatorNameScreen'
import DonatorAmountScreen from '../Containers/DonatorAmountScreen'
import ChargeScreen from '../Containers/ChargeScreen'
import Settings from '../Containers/SettingScreen'

export const MainRoutes = [
  {
    id: 'Start',
    title: 'Start',
    screen: CombinedScreen,
    children: [],
  },
  {
    id: 'SocialMenu',
    title: 'Social',
    icon: FontIcons.profile,
    screen: FeedScreen,
    children: [
      {
        id: 'Article',
        title: 'Article',
        screen: Screens.Article,
        children: [],
      },
      {
        id: 'Profile',
        title: 'User Profile',
        screen: Screens.ProfileV1,
        children: [],
      },
      {
        id: 'Comments',
        title: 'Comments',
        screen: Screens.Comments,
        children: [],
      },
      {
        id: 'ProfileSettings',
        title: 'Profile Settings',
        screen: Screens.ProfileSettings,
        children: [],
      },
      {
        id: 'Notifications',
        title: 'Notifications',
        screen: Screens.Notifications,
        children: [],
      },
      {
        id: 'Contacts',
        title: 'Contacts',
        screen: Screens.Contacts,
        children: [],
      },
      {
        id: 'Chat',
        title: 'Chat',
        screen: Screens.Chat,
        children: [],
      },
      {
        id: 'ChatList',
        title: 'ChatList',
        screen: Screens.ChatList,
        children: [],
      },
      {
        id: 'CameraRoll',
        title: 'CameraRoll',
        screen: CameraRollScreen,
        children: [],
      },
      {
        id: 'Camera',
        title: 'Camera',
        screen: CameraScreen,
        children: [],
      },
      {
        id: 'Calendar',
        title: 'Calendar',
        screen: CalendarScreen,
        children: [],
      },
      {
        id: 'Cards',
        title: 'Cards',
        screen: CardsScreen,
        children: [],
      },
    ],
  },
  {
    id: 'CampaignerMenu',
    title: 'Campaigner',
    icon: FontIcons.other,
    screen: CampaignerScreen,
    children: [
      {
        id: 'Donator Amount',
        title: 'Donator Amount',
        screen: DonatorAmountScreen,
        children: [],
      },
      {
        id: 'Donator Info',
        title: 'Donator Info',
        screen: DonatorInfoScreen,
        children: [],
      },
      {
        id: 'Donator Name',
        title: 'Donator Name',
        screen: DonatorNameScreen,
        children: [],
      },
      {
        id: 'Donation',
        title: 'Donation',
        screen: ChargeScreen,
        children: [],
      },
    ],
  },
];

export const MenuRoutes = MainRoutes;
