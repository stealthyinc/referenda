import _ from 'lodash';
import { FontIcons } from '../assets/icons';
import * as Screens from '../screens/index';
import CameraRollScreen from '../containers/CameraRollScreen'
import ArticleInputScreen from '../containers/ArticleInputScreen'
import ChatScreen from '../containers/ChatScreen'
import FeedScreen from '../containers/FeedScreen'
import CameraScreen from '../containers/CameraScreen'
import CardsScreen from '../containers/CardsScreen'
// import CampaignerScreen from '../containers/CampaignerScreen'
import CampaignerMenuScreen from '../containers/CampaignerMenuScreen'
import CampaignerProgressScreen from '../containers/CampaignerProgressScreen'
import CalendarScreen from '../containers/CalendarScreen'
import CombinedScreen from '../containers/CombinedScreen'
import AuthLoadingScreen from '../containers/AuthLoadingScreen'
import VideoScreen from '../containers/VideoScreen'
import DonatorInfoScreen from '../containers/DonatorInfoScreen'
import DonatorNameScreen from '../containers/DonatorNameScreen'
import DonatorAmountScreen from '../containers/DonatorAmountScreen'
import DonatorOtherAmountScreen from '../containers/DonatorOtherAmountScreen'
import ChargeScreen from '../containers/ChargeScreen'
import DonationCompleteScreen from '../containers/DonationCompleteScreen'
import Settings from '../containers/SettingScreen'

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
    screen: CampaignerMenuScreen,
    children: [
      {
        id: 'Donator Amount',
        title: 'Donator Amount',
        screen: DonatorAmountScreen,
        children: [],
      },
      {
        id: 'Donator Other Amount',
        title: 'Donator Other Amount',
        screen: DonatorOtherAmountScreen,
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
      {
        id: 'Donation Complete',
        title: 'Donation Complete',
        screen: DonationCompleteScreen,
        children: [],
      },
      {
        id: 'Campaign Progress',
        title: 'Campaign Progress',
        screen: CampaignerProgressScreen,
        children: [],
      },
    ],
  },
];

export const WebRoutes = {
  Home: {
    component: Screens.GridV2,
    path: "/",
    exact: true
  },
  NavigationMenu: {
    component: Screens.NavigationMenu,
    path: "/navigationMenu"
  },
  List: {
    component: Screens.ListMenu,
    path: "/listMenu"
  },
  Side: {
    component: Screens.SideMenu,
    path: "/sideMenu"
  },
  OtherMenu: {
    component: Screens.OtherMenu,
    path: "/otherMenu"
  },
  Settings: {
    component: Screens.Settings,
    path: "/settings"
  },
  Themes: {
    component: Screens.Themes,
    path: "/themes"
  },
  GridV2: {
    component: Screens.GridV2,
    path: "/gridV2"
  },
  GridV1: {
    component: Screens.GridV1,
    path: "/gridV1"
  },
  EcommerceMenu: {
    component: Screens.EcommerceMenu,
    path: "/ecommerceMenu"
  },
  Cards: {
    component: Screens.Cards,
    path: "/cards"
  },
  AddToCardForm: {
    component: Screens.AddToCardForm,
    path: "/addToCardForm"
  },
  WalkthroughMenu: {
    component: Screens.WalkthroughMenu,
    path: "/walkthroughMenu"
  },
  Walkthrough: {
    component: Screens.WalkthroughScreen,
    path: "/walkthrough"
  },
  Dashboards: {
    component: Screens.DashboardsMenu,
    path: "/dashboardsMenu"
  },
  Dashboard: {
    component: Screens.Dashboard,
    path: "/dashboard"
  },
  MessagingMenu: {
    component: Screens.MessagingMenu,
    path: "/messagingMenu"
  },
  Chat: {
    component: Screens.Chat,
    path: "/chat"
  },
  ChatList: {
    component: Screens.ChatList,
    path: "/chatList"
  },
  Comments: {
    component: Screens.Comments,
    path: "/comments"
  },
  ArticlesMenu: {
    component: Screens.ArticleMenu,
    path: "/articleMenu"
  },
  Articles1: {
    component: Screens.Articles1,
    path: "/article1"
  },
  Articles2: {
    component: Screens.Articles2,
    path: "/article2"
  },
  Articles3: {
    component: Screens.Articles3,
    path: "/article3"
  },
  Articles4: {
    component: Screens.Articles4,
    path: "/article4"
  },
  Blogposts: {
    component: Screens.Blogposts,
    path: "/blogposts"
  },
  Article: {
    component: Screens.Article,
    path: "/article"
  },
  SocialMenu: {
    component: Screens.SocialMenu,
    path: "/socialmenu"
  },
  ProfileV1: {
    component: Screens.ProfileV1,
    path: "/profileV1"
  },
  ProfileV2: {
    component: Screens.ProfileV2,
    path: "/profileV2"
  },
  ProfileV3: {
    component: Screens.ProfileV3,
    path: "/profileV3"
  },
  ProfileSettings: {
    component: Screens.ProfileSettings,
    path: "/profileSettings"
  },
  Notifications: {
    component: Screens.Notifications,
    path: "/notifications"
  },
  Contacts: {
    component: Screens.Contacts,
    path: "/contacts"
  },
  Feed: {
    component: Screens.Feed,
    path: "/feed"
  },
};

export const MenuRoutes = MainRoutes;
