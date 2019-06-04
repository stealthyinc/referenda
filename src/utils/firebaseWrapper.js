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
    this.loadUser()
  }
  setCampaignName(campaignName) {
    var newCampaignName = campaignName.replace(/\./g, '_');
    this.campaignName = newCampaignName
  }
  storeCampaignGaia(gaia, email) {
    const path = '/global/webapp/gaiaMap/' + this.campaignName
    return firebase.database().ref(path).set({url: gaia, email});
  }
  getUserId () {
    if (this.user)
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
  likesNumber (id) {
    const path = this.campaignName + '/likes/' + id
    return this.snapshot.child(path).numChildren()
  }
  postExists (id) {
    const path = this.campaignName + '/likes/' + id
    return this.snapshot.child(path).exists()
  }
  userLikeExists (id, uid) {
    const path = this.campaignName + '/likes/' + id + '/' + uid
    return this.snapshot.child(path).exists()
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
  viewPost(uid) {
    const path = '/global/webapp/' + this.campaignName + '/views/' + uid
    return firebase.database().ref(path).set({viewed: true});
  }
  clickPost(postId, uid) {
    const path = '/global/webapp/' + this.campaignName + '/clicks/' + postId + '/' + uid
    return firebase.database().ref(path).set({clicked: true});
  }
  likePost(postId, uid) {
    const path = '/global/webapp/' + this.campaignName + '/likes/' + postId + '/' + uid
    return firebase.database().ref(path).set({like: true});
  }
  unlikePost(postId, uid) {
    const path = '/global/webapp/' + this.campaignName + '/' + postId + '/' + uid
    return firebase.database().ref(path).remove();
  }
}

// Singleton global of our firebase wrapper. Must appear after the class definition above.
//
export var firebaseInstance = new FirebaseWrapper()
