import React from 'react';
import { View } from 'react-native';
import WebRoutesGenerator from './config/navigation/webRouteWrapper';
import { AppRoutes } from './config/navigation/routesBuilder';
import { WebRoutes } from './config/navigation/routes';
import { bootstrap } from './config/bootstrap';
import { data } from './data';
import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/database";
import Config from 'react-native-config'

// console.log("CONFIG", Config.FIREBASE_API_KEY)

// const firebaseConfig = {
//   apiKey: Config.FIREBASE_API_KEY,
//   authDomain: Config.FIREBASE_AUTH_DOMAIN,
//   databaseURL: Config.FIREBASE_DATABASE_URL,
//   projectId: Config.FIREBASE_PROJECT_ID,
//   storageBucket: Config.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: Config.FIREBASE_MESSAGING_SENDER_ID,
//   appId: Config.FIREBASE_APP_ID
// };

bootstrap();
data.populateData();

// Initialize Firebase
// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }

class App extends React.Component {
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

let hotWrapper = () => () => App;
const { hot } = require('react-hot-loader');
hotWrapper = hot;

export default hotWrapper(module)(App);