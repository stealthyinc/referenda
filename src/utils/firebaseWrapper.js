const firebase = require('firebase/app')
require ('firebase/auth')
require ('firebase/database')
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
}

class FirebaseWrapper {
  constructor () {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig)
    }
  }
  getUserId () {
    return this.user.uid
  }
  async loadUser () {
    this.user = undefined
    if (!firebase.auth().currentUser) {
      await firebase.auth().signInAnonymously()
      .then(() => {
        this.user = firebase.auth().currentUser;
      });
    }
    else {
      this.user = firebase.auth().currentUser;
    }
  }
  snapshotNumber (value) {
    return this.snapshot.child(value).numChildren()
  }
  snapshotExists (value) {
    return this.snapshot.child(value).exists()
  }
  getSnapshotValue (value) {
    return this.snapshot.child(value).val()
  }
  async loadSnapshot () {
    this.snapshot = await firebase.database().ref('/global/webapp/')
    .once('value')
    .then(function(snapshot) {
      return snapshot
    });
  }
  starPost(campaignName, postId, uid) {
    const path = '/global/webapp/' + campaignName + '/' + postId + '/' + uid
    return firebase.database().ref(path).set({like: true});
  }
  unstarPost(campaignName, postId, uid) {
    const path = '/global/webapp/' + campaignName + '/' + postId + '/' + uid
    return firebase.database().ref(path).remove();
  }
}

// Singleton global of our firebase wrapper. Must appear after the class definition above.
//
export var firebaseInstance = new FirebaseWrapper()
