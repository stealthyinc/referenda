import _ from 'lodash';
import { FontIcons, FontAwesome } from '../Assets/icons';
import * as Screens from '../Screens/index';
import CameraRollScreen from '../Containers/CameraRollScreen'
import ArticleInputScreen from '../Containers/ArticleInputScreen'
import ChatScreen from '../Containers/ChatScreen'
import FeedScreen from '../Containers/FeedScreen'
import LeaderScreen from '../Containers/LeaderScreen'
import AnalyticsScreen from '../Containers/AnalyticsScreen'
import CameraScreen from '../Containers/CameraScreen'
import CardsScreen from '../Containers/CardsScreen'
// import CampaignerScreen from '../Containers/CampaignerScreen'
import CampaignerMenuScreen from '../Containers/CampaignerMenuScreen'
import CampaignerProgressScreen from '../Containers/CampaignerProgressScreen'
import CalendarScreen from '../Containers/CalendarScreen'
import CombinedScreen from '../Containers/CombinedScreen'
import AuthLoadingScreen from '../Containers/AuthLoadingScreen'
import VideoScreen from '../Containers/VideoScreen'
import DonatorInfoScreen from '../Containers/DonatorInfoScreen'
import DonatorNameScreen from '../Containers/DonatorNameScreen'
import DonatorAmountScreen from '../Containers/DonatorAmountScreen'
import DonatorOtherAmountScreen from '../Containers/DonatorOtherAmountScreen'
import ChargeScreen from '../Containers/ChargeScreen'
import DonationCompleteScreen from '../Containers/DonationCompleteScreen'
import Settings from '../Containers/SettingScreen'
import CanvasContacts from '../Containers/CanvasContacts'
import CanvasConstituentSearch from '../Containers/CanvasConstituentSearch'
import CanvasConstituentSearchResults from '../Containers/CanvasConstituentSearchResults'
import CanvasConstituentQuestionaire from '../Containers/CanvasConstituentQuestionaire'
import CanvasConstituentContribution from '../Containers/CanvasConstituentContribution'



export const MainRoutes = [
  {
    id: 'Analytics',
    level: 2,
    title: 'Analytics',
    icon: FontIcons.dashboard,
    screen: AnalyticsScreen,
    children: []
  },
  {
    id: 'LeaderScreen',
    level: 2,
    title: 'Leader Board',
    icon: FontIcons.addToCardForm,
    screen: LeaderScreen,
    children: []
  },
  {
    id: 'SocialCanvasMenu',
    level: 1,
    title: 'Social Canvassing',
    icon: FontIcons.profile,
    screen: CanvasConstituentSearch,
    children: [],
  },
  {
    id: 'CanvasMenu',
    level: 1,
    title: 'Street Canvassing',
    icon: FontIcons.navigation,
    screen: CanvasConstituentSearch,
    // screen: CanvasConstituentContribution,
    children: [
      {
        id: 'Constituent Search Results',
        title: 'Constituent Search Results',
        screen: CanvasConstituentSearchResults,
        children: [],
      },
      {
        id: 'Constituent Contribution',
        title: 'Constituent Contribution',
        screen: CanvasConstituentContribution,
        children: [],
      },
      {
        id: 'Constituent Questionaire',
        title: 'Constituent Questionaire',
        screen: CanvasConstituentQuestionaire,
        children: [],
      },
      // TODO: find out what PBJ was thinking here
      {
        id: 'Contact Search',
        title: 'Contact Search',
        screen: CanvasContacts,
        children: [],
      },
    ],
  },
  {
    id: 'CampaignerMenu',
    level: 0,
    title: 'Fundraising',
    icon: FontIcons.card,
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
  {
    id: 'SocialMenu',
    level: 0,
    title: 'Campaign News',
    icon: FontIcons.article,
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
];

let menuRoutes = _.cloneDeep(MainRoutes);
menuRoutes.unshift({
  id: 'Start',
  title: 'Start',
  screen: CombinedScreen,
  children: []
},);

export const MenuRoutes = menuRoutes;
