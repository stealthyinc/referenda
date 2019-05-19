import React from 'react';
import {
  FlatList,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  RkButton,
  RkTextInput,
  RkCard,
  RkText,
  RkStyleSheet,
} from 'react-native-ui-kitten';
import { FontIcons } from '../assets/icons';
import { Avatar } from '../components/avatar';
import { SocialBar } from '../components/socialBar';
import ListContainer from './ListContainer'
import * as blockstack from 'blockstack'

const firebase = require('firebase');
const moment = require('moment');

export default class Feed extends React.Component {
  static navigationOptions = {
    title: 'Feed'.toUpperCase(),
  };

  constructor(props) {
    super(props);
    const isSignedIn = this.checkSignedInStatus();
    const userData = isSignedIn && blockstack.loadUserData();
    const person = (userData.username) ? new blockstack.Person(userData.profile) : false;
    this.state = {
      userData,
      person,
      isSignedIn,
      data: [],
      editingPost: false,
      initializing: true,
      saving: false,
    };

    if (!firebase.auth().currentUser) {
      firebase.auth().signInAnonymously()
      .then(() => {
        // this.anonalytics.setDatabase(firebase);
      });
    }

    this.indexFileData = undefined
    this.newPostTitle = undefined
    this.newPostDescription = undefined
  }

  componentDidMount() {
    if (this.state.userData) {
      this.getIndexFileData()
    }
  }

  /*
   * Begin Feed utilities
   *****************************************************************************
   */
  INDEX_FILE = 'index.json'

  static getPostFileName(aPostId) {
    return `p${aPostId}.json`
  }

  // TODO: make index file data a class. Possibly tie it to a schema.
  getNewIndex = () => {
    return {
      pinnedPostId: '',
      descTimePostIds: [],
      version: '1.0',
      timeUtc: undefined
    }
  }

  readIndex = async () => {
    let indexData = undefined

    // Note: rawData will be null if the file does not exist.
    const rawData = await blockstack.getFile('index.json', { decrypt: false })
    if (rawData) {
      indexData = JSON.parse(rawData)
    }
    return indexData
  }

  writeIndex = async () => {
    console.log('indexFileData:\n', this.indexFileData)

    this.indexFileData.timeUtc = Date.now()
    const sIndexFileData = JSON.stringify(this.indexFileData)
    await blockstack.putFile('index.json', sIndexFileData, {encrypt: false})
  }

  // TODO: refactor this into something clean when and lightweight when it all
  //       works.
  //
  // WARNING: forceNewIndex set to true will wipe out user data (i.e. record and
  //          order of posts).
  getIndexFileData = async (forceNewIndex=false) => {
    // 1. Check for an index file.
    //
    try {
      this.indexFileData = await this.readIndex()
    } catch (displayedSuppressedError) {
      console.log(displayedSuppressedError)
    }

    // 2. If the index file data doesn't already exist, initialize and write it.
    //
    if (!this.indexFileData || forceNewIndex) {
      this.indexFileData = this.getNewIndex()

      try {
        await this.writeIndex()
      } catch (error) {
        console.error(`Error creating index.json.\n${error}`)
      }
    }

    // 3. Load posts and initialize data.
    const data = []

    let orderedPosts = this.indexFileData.descTimePostIds
    if (this.indexFileData.pinnedPostId) {
      orderedPosts = this.indexFileData.descTimePostIds.filter(
        (ele) => { return ele !== this.indexFileData.pinnedPostId }
      )
      orderedPosts.unshift(this.indexFileData.pinnedPostId)
    }

    try {
      const readPromises = []
      for (const postId of orderedPosts) {
        const postPath = Feed.getPostFileName(postId)
        readPromises.push(
          blockstack.getFile(postPath, { decrypt: false })
          .catch((postReadError) => {
            console.error(`Unable to load post ${postPath}.\n${postReadError}`)
            return undefined
          })
        )
      }

      const rawPostDataArr = await Promise.all(readPromises)
      for (const rawPostData of rawPostDataArr) {
        if (!rawPostData) {
          // TODO: make empty post with reload/retry button pointing to this
          //       post.
        } else {
          try {
            const postData = JSON.parse(rawPostData)

/* A map of data we store to PBJ data format:
 *
 * Store                  PBJ
 * -------------------------------------------------
 * !                      comments: []
 * title                  header
 * id                     id
 * photo                  photo
 * video
 * description            text
 * time!                  time
 * !                      type
 * !                      user {firstName, lastName, photo}
 *
 */

            // const newDataElementArr = {
            //   comments: [],
            //   header: postData.title,
            //   id: postData.id,
            //   filename: '',
            //   photo: undefined,
            //   text: postData.description,
            //   time: ((postData.time-Date.now()) / 1000),
            //   type: 'article',
            //   user: {
            //     firstName: 'Todo',
            //     lastName: 'Reallysoon',
            //     photo: '/static/media/Image9.6ab96ea5.png'
            //   }
            // }

            // TODO: un-hack this.
            //       - probably best to tie it to blockstack profile data
            //         or to our own profile settings page (b/c then we aren't
            //         beholden to Blockstack's delays in storing/caching the
            //         profile data--or their plug-in developer's side-effects.)
            //
            postData.comments = []
            postData.type = 'article'
            postData.user = {
              firstName: 'Todo',
              lastName: 'Reallysoon',
              photo: '/static/media/Image9.6ab96ea5.png'
            }

            data.push(postData)
          } catch (postInflateError) {
            console.error(`Unable to inflate post.\n${postInflateError}`)
          }
        }
      }
    } catch (error) {
      console.error(`Problem reading posts.\n${error}`)
    }

    this.setState({
      initializing: false,
      data
    })
  }

  /*
   * End Feed utilities
   *****************************************************************************
   */


  checkSignedInStatus() {
    if (blockstack.isUserSignedIn()) {
      return true;
    } else if (blockstack.isSignInPending()) {
      blockstack.handlePendingSignIn().then(() => {
        window.location = window.location.origin;
      });
    }
    return false;
  }

  extractItemKey = (item) => {
     return `${item.id}`
  }

  onItemPressed = (item) => {
    this.props.navigation.navigate('Article', { id: item.id });
  }

  handleLogin = () => {
    if (this.state.isSignedIn) {
      blockstack.signUserOut(window.location.href);
    } else {
      const origin = window.location.origin;
      blockstack.redirectToSignIn(origin, `${origin}/manifest.json`, ['store_write', 'publish_data']);
    }
  }

  renderItem = ({ item }) => {
    const image = (item.photo) ?
      (<Image rkCardImg source={item.photo} />) : undefined

    const editorControls = (this.state.isSignedIn) ?
      (
        <View style={{flex: 1, flexDirection: 'row-reverse'}}>
          <View style={{marginLeft: 5}}>
            {this.getPostEditorButton('X', this.handleDelete, item.id, false)}
          </View>
          <View style={{marginLeft: 5}}>
            {this.getPostEditorButton('Pin', this.handlePin, item.id, false)}
          </View>
          <View>
            {this.getPostEditorButton('Edit...', this.handleEdit, item.id, false)}
          </View>
        </View>
      ) :
      undefined

    const timeSincePost = (item.time - Date.now()) / 1000
    return (
      <TouchableOpacity
        delayPressIn={70}
        activeOpacity={0.8}
        onPress={() => this.onItemPressed(item)}>
        <RkCard style={styles.card}>
          <View rkCardHeader>
            <Avatar
              rkType='circle'
              style={styles.avatar}
              img={item.user.photo}
            />
            <View>
              <RkText rkType='header4'>{item.title}</RkText>
              <RkText rkType='secondary2 hintColor'>{moment().add(timeSincePost).fromNow()}</RkText>
            </View>
            {editorControls}
          </View>
          {image}
          <View rkCardContent>
            <RkText rkType='secondary5'>{item.description}</RkText>
          </View>
          <View rkCardFooter>
            <SocialBar />
          </View >
        </RkCard>
      </TouchableOpacity>
    );
  }

  getFeedButton = (aKey) => {
    const isLogin = (aKey == 'LoginMenu')
    const rkType = (isLogin) ?
      (this.state.isSignedIn) ? 'clear' : 'primary' : 'clear'
    const handlerFn = (isLogin) ?
      this.handleLogin : this.handlePostEditorRequest
    const icon = (isLogin) ?
      FontIcons.login : FontIcons.article

    return (
      <RkButton
        rkType={rkType}
        key={aKey}
        onPress={() => handlerFn()} >
        <RkText style={styles.icon} rkType='primary moon small'>
          {icon}
        </RkText>
      </RkButton>
    )
  }

  getPostEditorTextInput = (thePlaceHolderText, aTextChgHandlerFn) => {
    const isHeading = (thePlaceHolderText === 'Title ...')
    let inputStyle = (isHeading) ? {} : {fontSize:40}
    let numberOfLines = (isHeading) ? 1 : 4

    return (
      <RkTextInput
        style={{borderStyle: 'solid', borderWidth: 1, borderColor: 'rgba(242, 242, 242, 1)', borderRadius: 5}}
        inputStyle={inputStyle}
        multiline={!isHeading}
        numberOfLines={numberOfLines}
        onChangeText={aTextChgHandlerFn}
        placeholder={thePlaceHolderText}/>
    )
  }

  getPostEditorButton = (buttonName, handlerFn, handlerArg, large=true) => {
    let rkType = (large) ? 'large' : 'small'
    rkType += ((buttonName === 'Cancel') || (buttonName === 'X')) ? ' danger' : ''
    rkType += (!large && (buttonName !== 'X')) ? ' info' : ''

    const textStyle = {
      fontSize: (large) ? 30 : 25,
      height: '100%',
      color: 'white'
    }

    if (handlerArg) {
      // debugger
      return (
        <RkButton
          rkType={rkType}
          onPress={() => handlerFn(handlerArg)} >
          { /* styling below b/c things are really silly for some reason w/o it */ }
          <RkText style={textStyle}>
            {buttonName}
          </RkText>
        </RkButton>
      )
    } else {
      return (
        <RkButton
          rkType={rkType}
          onPress={() => handlerFn()} >
          { /* styling below b/c things are really silly for some reason w/o it */ }
          <RkText style={textStyle}>
            {buttonName}
          </RkText>
        </RkButton>
      )
    }
  }

  renderPostEditor = () => {
    return (
      <View style={styles.container}>
        <RkCard style={styles.card}>
          <View rkCardHeader>
            <RkText rkType='header4'>New Post</RkText>
          </View>
          <View rkCardContent>
            {this.getPostEditorTextInput('Title ...', this.setNewPostTitle)}
            {this.getPostEditorTextInput('Description ...', this.setNewPostDescription)}
          </View>
          <View rkCardFooter style={{justifyContent: 'space-around'}}>
            {this.getPostEditorButton('Cancel', this.handlePostEditorCancel)}
            {this.getPostEditorButton('Photo ...', this.handleMediaUpload)}
            {this.getPostEditorButton('Post', this.handlePostEditorSubmit)}
          </View >
        </RkCard>
      </View>
    )
  }

  handlePostEditorRequest = () => {
    this.newPostTitle = undefined
    this.newPostDescription = undefined

    this.setState({ editingPost: true })
  }

  handlePostEditorCancel = () => {
    this.newPostTitle = undefined
    this.newPostDescription = undefined

    this.setState({ editingPost: false })
  }

  handlePostEditorSubmit = async () => {
    this.setState({ saving: true })

    // 1. write a post file.
    //
    const postId = Date.now()
    const postFileName = Feed.getPostFileName(postId)
    const postData = {
      title: this.newPostTitle,
      description: this.newPostDescription,
      picture: '',
      video: '',
      id: postId,
      time: postId,
    }

    try {
      const stringifiedPostData = JSON.stringify(postData)
      await blockstack.putFile(
        postFileName, stringifiedPostData, { encrypt: false } )
    } catch (error) {
      console.log(`Error while writing ${postFileName}.\n${error}`)
      this.setState({ saving: false })
      return
    }

    // 2. update the index file.
    //  TODO: refactor with earlier index saving code.
    //
    this.indexFileData.descTimePostIds.unshift(postId)

    try {
      this.writeIndex()
    } catch (error) {
      console.error(`Error saving index.json.\n${error}`)
      this.setState({ saving: false })
      return
    }

    // 3. update the data for this view.
    // const newDataElementArr = [{
    //   comments: [],
    //   header: this.newPostTitle,
    //   id: postId,
    //   filename: postFileName,
    //   photo: undefined,
    //   text: this.newPostDescription,
    //   time: (postId-Date.now()),
    //   type: 'article',
    //   user: {
    //     firstName: 'Todo',
    //     lastName: 'Reallysoon',
    //     photo: '/static/media/Image9.6ab96ea5.png'
    //   }
    // }]

    // TODO: un-hack this.
    //       - probably best to tie it to blockstack profile data
    //         or to our own profile settings page (b/c then we aren't
    //         beholden to Blockstack's delays in storing/caching the
    //         profile data--or their plug-in developer's side-effects.)
    //
    postData.comments = []
    postData.type = 'article'
    postData.user = {
      firstName: 'Todo',
      lastName: 'Reallysoon',
      photo: '/static/media/Image9.6ab96ea5.png'
    }
    const newDataElementArr = [postData]
    const joinedArr = newDataElementArr.concat(this.state.data)

    this.setState({
      data: joinedArr,
      editingPost: false,
      saving: false
    })
  }

  handlePin = async (aPostId) => {
    this.setState({ saving: true })

    // 1. Modify index to put the current post in the pinned position.
    //    (The pinned post is skipped in the render of regular items)
    //    If the post Id is currently pinned, unpin it.
    //
    this.indexFileData.pinnedPostId =
      (this.indexFileData.pinnedPostId !== aPostId) ? aPostId : ''

    // 2. Save the index
    //
    try {
      await this.writeIndex()
    } catch (error) {
      console.error(`Error saving index.json.\n${error}`)
      this.setState({ saving: false })
      return
    }

    // 3. Update the data for this view
    //  TODO: this is slow AF--something faster

    this.setState({ saving: false })
  }

  handleDelete = async (aPostId) => {
    this.setState({ saving: true })

    // 1. Delete the data in this post.
    const postFileName = Feed.getPostFileName(aPostId)
    try {
      const postData = {}
      const sPostData = JSON.stringify(postData)
      await blockstack.putFile(postFileName, sPostData, {encrypt: false})
    } catch (error) {
      console.log(`Unable to delete ${postFileName}.\n${error}`)
      this.setState({ saving: false })
      return
    }
    // 2. Remove this post from index data.


    this.indexFileData.pinnedPostId =
      (this.indexFileData.pinnedPostId !== aPostId) ? aPostId : ''

    // 2. Save the index
    //
    try {
      await this.writeIndex()
    } catch (error) {
      console.error(`Error saving index.json.\n${error}`)
      this.setState({ saving: false })
      return
    }

    // 3. Update the data for this view
    //  TODO: this is slow AF--something faster

    this.setState({ saving: false })
  }

  handleEdit = async (postId) => {

  }

  handleMediaUpload = () => {
    // TODO:
  }

  setNewPostTitle = (theTitleText) => {
    this.newPostTitle = theTitleText
  }

  setNewPostDescription = (theDescriptionText) => {
    this.newPostDescription = theDescriptionText
  }


  render() {
    console.log('In render, data:', this.state.data)


    const postEditor = (this.state.editingPost) ?
      this.renderPostEditor() : undefined
    const logInOutButton = (!this.state.editingPost) ?
      this.getFeedButton('LoginMenu') : undefined
    const postButton = (!this.state.editingPost) ?
      this.getFeedButton('ArticleMenu') : undefined

    const activityIndicator = (this.state.initializing) ?
      ( <View style={{flexDirection:'row', justifyContent:'center', marginVertical:50, borderStyle:'solid', borderWidth:1, borderRadius:5, borderColor:'rgba(242, 242, 242, 1)'}}>
          <ActivityIndicator size='large' color='black'/>
          <RkText style={{color:'rgba(242, 242, 242, 1)'}} rkType="large center"> Loading ...</RkText>
        </View>
      ) : undefined
    const postActivityIndicator = (this.state.saving) ?
      ( <View style={{flexDirection:'row', justifyContent:'center', marginVertical:50, borderStyle:'solid', borderWidth:1, borderRadius:5, borderColor:'rgba(242, 242, 242, 1)'}}>
          <ActivityIndicator size='large' color='black'/>
          <RkText style={{color:'rgba(242, 242, 242, 1)'}} rkType="large center"> Saving ...</RkText>
        </View>
      ) : undefined

    return (
      <View>
        <View style={styles.main}>
          {logInOutButton}
          {postButton}
        </View>
        {postEditor}
        {activityIndicator}
        {postActivityIndicator}
        <FlatList
          data={this.state.data}
          renderItem={this.renderItem}
          keyExtractor={this.extractItemKey}
          style={styles.container} />
      </View>
    )
  }
}

const styles = RkStyleSheet.create(theme => ({
  container: {
    backgroundColor: theme.colors.screen.scroll,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  card: {
    marginVertical: 8,
  },
  avatar: {
    marginRight: 16,
    alignItems: 'flex-start'
  },
  main: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#ffffff"
  },
  icon: {
    margin: 5,
  },
}));
