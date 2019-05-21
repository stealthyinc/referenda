import React, { Component } from 'react';
import {
  FlatList,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {
  Button,
  Body,
  Content,
  Card,
  CardItem,
  Text,
  Icon,
  Input,
  Left,
  Right,
  H1,
  Thumbnail
} from 'native-base';
import * as blockstack from 'blockstack'
import SocialBar from '../components/SocialBar'

// TODO: how do we rip this out / disable it for mobile web and the app (use
//       the photo chooser / picker for the app).
import FitImage from 'react-native-fit-image';
import Dropzone from 'react-dropzone'

const firebase = require('firebase');
const moment = require('moment');

export default class Feed extends Component {
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
      mediaUploading: '',
    };

    if (!firebase.auth().currentUser) {
      firebase.auth().signInAnonymously()
      .then(() => {
        // this.anonalytics.setDatabase(firebase);
      });
    }

    this.indexFileData = undefined

    this.newPostId = undefined
    this.newPostTitle = undefined
    this.newPostDescription = undefined
    this.newPostMediaFileName = undefined
  }

  componentDidMount() {
    // if (this.state.userData) {
      this.getIndexFileData()
    // }
  }

  /*
   * Begin Feed utilities
   *****************************************************************************
   */
  INDEX_FILE = 'index.json'

  // TODO: create a mapping mechanism to get the appropriate gaia bucket for
  //       the provided URL / argument.  i.e.:
  //
  //       ?name= or /name      gaia-bucket
  //       ---------------------------------------------------------------------------------------
  //       agatha               https://gaia.blockstack.org/hub/1KFqr64mYNP6Ma6D88ErxiY6YhaUgcdKHz
  //       guaido               https://gaia.blockstack.org/hub/<...>
  //       ...
  //
  GAIA_MAP = {
    agatha: 'https://gaia.blockstack.org/hub/1KFqr64mYNP6Ma6D88ErxiY6YhaUgcdKHz',
    agathaImg: 'gaia.blockstack.org/hub/1KFqr64mYNP6Ma6D88ErxiY6YhaUgcdKHz'
  }

  // getFile: abstraction above blockstack getFile that works if we're not
  //          signed in for reading files for static site load
  //
  getFile = async(aFileName, theOptions={ decrypt:false }) => {
    if (this.state.isSignedIn) {
      return blockstack.getFile(aFileName, theOptions)
      .then((response) => {
        try {
          let result = undefined
          if (response) {
            result = JSON.parse(response)
          }
          return result
        } catch (error) {
          throw new Error(`Blockstack.getFile failed in getFile.\n${error}`)
        }
      })
    } else {
      const pathToRead = `${this.GAIA_MAP['agatha']}/${aFileName}`
      return fetch(pathToRead)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        throw new Error(`Fetch failed in getFile with status ${response.status}.`)
      })
    }
  }

  static getPostFileName(aPostId) {
    return `p${aPostId}.json`
  }

  static getPostMediaFileName(aPostId) {
    return `p${aPostId}.media`
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
    // Note: rawData will be null if the file does not exist.
    return await this.getFile(this.INDEX_FILE)
  }

  writeIndex = async () => {
    console.log('indexFileData:\n', this.indexFileData)

    this.indexFileData.timeUtc = Date.now()
    const sIndexFileData = JSON.stringify(this.indexFileData)
    await blockstack.putFile(this.INDEX_FILE, sIndexFileData, {encrypt: false})
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

    // 2. If the index file data doesn't already exist, initialize and write it
    //    if we are signed in.
    //
    if (!this.indexFileData || forceNewIndex) {
      if (this.state.isSignedIn) {
        this.indexFileData = this.getNewIndex()

        try {
          await this.writeIndex()
        } catch (error) {
          console.error(`Error creating ${this.INDEX_FILE}.\n${error}`)
        }
      } else {
        // TODO: Present a message that there is no information to the user.
        //
        this.setState({
          initializing: false,
          data: []
        })
        return
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
          this.getFile(postPath)
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
            // const postData = JSON.parse(rawPostData)
            const postData = rawPostData

/* A map of data we store to PBJ data format:
 *
 * Store                  PBJ
 * -------------------------------------------------
 * !                      comments: []
 * title                  header
 * id                     id
 * picture                photo
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

            if (this.indexFileData.pinnedPostId &&
                (this.indexFileData.pinnedPostId === postData.id)) {
              postData.pinned = true
            }

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

            // Handle images if specified ()
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
    let image = undefined
    if (item.picture) {
      const imagePath = `${this.GAIA_MAP['agatha']}/${item.picture}`
      image = (<FitImage source={{uri: imagePath}} />)
    }

    const pinButtonText = (item.hasOwnProperty('pinned') && item.pinned) ?
      'Unpin' : 'Pin'
    const editorControls = (this.state.isSignedIn) ?
      (
        <CardItem footer>
          <View style={{flexDirection:'row', justifyContent:'flex-end', flex:1}}>
            {this.getPostEditorButton('X', this.handleDelete, "trash", item.id, false)}
            <View style={{width:5}} />
            {this.getPostEditorButton(pinButtonText, this.handlePin, "pin", item.id, false)}
          </View>
        </CardItem>
      ) :
      undefined

    let timeStr = moment(item.time).fromNow()
    timeStr = (item.hasOwnProperty('pinned') && item.pinned) ?
      `pinned post - ${timeStr}` : timeStr

    return (
        <Card style={{flex: 0}}>
          <CardItem bordered>
            <Left>
              <Thumbnail source={item.user.photo}/>
              <Body>
                <Text style={{fontFamily:'arial', fontSize:27}}>{item.title}</Text>
                <Text style={{fontFamily:'arial', fontStyle:'italic', fontSize:21, color:'lightgray'}}>{timeStr}</Text>
              </Body>
            </Left>
          </CardItem>
          <TouchableOpacity
            delayPressIn={70}
            activeOpacity={0.8}
            onPress={() => this.onItemPressed(item)}>
            <CardItem>
              <Body>
                {/* FitImage needs this view or it doesn't understand the width to size the image height to.' */}
                <View style={{width:'100%'}}>
                  {image}
                </View>
                <View style={{marginTop:10, padding:10, width:'100%', borderStyle:'solid',borderColor:'lightgray',borderWidth:1}}>
                  <Text style={{fontFamily:'arial', fontSize: 21}}>
                    {item.description}
                  </Text>
                </View>
              </Body>
            </CardItem>
          </TouchableOpacity>
          <SocialBar
            paymentFunction={() => this.props.navigation.navigate('Square')}
          />
          {editorControls}
        </Card>
    );
  }

  getFeedButton = (aKey) => {
    const isLogin = (aKey === 'LoginMenu')
    const buttonName = (isLogin) ?
      ( (this.state.isSignedIn) ? 'Log Out' : 'Log In' ) : 'New Post ...'
    const buttonText = (<Text style={{fontFamily:'arial', fontSize:27}} uppercase={false}>{buttonName}</Text>)
    const handlerFn = (isLogin) ? this.handleLogin : this.handlePostEditorRequest
    const icon = (isLogin) ?
      (this.state.isSignedIn) ? 'log-out' : 'log-in' : 'create'
    return (
      <Button
        success
        iconLeft
        bordered
        style={{borderRadius: 15}}
        onPress={() => handlerFn()}>
        <Icon name={icon}/>
        {buttonText}
      </Button>
    )
  }

  getPostEditorTextInput = (thePlaceHolderText, aTextChgHandlerFn) => {
    const isHeading = (thePlaceHolderText === 'Title ...')
    let inputStyle = (isHeading) ? {} : {fontSize:40}
    let numberOfLines = (isHeading) ? 1 : 4

    return (
      <Input
        style={{borderStyle: 'solid', borderWidth: 1, borderColor: 'rgba(242, 242, 242, 1)', borderRadius: 5}}
        inputStyle={inputStyle}
        multiline={!isHeading}
        numberOfLines={numberOfLines}
        onChangeText={aTextChgHandlerFn}
        placeholder={thePlaceHolderText}/>
    )
  }

  getPostEditorButton = (buttonName, handlerFn, icon, handlerArg, large=true) => {
    const fontSize = (large) ? 27 : 21
    const buttonText = (<Text style={{fontFamily:'arial', fontSize:fontSize}} uppercase={false}>{buttonName}</Text>)
    const danger = ((buttonName === 'Cancel') || (buttonName === 'X'))
    const info = (buttonName === 'Post')
    const success = !info && !danger
    const onPress = (handlerArg) ?
      () => handlerFn(handlerArg) :
      () => handlerFn()
    return (
      <Button
        bordered
        iconLeft
        small={!large}
        medium={large}
        info={info}
        success={success}
        danger={danger}
        style={{borderRadius:10}}
        onPress={onPress}>
        <Icon name={icon} />
        {buttonText}
      </Button>
    )
  }

  renderPostEditor = () => {
    console.log(this.state.mediaUploading)
    const uploadStatusView = (this.state.mediaUploading) ?
      (
        <View
          style={{
            marginHorizontal:15,
            marginTop:0,
            marginBottom: 15,
            width:'70vw'}}>

            <Text style={{textAlign: 'center', color: 'rgb(204,204,204)'}}>{this.state.mediaUploading}</Text>
        </View>
      ) :
      undefined

    return (
      <Content padder>
        <Card>
          <CardItem header>
            <H1>New Post</H1>
          </CardItem>
          <CardItem bordered>
            <View style={{flexDirection: 'column'}}>
              <View
                style={{
                  borderStyle:'dashed',
                  borderWidth: 2,
                  borderRadius: 10,
                  borderColor:'rgb(204,204,204)',
                  marginHorizontal:15,
                  marginVertical:15,
                  width:'70vw'}}>
                <Dropzone onDrop={acceptedFiles => this.handleMediaUpload(acceptedFiles)}>
                  {({getRootProps, getInputProps}) => (
                    <section>
                      <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <p style={{textAlign: 'center'}}>Drag 'n' drop an image here</p>
                        <p style={{textAlign: 'center'}}>or</p>
                        <p style={{textAlign: 'center'}}>click here to choose one.</p>
                      </div>
                    </section>
                  )}
                </Dropzone>
              </View>
              {uploadStatusView}
            </View>
          </CardItem>

          <CardItem>
              {this.getPostEditorTextInput('Title ...', this.setNewPostTitle)}
          </CardItem>
          <CardItem bordered>
              {this.getPostEditorTextInput('Description ...', this.setNewPostDescription)}
          </CardItem>
          <CardItem bordered>
            <View style={{flexDirection:'row', justifyContent:'flex-end', flex:1}}>
              {this.getPostEditorButton('Cancel', this.handlePostEditorCancel, "close-circle-outline")}
              <View style={{width:5}} />
              {this.getPostEditorButton('Post', this.handlePostEditorSubmit, "checkbox")}
            </View>
          </CardItem>
        </Card>
      </Content>
    )
  }

  handlePostEditorRequest = () => {
    this.newPostId = Date.now()
    this.newPostTitle = undefined
    this.newPostDescription = undefined
    this.newPostMediaFileName = undefined

    this.setState({ editingPost: true })
  }

  handlePostEditorCancel = () => {
    this.newPostId = undefined
    this.newPostTitle = undefined
    this.newPostDescription = undefined
    this.newPostMediaFileName = undefined

    this.setState({ editingPost: false })
  }

  handlePostEditorSubmit = async () => {
    this.setState({ saving: true })

    // 1. write a post file.
    //
    const postFileName = Feed.getPostFileName(this.newPostId)
    const postData = {
      title: this.newPostTitle,
      description: this.newPostDescription,
      picture: this.newPostMediaFileName,
      video: '',
      id: this.newPostId,
      time: Date.now(),
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
    this.indexFileData.descTimePostIds.unshift(this.newPostId)

    try {
      this.writeIndex()
    } catch (error) {
      console.error(`Error saving ${this.INDEX_FILE}.\n${error}`)
      this.setState({ saving: false })
      return
    }

    // 3. update the data for this view.
    // const newDataElementArr = [{
    //   comments: [],
    //   header: this.newPostTitle,
    //   id: this.newPostId,
    //   filename: postFileName,
    //   photo: undefined,
    //   text: this.newPostDescription,
    //   time: (this.newPostId-Date.now()),
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

    const newData = [ ...this.state.data ]
    const newPostIndex = (this.indexFileData.pinnedPostId) ? 1 : 0
    newData.splice(newPostIndex, 0, postData)

    this.setState({
      data: newData,
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
    let pinning = (this.indexFileData.pinnedPostId !== aPostId)
    this.indexFileData.pinnedPostId = (pinning) ? aPostId : ''

    // 2. Save the index
    //
    try {
      await this.writeIndex()
    } catch (error) {
      console.error(`Error saving ${this.INDEX_FILE}.\n${error}`)
      this.setState({ saving: false })
      return
    }

    // 3. Update the data for this view.
    //    If we're pinning, move the post to the front.
    //    If we're unpinning, move the post from the front to it's correct
    //    position.
    //
    let updatedData = [ ...this.state.data ]
    if (pinning) {
      let postToPin = undefined
      for (const index in updatedData) {
        const postId = updatedData[index].id
        if (postId === aPostId) {
          const postToPinArr = updatedData.splice(index, 1)
          if (postToPinArr) {
            postToPin = postToPinArr[0]
          }
          break
        }
      }

      if (postToPin) {
        postToPin.pinned = true
        updatedData.unshift(postToPin)
      }
    } else { // unpinning
      // A. Find the post to unpin in the current render list and remove it:
      //
      let postToUnpin = undefined
      for (const index in updatedData) {
        const postId = updatedData[index].id
        if (postId === aPostId) {
          if (index === 0) {
            const postToUnpinArr = updatedData.splice(index, 1)
            if (postToUnpinArr) {
              postToUnpin = postToUnpinArr[0]
            }
            if (postToUnpin && postToUnpin.hasOwnProperty('pinned')) {
              delete postToUnpin.pinned
            }
          } else {
            console.error(`Unable to unpin specified post--it's not at the expected position: ${index} (expected 0).`)
          }
          break
        }
      }
      // B. Find the correct place to reinsert the unpinned post:
      //
      if (postToUnpin) {
        // Find the first post that happened before this one and insert it in
        // front of that. Special cases include: (1) front of the list.
        // (2) end of the list. (3) only item in the list.
        let inserted = false
        for (const index in updatedData) {
          const postId = updatedData[index].id
          if (aPostId > postId) {
            if (index === 0) {
              // Special case (1)
              updatedData.unshift(postToUnpin)
              console.log('Inserted at front of list ...')
            } else {

              // Generic case
              const insertAtIndex = index
              updatedData.splice(insertAtIndex, 0, postToUnpin)
              console.log(`Inserted at index ${insertAtIndex} ...`)
            }

            inserted = true
            break
          }
        }

        if (!inserted) {
          // Special case (2), (3)
          updatedData.push(postToUnpin)
          console.log(`Inserted by push (special case 2/3): ...`)
          inserted = true
        }
      }
    }

    this.setState({
      saving: false,
      data: updatedData
    })
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

    // 2. Remove this post from index data and save the index
    //
    if (this.indexFileData.pinnedPostId === aPostId) {
      this.indexFileData.pinnedPostId = ''
    }

    for (const index in this.indexFileData.descTimePostIds) {
      const postId = this.indexFileData.descTimePostIds[index]
      if (postId === aPostId) {
        this.indexFileData.descTimePostIds.splice(index, 1)
        break
      }
    }

    try {
      await this.writeIndex()
    } catch (error) {
      console.error(`Error saving ${this.INDEX_FILE}.\n${error}`)
      this.setState({ saving: false })
      return
    }

    // 3. Update the data for this view
    //
    let updatedData = [ ...this.state.data ]
    for (const index in updatedData) {
      const id = updatedData[index].id
      if (id === aPostId) {
        updatedData.splice(index, 1)
        break;
      }
    }

    this.setState({
       saving: false,
       data: updatedData
     })
  }

  handleMediaUpload = async (acceptedFiles) => {
    //
    // TODO:
    //   - limit types of files (media - photo/video formats)
    //   - check size (file.size is in bytes) and limit or chunk or s3
    //   - scale and compress to jpg
    //   - deal with multiple files (carousel?)
    //
    // For now only deal with the first file:
    //
    if (acceptedFiles && acceptedFiles.length >= 1) {
      const firstFile = acceptedFiles[0]

      const reader = new FileReader()
      reader.onabort = () => {
        const msg = `${this.state.mediaUploading} aborted.`
        console.log('file reading was aborted')
        this.setState({mediaUploading: msg})
      }
      reader.onerror = () => {
        const msg = `${this.state.mediaUploading} failed.`
        console.log('file reading has failed')
        this.setState({mediaUploading: msg})
      }
      reader.onload = () => {
        // Do whatever you want with the file contents
        // const binaryStr = reader.result
        // console.log(binaryStr)

        // if (file) {
        //   this.newPostMediaFileName = {
        //     name: file.name,
        //     type: file.type,
        //     data: undefined
        //   }
        // }

        const msg = `${this.state.mediaUploading} read.`
        this.setState({mediaUploading: msg})

        // Now upload it and set newPostMediaFileName:
        this.newPostMediaFileName = Feed.getPostMediaFileName(this.newPostId)
        // this.newPostMediaFileName = firstFile.name
        const postMediaDataBuffer = reader.result
        blockstack.putFile(
          this.newPostMediaFileName, postMediaDataBuffer, { encrypt: false })
        .then(() => {
          console.log(`Media file uploaded: ${this.newPostMediaFileName}`)
          this.setState({mediaUploading: false})
        })
        .catch((error) => {
          console.error('Unable to upload file: ${this.newPostMediaFileName}')
        })
      }

      this.setState({mediaUploading: `Uploading ${firstFile.name} ...`})
      // reader.readAsBinaryString(firstFile)
      // reader.readAsDataURL(firstFile)
      reader.readAsArrayBuffer(firstFile)
      // TODO: filter file types (image types) and message on unsupported types.
      // TODO: only allow a single file.
    } else {
      this.setState({mediaUploading: false})
    }
  }

  setNewPostTitle = (theTitleText) => {
    this.newPostTitle = theTitleText
  }

  setNewPostDescription = (theDescriptionText) => {
    this.newPostDescription = theDescriptionText
  }


  render() {
    // console.log('In render, data:', this.state.data)
    const postEditor = (this.state.editingPost) ?
      this.renderPostEditor() : undefined
    const logInOutButton = (!this.state.editingPost) ?
      this.getFeedButton('LoginMenu') : undefined
    const postButton = (!this.state.editingPost && this.state.isSignedIn) ?
      this.getFeedButton('ArticleMenu') :
      ( <Text style={{fontFamily:'arial', fontSize:40, color:'gray'}}>Referenda</Text> )

    let activityIndicator = undefined
    if (this.state.initializing || this.state.saving) {
      const aiText = (this.state.initializing) ? ' Loading ...' : 'Saving ...'
      activityIndicator = (
        <View style={{paddingVertical:10, alignItems:'center', flexDirection:'row', justifyContent:'center', marginVertical:50, borderStyle:'solid', borderWidth:1, borderRadius:5, borderColor:'rgba(242, 242, 242, 1)'}}>
            <ActivityIndicator size='large' color='black'/>
            <Text style={{fontFamily:'arial', fontSize:27, color:'rgba(242, 242, 242, 1)'}}> {aiText}</Text>
        </View> )
    }

    return (
      <View>
        <View id='PageHeader' style={styles.main}>
          {logInOutButton}
          {postButton}
        </View>
        {postEditor}
        {activityIndicator}
        <FlatList
          data={this.state.data}
          renderItem={this.renderItem}
          keyExtractor={this.extractItemKey}
          style={styles.container} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  main: {
    marginTop: 20,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
  },
  icon: {
    margin: 5,
  },
});
