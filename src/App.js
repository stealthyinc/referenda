import React from 'react';
import { View } from 'react-native';
import WebRoutesGenerator from './config/navigation/webRouteWrapper';
import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/database";
import FeedContainer from './containers/FeedContainer'
// import ArticleContainer from './containers/ArticleContainer'
// import { bootstrap } from './config/bootstrap';
// import { data } from './data';
// bootstrap();
// data.populateData();

// -  apiKey: Config.FIREBASE_API_KEY,
// -  authDomain: Config.FIREBASE_AUTH_DOMAIN,
// -  databaseURL: Config.FIREBASE_DATABASE_URL,
// -  projectId: Config.FIREBASE_PROJECT_ID,
// -  storageBucket: Config.FIREBASE_STORAGE_BUCKET,
// -  messagingSenderId: Config.FIREBASE_MESSAGING_SENDER_ID,
// -  appId: Config.FIREBASE_APP_ID

// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//   databaseURL: process.env.FIREBASE_DATABASE_URL,
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.FIREBASE_APP_ID
// }

// // Initialize Firebase
// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }

export const WebRoutes = {
  Home: {
    component: FeedContainer,
    path: "/",
    exact: true
  },
  // Article: {
  //   component: ArticleContainer,
  //   path: "/article"
  // },
  Feed: {
    component: FeedContainer,
    path: "/feed"
  },
}

export default class App extends React.Component {
  render = () => (
    <View style={{flex: 1, flexDirection: 'row'}}>
      <View style={{flex: 0.1}} />
      <View style={{flex: 0.8}}>
        {WebRoutesGenerator({ routeMap: WebRoutes })}
      </View>
      <View style={{flex: 0.1}} />
    </View>
  )
}