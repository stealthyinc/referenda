import React from 'react';
import {
  FlatList,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
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
import { data } from '../data';
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
    const userData = isSignedIn && this.loadUserData();
    const person = (userData.username) ? new blockstack.Person(userData.profile) : false;
    this.state = {
      userData,
      person,
      isSignedIn,
      // data: data.getArticles('article'),
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

  // TODO: refactor this into something clean when and lightweight when it all
  //       works.
  //
  async getIndexFileData() {
    // 1. Check for an index file.
    //
    this.indexFileData = undefined
    try {
      // Note: indexFileData will be null if the file does not exist.
      const rawData = await blockstack.getFile('index.json', { decrypt: false })
      if (rawData) {
        this.indexFileData = JSON.parse(rawData)
      }
    } catch (error) {
      // TODO: Suppress if because no file exists. Display otherwise.
      console.error(error)
    }

    // 2. If the index file data doesn't already exist, initialize and write it.
    //
    if (!this.indexFileData) {
      // TODO: make index file data a class. Possibly tie it to a schema.
      this.indexFileData = {
        pinnedPostPath: "",
        descTimePostPaths: [],
        version: "1.0",
        timeUtc: Date.now()
      }

      try {
        const stringifiedIndexFileData = JSON.stringify(this.indexFileData)
        await blockstack.putFile(
          'index.json', stringifiedIndexFileData, { encrypt: false })
        console.log('Successfully wrote index.json.')
      } catch (error) {
        console.error(`Error creating index.json.\n${error}`)
      }
    } else {
      console.log('Using existing index.json data.')
    }

    // 3. Load posts and initialize data.
    const data = []

    let orderedPostPaths = this.indexFileData.descTimePostPaths
    if (this.indexFileData.pinnedPostPath) {
      orderedPostPaths = this.indexFileData.descTimePostPaths.filter(
        (ele) => { return ele !== this.indexFileData.pinnedPostPath }
      )
      orderedPostPaths.unshift(this.indexFileData.pinnedPostPath)
    }

    try {
      const readPromises = []
      for (const postPath of orderedPostPaths) {
        readPromises.push(
          blockstack.getFile(postPath, { decrypt: false })
          .catch(postReadError => {
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

            const newDataElementArr = {
              comments: [],
              header: postData.title,
              id: postData.id,
              filename: '',
              photo: undefined,
              text: postData.description,
              time: ((postData.time-Date.now()) / 1000),
              type: 'article',
              user: {
                firstName: 'Todo',
                lastName: 'Reallysoon',
                photo: '/static/media/Image9.6ab96ea5.png'
              }
            }

            data.push(newDataElementArr)
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
      return false;
    }
    return false;
  }

  loadUserData() {
    return blockstack.loadUserData();
  }

  extractItemKey = (item) => `${item.id}`;
  onItemPressed = (item) => {
    const idObj = {
      id: item.id
    }
    console.log(`Navigating to Article with {id: ${idObj.id}}`)
    this.props.navigation.navigate('Article', { id: item.id });
  }
  handleLogin = () => {
    if (this.state.isSignedIn) {
      blockstack.signUserOut(window.location.href);
    }
    else {
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
            {this.getPostEditorButton('Pin', this.handlePin, item.id, false)}
          </View>
          <View style={{marginRight: 5}}>
            {this.getPostEditorButton('Edit...', undefined, undefined, false)}
          </View>
        </View>
      ) :
      undefined

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
              { /* <RkText rkType='header4'>{`${item.user.firstName} ${item.user.lastName}`}</RkText> */ }
              <RkText rkType='header4'>{item.header}</RkText>
              <RkText rkType='secondary2 hintColor'>{moment().add(item.time, 'seconds').fromNow()}</RkText>
            </View>
            {editorControls}
          </View>
          {image}
          <View rkCardContent>
            <RkText rkType='secondary5'>{item.text}</RkText>
          </View>
          <View rkCardFooter>
            <SocialBar />
          </View >
        </RkCard>
      </TouchableOpacity>
    );
  }

  getFeedButton(aKey) {
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

  getPostEditorTextInput(thePlaceHolderText, aTextChgHandlerFn) {
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
    rkType += (buttonName === 'Cancel') ? ' danger' : ''
    rkType += (!large) ? ' info' : ''

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

  renderPostEditor() {
    console.log('returning post editor html ...')
    // TODO: get user first & last name from blockstack profile or data stored
    //       for this app.
    //       get avatarPhoto from image stored for this app.
    const firstName = 'Agatha'
    const lastName = 'Bacelar'
    // const avatarPhoto = item.user.photo  <-- TODO
    const postTime = Date.now()

    return (
      <View style={styles.container}>
        <RkCard style={styles.card}>
          <View rkCardHeader>
            {/* <Avatar rkType='small' style={styles.avatar} img={avatarPhoto} /> */}
              <RkText rkType='header4'>New Post</RkText>
          </View>
          <View rkCardContent>
            {/* Introduce fields for: Title, Description, Photo U/L */}
            {this.getPostEditorTextInput('Title ...', this.setNewPostTitle)}
            {this.getPostEditorTextInput('Description ...', this.setNewPostDescription)}
          </View>
          <View rkCardFooter style={{justifyContent: 'space-around'}}>
            {/* Introduce buttons for: <Post> <Cancel> */}
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

    this.setState({
      editingPost: true,
    })
  }

  handlePostEditorCancel = () => {
    this.newPostTitle = undefined
    this.newPostDescription = undefined

    this.setState({
      editingPost: false,
    })
  }

  handlePostEditorSubmit = async () => {
    this.setState({ saving: true })

    // 1. write a post file.
    //
    const timeUtcMs = Date.now()
    const postFileName = `post-${timeUtcMs}.json`
    const postData = {
      title: this.newPostTitle,
      description: this.newPostDescription,
      picture: '',
      video: '',
      id: timeUtcMs,
      time: timeUtcMs,
    }

    try {
      const stringifiedPostData = JSON.stringify(postData)
      await blockstack.putFile(
        postFileName, stringifiedPostData, { encrypt: false } )
      console.log(`Successfully wrote ${postFileName}`)
    } catch (error) {
      console.log(`Error while writing ${postFileName}.\n${error}`)
      this.setState({ saving: false })
      return
    }

    // 2. update the index file.
    //  TODO: refactor with earlier index saving code.
    //
    this.indexFileData.descTimePostPaths.unshift(postFileName)

    try {
      this.writeIndex()
    } catch (error) {
      console.error(`Error saving index.json.\n${error}`)
      this.setState({ saving: false })
      return
    }

    // 3. update the data for this view.
    const newDataElementArr = [{
      comments: [],
      header: this.newPostTitle,
      id: timeUtcMs,
      filename: postFileName,
      photo: undefined,
      text: this.newPostDescription,
      time: (timeUtcMs-Date.now()),
      type: 'article',
      user: {
        firstName: 'Todo',
        lastName: 'Reallysoon',
        photo: '/static/media/Image9.6ab96ea5.png'
      }
    }]

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
    const pinPostFileName = `post-${aPostId}.json`
    this.indexFileData.pinnedPostPath =
      (this.indexFileData.pinnedPostPath !== pinPostFileName) ?
        pinPostFileName : ''

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

  handleMediaUpload = () => {
    // TODO:
  }

  setNewPostTitle = (theTitleText) => {
    this.newPostTitle = theTitleText
  }

  setNewPostDescription = (theDescriptionText) => {
    this.newPostDescription = theDescriptionText
  }

  writeIndex = async () => {
    console.log('indexFileData:')
    console.log(this.indexFileData)

    this.indexFileData.timeUtc = Date.now()
    const stringifiedIndexFileData = JSON.stringify(this.indexFileData)
    await blockstack.putFile(
      'index.json', stringifiedIndexFileData, {encrypt: false})

    console.log('Successfully wrote index.json.')
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
