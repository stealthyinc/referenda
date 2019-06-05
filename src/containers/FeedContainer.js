import React, { Component } from 'react';
import {
  FlatList,
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
  Linking,
} from 'react-native';
import {
  Button,
  Body,
  Content,
  Card,
  CardItem,
  Text,
  Header,
  Icon,
  Input,
  Thumbnail,
  Container,
  Grid,
} from 'native-base';
import {
  Amplitude,
  LogOnMount
} from "@amplitude/react-amplitude";
import { AppConfig, UserSession, Person } from 'blockstack'
import SocialBar from '../components/SocialBar'
import ModalContainer from './ModalContainer'
// import SquareContainer from './SquareContainer'
import ArticleContainer from './ArticleContainer'
import AppSignUp from '../components/AppSignUp'
import PhoneNumber from '../components/PhoneNumber'
import ShareBar from '../components/ShareBar'

// TODO: how do we rip this out / disable it for mobile web and the app (use
//       the photo chooser / picker for the app).
import FitImage from 'react-native-fit-image';
import ReactPlayer from 'react-player'
import Dropzone from 'react-dropzone'

import { isMobile } from "react-device-detect";

const moment = require('moment');
const runes = require('runes')
const { firebaseInstance } = require('../utils/firebaseWrapper.js')

const C = require('../utils/constants.js')

export default class Feed extends Component {
  constructor(props) {
    super(props);
    const origin = window.location.origin;
    const appConfig = new AppConfig(['store_write', 'publish_data', 'email'])
    this.userSession = new UserSession({ appConfig })
    const isSignedIn = this.checkSignedInStatus();
    const userData = isSignedIn && this.userSession.loadUserData();
    const person = (userData.username) ? new Person(userData.profile) : false;

    this.state = {
      userData,
      person,
      isSignedIn,
      data: [],
      editingPost: false,
      initializing: true,
      saving: false,
      mediaUploading: '',
      showShareModal: false,
      showSquareModal: false,
      showPhoneModal: false,
      showArticleModal: false,
      showMessageModal: false,
    };

    this.indexFileData = undefined

    this.newPostId = undefined
    this.newPostTitle = undefined
    this.newPostDescription = undefined
    this.newPostMedia = undefined

    this.articleModalItem = undefined
    this.shareModelContent = undefined
  }

  componentWillMount = async () => {
    if(!this.userSession.isUserSignedIn() && this.userSession.isSignInPending()) {
      this.userSession.handlePendingSignIn()
      .then((userData) => {
        if(!userData.username) {
          throw new Error('This app requires a username.')
        }
        window.location = `/${userData.username}`
        const person = (userData.username) ? new Person(userData.profile) : false;
        this.setState({userData, person})
      })
    }
  }

  componentDidMount = async () => {
    // await firebaseInstance.loadUser()
    await firebaseInstance.loadSnapshot()
    const GAIA_MAP = firebaseInstance.getSnapshotValue('gaiaMap')
    const { userData } = this.state

    // TODO: check if campaignName is valid (i.e. either in the GAIA_MAP or
    //       if we can read from it. If not then redirect to the 'undefined'/
    //       default GAIA bucket which features or own content for new users.
    //
    this.campaignName = 'default'
    firebaseInstance.setCampaignName(this.campaignName)
    this.mediaUrlRoot = undefined
    this.showPostId = undefined
    if (userData &&
        userData.hasOwnProperty('gaiaHubConfig') && userData.gaiaHubConfig &&
        userData.gaiaHubConfig.hasOwnProperty('url_prefix') && userData.gaiaHubConfig.url_prefix &&
        userData.gaiaHubConfig.hasOwnProperty('address') && userData.gaiaHubConfig.address) {
      const gaiaRoot = userData.gaiaHubConfig.url_prefix
      const appAddress = userData.gaiaHubConfig.address
      this.mediaUrlRoot = `${gaiaRoot}${appAddress}`
      firebaseInstance.setCampaignName(this.state.userData.username)
      firebaseInstance.storeCampaignGaia(this.mediaUrlRoot, this.state.userData.email)

      // We look for a link post id if the user is signed in or if the campaign link is
      // correct to navigate to the specified post.
      try {
        const postIdArg = this.props.navigation.getParam('postId')
        if (postIdArg) {
          this.showPostId = parseInt(postIdArg)
        }
      } catch (suppressedError) {}

    } else {
      this.campaignName = (this.props.navigation.getParam('campaignName')) ? this.props.navigation.getParam('campaignName') : 'default'
      let campaignName = this.campaignName.replace(/\./g, '_');
      if (campaignName in GAIA_MAP) {
        firebaseInstance.setCampaignName(this.campaignName)
        this.mediaUrlRoot = GAIA_MAP[campaignName].url

        // We look for a link post id if the user is signed in or if the campaign link is
        // correct to navigate to the specified post.
        try {
          const postIdArg = this.props.navigation.getParam('postId')
          if (postIdArg) {
            this.showPostId = parseInt(postIdArg)
          }
        } catch (suppressedError) {}

      } else {
        // TODO: change this to a default with info for a prospective campaign
        // TODO: check if the path is a gaia hub and pull from that too.
        const unsignedInUserDefault = 'default'
        // Quick test to see if a valid gaia bucket was specified--if so use that as the mediaUrlRoot
        // allowing any user's gaia bucket link to work
        let campaignNameIsGaiaBucket = false
        if (this.campaignName) {
          this.mediaUrlRoot = `https://gaia.blockstack.org/hub/${this.campaignName}`
          try {
            const indexData = await this.readIndex()
            campaignNameIsGaiaBucket = true
          } catch (suppressedError) {
            campaignNameIsGaiaBucket = false
          }
        }
        //
        if (!campaignNameIsGaiaBucket) {
          this.mediaUrlRoot = GAIA_MAP[unsignedInUserDefault]
        }
      }
    }
    this.getIndexFileData()
    // firebaseInstance.viewPost(firebaseInstance.getUserId())
  }


  /*
   * Begin Feed utilities
   *****************************************************************************
   */


  checkSignedInStatus() {
    if (this.userSession.isUserSignedIn()) {
      return true;
    } else if (this.userSession.isSignInPending()) {
      this.userSession.handlePendingSignIn()
      .then((userData) => {
        if(!userData.username) {
          throw new Error('This app requires a username.')
        }
        window.location = `/${userData.username}`
      })
    }
    return false;
  }

  // getFile: abstraction above blockstack getFile that works if we're not
  //          signed in for reading files for static site load
  //
  getFile = async(aFileName, theOptions={ decrypt:false }) => {
    if (this.state.isSignedIn) {
      return this.userSession.getFile(aFileName, theOptions)
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
      const pathToRead = `${this.mediaUrlRoot}/${aFileName}`
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

  static getPostMediaFileName(aPostId, theOriginalFileName) {
    // Get the extension of the original file name and use that to
    // set the media file name extension. (The reason for this is
    // that ReactPlayer's canPlay functionality on mobile seems to
    // match against the extension to determine if something is
    // playable or not.)
    const extensionRaw = Feed.getFileExtension(theOriginalFileName)

    if (extensionRaw) {
      return `p${aPostId}.${extensionRaw}`
    } else {
      return `p${aPostId}.media`
    }
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
    return await this.getFile(C.INDEX_FILE)
  }

  writeIndex = async () => {
    console.log('indexFileData:\n', this.indexFileData)

    this.indexFileData.timeUtc = Date.now()
    const sIndexFileData = JSON.stringify(this.indexFileData)
    await this.userSession.putFile(C.INDEX_FILE, sIndexFileData, {encrypt: false})
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
          console.error(`Error creating ${C.INDEX_FILE}.\n${error}`)
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
            if (firebaseInstance.likesNumber(postData.id)) {
              postData.likes = firebaseInstance.likesNumber(postData.id)
            }
            else {
              postData.likes = 0
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

    // TODO: check this.showPostId and if set to something in the model, do the
    //       toggleArticleModal work (i.e. set state appropriately to show the
    //       modal).
    let validShowArg = false
    if (this.showPostId) {
      for (const dataItem of data) {
        if (dataItem.id === this.showPostId) {
          this.articleModalItem = dataItem
          validShowArg = true
          break
        }
      }
    }

    if (validShowArg) {
      this.setState({
        initializing: false,
        data,
        showArticleModal: true
      })
    } else {
      this.setState({
        initializing: false,
        data
      })
    }
  }

  /*
   * End Feed utilities
   *****************************************************************************
   */

  extractItemKey = (item) => {
    return `${item.id}`
  }

  onItemPressed = (item, logEvent) => {
    if (logEvent)
      logEvent('Post Clicked')
    // firebaseInstance.clickPost(item.id, firebaseInstance.getUserId())
    this.toggleArticleModal(item)
  }

  handleLogin = (event, logEvent) => {
    if (this.state.isSignedIn) {
      this.userSession.signUserOut(window.location.href);
    } else {
      event.preventDefault()
      if (logEvent)
        logEvent('Button Pressed')
      this.userSession.redirectToSignIn();
    }
  }

  toggleShareModal = (aPost=undefined) => {
    if (aPost) {
      // The 2nd variant of this conditional isn't done yet, but will be when we
      // release publically.
      const url = (this.campaignName) ?
        `https://www.referenda.io/${this.campaignName}/${aPost.id}` :
        `${this.mediaUrlRoot}/${aPost.id}`

      this.shareModelContent = {
          url:url,
          id: aPost.id,
          twitterTitle: aPost.title,
          facebookQuote: aPost.title,
          emailSubject: aPost.title,
          emailBody: Feed.getTruncatedStr(aPost.description, 255)
        }
    } else {
      this.shareModelContent = undefined
    }

    this.setState({showShareModal: !this.state.showShareModal})
  }

  toggleSquareModal = () => {
    this.setState({showSquareModal: !this.state.showSquareModal})
  }

  togglePhoneModal = () => {
    this.setState({showPhoneModal: !this.state.showPhoneModal})
  }

  toggleArticleModal = (item=undefined) => {
    this.articleModalItem = item
    this.setState({showArticleModal: !this.state.showArticleModal})
  }

  toggleMessageModal = () => {
    this.setState({showMessageModal: !this.state.showMessageModal})
  }

  // Safe on emoji / unicode
  static getTruncatedStr(aString, aTruncatedLen=256) {
    try {
      if (Array.from(aString).length > aTruncatedLen) {
        return `${runes.substr(aString, 0, aTruncatedLen)} ...`
      }
    } catch (suppressedError) {}

    return aString
  }

  renderItem = ({ item }) => {
    const MAX_CARD_WIDTH = 512

    let image = undefined
    try {
      if (item.media) {
        const itemUrl = `${this.mediaUrlRoot}/${item.media.fileName}`
        if (item.media.type === C.MEDIA_TYPES.IMAGE) {
          image = (
            <Amplitude eventProperties={{campaign: this.campaignName, postId: item.id, userId: firebaseInstance.getUserId()}}>
              {({ logEvent }) =>
                <TouchableOpacity
                  delayPressIn={70}
                  activeOpacity={0.8}
                  onPress={() => this.onItemPressed(item, logEvent)}>
                  <FitImage source={{uri: itemUrl}} />
                </TouchableOpacity>
              }
            </Amplitude>
          )
        } else if (item.media.type === C.MEDIA_TYPES.VIDEO) {
          // const canPlayStr =
          //   `ReactPlayer.canPlay = ${ReactPlayer.canPlay(itemUrl)}`
          image = (
            <ReactPlayer
              width='100%'
              controls={true}
              light={false}
              muted={true}
              playing={!isMobile}
              url={itemUrl} />
          )
        }
      }
    } catch (suppressedError) {
      console.log(`Couldn't render item.\n${suppressedError}`)
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

    let fcData = {
      avatarImg: undefined,
      fcBackgroundImg: undefined,
      nameStr: 'Your Name',
      positionStr: 'Your Position',
      followers: '0'
    }
    if (this.mediaUrlRoot in C.FIRST_CARD_WORKAROUND) {
      fcData = C.FIRST_CARD_WORKAROUND[this.mediaUrlRoot]
    }

    let firstCard = undefined
    if ((this.state.data.length > 0) &&
        item.id === this.state.data[0].id) {
      const firstCardStyle = {
        width: '100%',
        height: '33vh'
      }
      if (!isMobile) {
        firstCardStyle.maxWidth = 2*MAX_CARD_WIDTH
      }

      // Allow the user to edit the first card data.
      let editButton = undefined
      // TODO: finish this:
      // if (this.state.isSignedIn) {
      //   editButton = (
      //     <Button
      //       small
      //       rounded
      //       success
      //       bordered
      //       style={{borderColor:'lightgray', marginRight: 10}}
      //       onPress={() => this.handleFirstCardEditorRequest()}>
      //       <Icon name='create'/>
      //     </Button>
      //   )
      // }

      firstCard = (
        <ImageBackground
          source={{uri: fcData.fcBackgroundImg}}
          resizeMode='cover'
          style={firstCardStyle}>
          <View style={{width:'100%', height:'100%', backgroundColor:'rgba(0,0,0,0.4)',
                        flexDirection:'column', justifyContent:'flex-end',}}>
            <View>
              <Thumbnail large style={{marginLeft:10, borderWidth:2, borderColor:'white', borderStyle:'solid'}} source={fcData.avatarImg}/>
            </View>
            <View style={{width:'100%', height:10}} />
            <Text style={styles.firstCardNameText}>{fcData.nameStr}</Text>
            <View style={{width:'100%', height:10}} />
            <Text style={styles.firstCardPositionText}>{fcData.positionStr}</Text>
            <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
              <Text style={styles.firstCardFolowersNumber}>{fcData.followers}
                <Text style={styles.firstCardFollowersText}> Followers</Text>
              </Text>
              {editButton}
            </View>
            <View style={{width:'100%', height:10}} />
          </View>
        </ImageBackground>
      )
    }

    const widthStyle = {}
    if (!isMobile) {
      widthStyle.width = 512
    } else {
      widthStyle.width = '100%'
    }

    return (
      <View style={{alignItems:'center'}}>
        {firstCard}
        <View style={widthStyle}>
          <Card style={{flex: 0}}>
            <Amplitude eventProperties={{campaign: this.campaignName, postId: item.id, userId: firebaseInstance.getUserId()}}>
              {({ logEvent }) =>
                <CardItem bordered>
                  <Thumbnail source={fcData.avatarImg}/>
                  <Body style={{marginHorizontal:10}}>
                    <Text style={styles.postTitleText}>
                      {(isMobile ? Feed.getTruncatedStr(item.title) : item.title)}
                    </Text>
                    <Text style={styles.postTimeText}>{timeStr}</Text>
                  </Body>
                  <Button
                    bordered style={{borderColor:'lightgray'}}
                    small
                    rounded
                    info
                    onPress={() => {
                      logEvent('Feed share button pressed')
                      this.toggleShareModal(item)}}
                  >
                    <Icon name='share-alt' />
                  </Button>
                </CardItem>
              }
            </Amplitude>
            <CardItem>
              <Body>
                {/* FitImage needs this view or it doesn't understand the width to size the image height to.' */}
                <View style={{width:'100%'}}>
                  {image}
                </View>
                <TouchableOpacity
                  delayPressIn={70}
                  activeOpacity={0.8}
                  onPress={() => this.onItemPressed(item)}>
                  <View style={{padding:10, width:'100%'}}>
                    <Text style={styles.postBodyText}>
                      {(isMobile ? Feed.getTruncatedStr(item.description) : Feed.getTruncatedStr(item.description, 512))}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Body>
            </CardItem>
            <SocialBar
              chatFunction={() => this.toggleMessageModal()}
              paymentFunction={() => this.togglePhoneModal()}
              likeFunction={() => this.handlePostLike(item.id)}
              likeCount={item.likes}
              id={item.id}
              origin={'feed'}
              campaignName={this.props.campaignName}
            />
            {editorControls}
          </Card>
        </View>
      </View>
    );
  }

  getFeedButton = (aKey) => {
    const isLogin = (aKey === 'LoginMenu')
    const buttonName = (isLogin) ?
      ( (this.state.isSignedIn) ? 'Log Out' : 'Log In' ) :
      ( isMobile ? 'New Post' : 'New Post ...' )
    const buttonText = (isMobile && (buttonName !== 'Log In')) ?
      undefined :
      (<Text style={styles.feedButtonText} uppercase={false}>{buttonName}</Text>)
    const handlerFn = (isLogin) ? this.handleLogin : this.handlePostEditorRequest
    const icon = (isLogin) ?
      (this.state.isSignedIn) ? 'log-out' : 'log-in' : 'create'
    return (
      <Amplitude eventProperties={{campaign: this.campaignName, buttonAction: icon, isMobile, userId: firebaseInstance.getUserId()}}>
        {({ logEvent }) =>
          <Button
            small={isMobile}
            success
            iconLeft={!isMobile}
            bordered
            style={styles.feedButton}
            onPress={(event) => handlerFn(event, logEvent)}>
            <Icon style={{marginLeft:0, marginRight:0}} name={icon}/>
            {buttonText}
          </Button>
        }
      </Amplitude>
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

  getPostEditorButton = (buttonName, handlerFn, icon, handlerArg, medium=true) => {
    const fontStyle = (medium) ?
      styles.postEditorButtonTextLarge : styles.postEditorButtonTextSmall

    const buttonText = (<Text style={fontStyle} uppercase={false}>{buttonName}</Text>)
    const danger = ((buttonName === 'Cancel') || (buttonName === 'X'))
    const info = (buttonName === 'Post')
    const success = !info && !danger
    const onPress = (handlerArg) ?
      () => handlerFn(handlerArg) :
      () => handlerFn()

    const buttonSizeSmall = (isMobile) ? true : (!medium)
    return (
      <Amplitude eventProperties={{campaign: this.campaignName, userId: firebaseInstance.getUserId()}}>
        {({ logEvent }) =>
          <Button
            bordered style={{borderColor:'lightgray', borderRadius:10}}
            iconLeft
            small={buttonSizeSmall}
            medium={buttonSizeSmall}
            info={info}
            success={success}
            danger={danger}
            onPress={() => {
              logEvent(`${buttonName} pressed`)
              onPress()}}>
            <Icon name={icon} />
            {buttonText}
          </Button>
        }
      </Amplitude>
    )
  }

  renderPostEditor = () => {
    console.log(this.state.mediaUploading)
    const uploadStatusView = (this.state.mediaUploading) ?
      (
        <View
          style={{
            marginTop:0,
            marginBottom: 15,
            width:'100%'}}>

            <Text style={{textAlign: 'center', color: 'rgb(204,204,204)'}}>{this.state.mediaUploading}</Text>
        </View>
      ) :
      undefined

    return (
      <Content>
        <Card style={{marginLeft:(isMobile? 2 : 0), marginRight:(isMobile ? 2 : 0)}}>
          <CardItem header>
            <Text style={styles.postTitleText}>New Post</Text>
          </CardItem>
          <CardItem bordered>
            <View style={{flex: 1, flexDirection: 'column'}}>
              <View
                style={{
                  borderStyle:'dashed',
                  borderWidth: 2,
                  borderRadius: 10,
                  borderColor:'rgb(204,204,204)',
                  marginHorizontal:15,
                  marginVertical:15,
                  flex:1}}>
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

  handleFirstCardEditorRequest = () => {

  }

  handlePostEditorRequest = () => {
    this.newPostId = Date.now()
    this.newPostTitle = undefined
    this.newPostDescription = undefined
    this.newPostMedia = undefined

    this.setState({ editingPost: true })
  }

  handlePostEditorCancel = () => {
    this.newPostId = undefined
    this.newPostTitle = undefined
    this.newPostDescription = undefined
    this.newPostMedia = undefined

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
      media: this.newPostMedia,
      id: this.newPostId,
      time: Date.now(),
    }

    try {
      const stringifiedPostData = JSON.stringify(postData)
      await this.userSession.putFile(
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
      console.error(`Error saving ${C.INDEX_FILE}.\n${error}`)
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

  handlePostLike = async (aPostId, logEvent) => {
    const uid = firebaseInstance.getUserId()
    let updatedData = [ ...this.state.data ]
    for (const index in updatedData) {
      const postId = updatedData[index].id
      if (postId === aPostId) {
        if (!firebaseInstance.userLikeExists(postId, uid)) {
          // firebaseInstance.likePost(postId, uid)
          const newLikeCount = updatedData[index].likes + 1
          updatedData[index].likes = newLikeCount
          await firebaseInstance.loadSnapshot()
          this.setState({
            data: updatedData
          })
        }
      }
    }
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
      console.error(`Error saving ${C.INDEX_FILE}.\n${error}`)
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
      const emptyPostData = {}
      const sPostData = JSON.stringify(emptyPostData)
      await this.userSession.putFile(postFileName, sPostData, {encrypt: false})
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
      console.error(`Error saving ${C.INDEX_FILE}.\n${error}`)
      this.setState({ saving: false })
      return
    }

    // 3. Update the data for this view
    //
    let deletedPostData = undefined
    let updatedData = [ ...this.state.data ]
    for (const index in updatedData) {
      const id = updatedData[index].id
      if (id === aPostId) {
        const removedEleArr = updatedData.splice(index, 1)
        deletedPostData = (removedEleArr && removedEleArr.length > 0) ?
          removedEleArr[0] : undefined
        break;
      }
    }

    this.setState({
       saving: false,
       data: updatedData
     })

    // 4. Get the post & check for media files--if there are any, delete them
    //    too:
    if (deletedPostData &&
        deletedPostData.hasOwnProperty('media') &&
        deletedPostData.media) {
      try {
        const fileNameToDel = deletedPostData.media.fileName

        this.userSession.putFile(fileNameToDel, JSON.stringify({}), {encrypt: false})
        .then(() => {
          console.log(`Deleted ${fileNameToDel}.`)
        })
        .catch((suppressedError) => {
          console.log(`Unable to delete ${fileNameToDel}.\n${suppressedError}`)
        })
      } catch (error) {
        console.error(`Problems while deleting media files associated with post ${aPostId}.\n${error}`)
      }
    }
  }

  static getFileExtension (aFileName) {
    // See: https://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript
    const re = /(?:\.([^.]+))?$/
    const extensionRaw = re.exec(aFileName)[1]

    return extensionRaw
  }

  getFileType = (aFileName) => {
    try {
      const extensionRaw = Feed.getFileExtension(aFileName)

      if (extensionRaw) {
        const extensionLc = extensionRaw.toLowerCase()

        if (C.IMAGE_EXTENSIONS.includes(extensionLc)) {
          return C.MEDIA_TYPES.IMAGE
        } else if (C.VIDEO_EXTENSIONS.includes(extensionLc)) {
          return C.MEDIA_TYPES.VIDEO
        }
      }
    } catch (suppressedError) {}
    return C.MEDIA_TYPES.UNKNOWN
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
        //   this.newPostMedia = {
        //     name: file.name,
        //     type: file.type,
        //     data: undefined
        //   }
        // }

        const msg = `${this.state.mediaUploading} read. Uploading ...`
        this.setState({mediaUploading: msg})

        // Now set newPostMedia values and upload the file:
        this.newPostMedia = {
          originalFileName: firstFile.name,
          fileName: Feed.getPostMediaFileName(this.newPostId, firstFile.name),
          size: firstFile.size,
          type: this.getFileType(firstFile.name)
        }

        const postMediaDataBuffer = reader.result

        this.userSession.putFile(
          this.newPostMedia.fileName, postMediaDataBuffer, { encrypt: false })
        .then(() => {
          this.setState({mediaUploading: `Media file uploaded: ${this.newPostMedia.originalFileName}`})
        })
        .catch((error) => {
          this.setState({mediaUploading: `Unable to upload file: ${this.newPostMedia.originalFileName}`})
        })
      }

      this.setState({mediaUploading: `Processing ${firstFile.name} ...`})

      //
      // If the file is too big, return and set state with a message.
      if (firstFile.size > 24500000) {
        this.setState({mediaUploading: `${firstFile.name} is too large. Try a file less than 24Mb.`})
        return
      }
      //
      // If the file is the wrong type, return and set state with a message.
      if (!this.getFileType(firstFile.name)) {
        this.setState({mediaUploading: `${firstFile.name} is an unsupported type.\nSupported image types: ${C.IMAGE_EXTENSIONS.join()}\nSupported video types: ${C.VIDEO_EXTENSIONS.join()}`})
        return
      }

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
    const loginButton = (!this.state.editingPost) ?
      this.getFeedButton('LoginMenu') : undefined
    const newPostOrLogo = (!this.state.editingPost && this.state.isSignedIn) ?
      this.getFeedButton('ArticleMenu') :
      undefined

    const leftHeaderContent =
      ( <Text style={styles.headerLogoText} onPress={()=>Linking.openURL('https://referenda.io')}>Referenda</Text> )

    // const leftHeaderContent = (
    //   <View style={{height:(isMobile ? 21 : 31), width:(isMobile ? 113 : 166)}}>
    //     <TouchableOpacity
    //       delayPressIn={70}
    //       activeOpacity={0.8}
    //       onPress={()=>Linking.openURL('https://referenda.io')}>
    //       <Image style={{height:(isMobile ? 21 : 31), width:(isMobile ? 128 : 189)}} source={require('../data/img/logo.png')} />
    //     </TouchableOpacity>
    //   </View>)

    const rightHeaderContent = (
      <View style={{flexDirection:'row', justifyContent:'flex-end'}}>
        {loginButton}
        <View style={{width:5}} />
        {newPostOrLogo}
      </View>
    )
    // const leftHeaderContent = (this.state.isSignedIn) ? loginButton : newPostOrLogo
    // const rightHeaderContent = (this.state.isSignedIn) ? newPostOrLogo : loginButton

    let activityIndicator = undefined
    if (this.state.initializing || this.state.saving) {
      const aiText = (this.state.initializing) ? ' Loading ...' : 'Saving ...'
      activityIndicator = (
        <View style={{paddingVertical:10, alignItems:'center', flexDirection:'row', justifyContent:'center', marginVertical:50, borderStyle:'solid', borderWidth:1, borderRadius:5, borderColor:'rgba(242, 242, 242, 1)'}}>
            <ActivityIndicator size='large' color='black'/>
            <Text style={{fontFamily:'arial', fontSize:27, color:'rgba(242, 242, 242, 1)'}}> {aiText}</Text>
        </View> )
    }

    let headerContentStyle = {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: (isMobile ? 5 : 0),
      paddingRight: (isMobile ? 5 : 0),
      alignItems: 'center'
    }
    if (!isMobile) {
      headerContentStyle.maxWidth = 1024
    }

    return (
      <Container>
        <LogOnMount eventType="Campaign Viewed" eventProperties={{campaign: this.campaignName, userId: firebaseInstance.getUserId()}} />
        <ModalContainer
          component={<ShareBar campaignName={this.props.campaignName} content={this.shareModelContent}/>}
          showModal={this.state.showShareModal}
          toggleModal={this.toggleShareModal}
          modalHeader='Social Share'
        />
        {/*<ModalContainer
          component={<SquareContainer />}
          showModal={this.state.showSquareModal}
          toggleModal={this.toggleSquareModal}
          modalHeader='Campaign Donation'
        />*/}
        <ModalContainer
          component={<PhoneNumber campaignName={this.state.campaignName} toggleModal={this.togglePhoneModal}/>}
          showModal={this.state.showPhoneModal}
          toggleModal={this.togglePhoneModal}
          modalHeader='Text Campaign Donation Link'
        />
        <ModalContainer
          component={ <ArticleContainer
                          toggleModal={this.toggleArticleModal}
                          togglePhoneModal={this.togglePhoneModal}
                          item={this.articleModalItem}
                          campaignName={this.campaignName}
                          mediaUrlRoot={this.mediaUrlRoot}
                          handlePostLike={(id) => this.handlePostLike(id)}
                          />}
          showModal={this.state.showArticleModal}
          toggleModal={this.toggleArticleModal}
          modalHeader='Article View'
        />
        <ModalContainer
          component={<AppSignUp toggleModal={this.toggleMessageModal}/>}
          showModal={this.state.showMessageModal}
          toggleModal={this.toggleMessageModal}
          modalHeader='App Sign Up'
        />
        <Header transparent style={styles.headerStyle}>
          <View style={headerContentStyle}>
            {leftHeaderContent}
            {rightHeaderContent}
          </View>
        </Header>

        <View style={{paddingHorizontal:(isMobile ? '0vh': '15vh')}} >
          {postEditor}
          {activityIndicator}
        </View>
        <Grid>
          <FlatList
            data={this.state.data}
            renderItem={this.renderItem}
            keyExtractor={this.extractItemKey}
            style={styles.container} />
        </Grid>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  headerLogoText: {
    fontFamily:'arial',
    fontSize: (isMobile ? 27 : 40),
    color:'gray'
  },
  feedButtonText: {
    fontFamily:'arial',
    fontSize: (isMobile ? 14 : 27)
  },
  feedButton: {
    borderRadius: (isMobile ? 10 : 15)
  },
  postTitleText: {
    fontFamily:'arial',
    fontSize: (isMobile ? 20 : 27)
  },
  postTimeText: {
    fontFamily:'arial',
    fontSize: (isMobile ? 14 : 21),
    fontStyle: 'italic',
    color:'lightgray'
  },
  postBodyText: {
    fontFamily:'arial',
    fontSize: (isMobile ? 14 : 21),
  },
  firstCardNameText: {
    paddingHorizontal: 10,
    fontFamily:'arial',
    fontSize: (isMobile ? 16 : 21),
    fontWeight:'bold',
    color:'white',
  },
  firstCardPositionText: {
    paddingHorizontal: 10,
    fontFamily:'arial',
    fontSize: (isMobile ? 14 : 16),
    color:'white',
  },
  firstCardFollowersText: {
    fontFamily:'arial',
    fontSize: (isMobile ? 14 : 16),
    fontWeight:'normal',
    color:'white'
  },
  firstCardFolowersNumber: {
    paddingHorizontal: 10,
    fontFamily:'arial',
    fontSize: (isMobile ? 14 : 16),
    fontWeight:'bold',
    color:'white'
  },
  postEditorButtonTextLarge: {
    fontFamily:'arial',
    fontSize: (isMobile ? 20 : 27),
  },
  postEditorButtonTextSmall: {
    fontFamily:'arial',
    fontSize: (isMobile ? 14 : 21),
  },
  container: {
    backgroundColor: 'white',
    paddingHorizontal:0
  },
  headerStyle: {
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: 'center',
    // paddingLeft: (isMobile ? 5 : '15vh'),
    // paddingRight: (isMobile ? 5 : '15vh')
  },
  icon: {
    margin: 5,
  },
});
