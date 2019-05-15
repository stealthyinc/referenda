import _ from 'lodash';
import { FontIcons } from '../../assets/icons';
import * as Screens from '../../screens/index';

export const MainRoutes = [
  {
    id: 'LoginMenu',
    title: 'Auth',
    icon: FontIcons.login,
    screen: Screens.LoginMenu,
    component: Screens.LoginMenu,
    children: [
      {
        id: 'Login1',
        title: 'Login V1',
        screen: Screens.LoginV1,
        component: Screens.LoginV1,
        children: [],
      },
      {
        id: 'Login2',
        title: 'Login V2',
        screen: Screens.LoginV2,
        component: Screens.LoginV2,
        children: [],
      },
      {
        id: 'SignUp',
        title: 'Sign Up',
        screen: Screens.SignUp,
        component: Screens.SignUp,
        children: [],
      },
      {
        id: 'password',
        title: 'Password Recovery',
        screen: Screens.PasswordRecovery,
        component: Screens.PasswordRecovery,
        children: [],
      },
    ],
  },
  {
    id: 'SocialMenu',
    title: 'Social',
    icon: FontIcons.profile,
    screen: Screens.SocialMenu,
    component: Screens.SocialMenu,
    children: [
      {
        id: 'ProfileV1',
        title: 'User Profile V1',
        screen: Screens.ProfileV1,
        component: Screens.ProfileV1,
        children: [],
      },
      {
        id: 'ProfileV2',
        title: 'User Profile V2',
        screen: Screens.ProfileV2,
        component: Screens.ProfileV2,
        children: [],
      },
      {
        id: 'ProfileV3',
        title: 'User Profile V3',
        screen: Screens.ProfileV3,
        component: Screens.ProfileV3,
        children: [],
      },
      {
        id: 'ProfileSettings',
        title: 'Profile Settings',
        screen: Screens.ProfileSettings,
        component: Screens.ProfileSettings,
        children: [],
      },
      {
        id: 'Notifications',
        title: 'Notifications',
        screen: Screens.Notifications,
        component: Screens.Notifications,
        children: [],
      },
      {
        id: 'Contacts',
        title: 'Contacts',
        screen: Screens.Contacts,
        component: Screens.Contacts,
        children: [],
      },
      {
        id: 'Feed',
        title: 'Feed',
        screen: Screens.Feed,
        component: Screens.Feed,
        children: [],
      },
    ],
  },
  {
    id: 'ArticlesMenu',
    title: 'Articles',
    icon: FontIcons.article,
    screen: Screens.ArticleMenu,
    component: Screens.ArticleMenu,
    children: [
      {
        id: 'Articles1',
        title: 'Article List V1',
        screen: Screens.Articles1,
        component: Screens.Articles1,
        children: [],
      },
      {
        id: 'Articles2',
        title: 'Article List V2',
        screen: Screens.Articles2,
        component: Screens.Articles2,
        children: [],
      },
      {
        id: 'Articles3',
        title: 'Article List V3',
        screen: Screens.Articles3,
        component: Screens.Articles3,
        children: [],
      },
      {
        id: 'Articles4',
        title: 'Article List V4',
        screen: Screens.Articles4,
        component: Screens.Articles4,
        children: [],
      },
      {
        id: 'Blogposts',
        title: 'Blogposts',
        screen: Screens.Blogposts,
        component: Screens.Blogposts,
        children: [],
      },
      {
        id: 'Article',
        title: 'Article View',
        screen: Screens.Article,
        component: Screens.Article,
        children: [],
      },
    ],
  },
  {
    id: 'MessagingMenu',
    title: 'Messaging',
    icon: FontIcons.mail,
    screen: Screens.MessagingMenu,
    component: Screens.MessagingMenu,
    children: [
      {
        id: 'Chat',
        title: 'Chat',
        screen: Screens.Chat,
        component: Screens.Chat,
        children: [],
      },
      {
        id: 'ChatList',
        title: 'Chat List',
        screen: Screens.ChatList,
        component: Screens.ChatList,
        children: [],
      },
      {
        id: 'Comments',
        title: 'Comments',
        screen: Screens.Comments,
        component: Screens.Comments,
        children: [],
      },
    ],
  },
  {
    id: 'DashboardsMenu',
    title: 'Dashboards',
    icon: FontIcons.dashboard,
    screen: Screens.DashboardMenu,
    component: Screens.DashboardMenu,
    children: [{
      id: 'Dashboard',
      title: 'Dashboard',
      screen: Screens.Dashboard,
      component: Screens.Dashboard,
      children: [],
    }],
  },
  {
    id: 'WalkthroughMenu',
    title: 'Walkthroughs',
    icon: FontIcons.mobile,
    screen: Screens.WalkthroughMenu,
    component: Screens.WalkthroughMenu,
    children: [{
      id: 'Walkthrough',
      title: 'Walkthrough',
      screen: Screens.WalkthroughScreen,
      component: Screens.WalkthroughScreen,
      children: [],
    }],
  },
  {
    id: 'EcommerceMenu',
    title: 'Ecommerce',
    icon: FontIcons.card,
    screen: Screens.EcommerceMenu,
    component: Screens.EcommerceMenu,
    children: [
      {
        id: 'Cards',
        title: 'Cards',
        icon: FontIcons.card,
        screen: Screens.Cards,
        component: Screens.Cards,
        children: [],
      },
      {
        id: 'AddToCardForm',
        title: 'Add Card Form',
        icon: FontIcons.addToCardForm,
        screen: Screens.AddToCardForm,
        component: Screens.AddToCardForm,
        children: [],
      },

    ],
  },
  {
    id: 'NavigationMenu',
    icon: FontIcons.navigation,
    title: 'Navigation',
    screen: Screens.NavigationMenu,
    component: Screens.NavigationMenu,
    children: [
      {
        id: 'GridV1',
        title: 'Grid Menu V1',
        screen: Screens.GridV1,
        component: Screens.GridV1,
        children: [],
      },
      {
        id: 'GridV2',
        title: 'Grid Menu V2',
        screen: Screens.GridV2,
        component: Screens.GridV2,
        children: [],
      },
      {
        id: 'List',
        title: 'List Menu',
        screen: Screens.ListMenu,
        component: Screens.ListMenu,
        children: [],
      },
      {
        id: 'Side',
        title: 'Side Menu',
        action: 'DrawerOpen',
        screen: Screens.SideMenu,
        component: Screens.SideMenu,
        children: [],
      },
    ],
  },
  {
    id: 'OtherMenu',
    title: 'Other',
    icon: FontIcons.other,
    screen: Screens.OtherMenu,
    component: Screens.OtherMenu,
    children: [
      {
        id: 'Settings',
        title: 'Settings',
        screen: Screens.Settings,
        component: Screens.Settings,
        children: [],
      },
    ],
  },
  {
    id: 'Themes',
    title: 'Themes',
    icon: FontIcons.theme,
    screen: Screens.Themes,
    component: Screens.Themes,
    children: [],
  },
];

const menuRoutes = _.cloneDeep(MainRoutes);
menuRoutes.unshift({
  id: 'GridV2',
  title: 'Start',
  screen: Screens.GridV2,
  component: Screens.GridV2,
  children: [],
});

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

export const MenuRoutes = menuRoutes;
