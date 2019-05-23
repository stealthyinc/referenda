import React from 'react';
import { View } from 'react-native';
import WebRoutesGenerator from './config/navigation/webRouteWrapper';
import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/database";
import FeedContainer from './containers/FeedContainer'
import ArticleContainer from './containers/ArticleContainer'
import { isMobile } from "react-device-detect"
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
}

// // Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const WebRoutes = {
  Home: {
    component: FeedContainer,
    path: ["/", "/:campaignName"],
    exact: true
  },
  Article: {
    component: ArticleContainer,
    path: "/article"
  }
}

export default class App extends React.Component {
  render = () => {
    return (
      <View>
        {WebRoutesGenerator({ routeMap: WebRoutes })}
      </View>
    )
  }
}
