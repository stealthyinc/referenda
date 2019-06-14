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
const { firebaseInstance } = require('../utils/firebaseWrapper.js')

const C = require('../utils/constants.js')
const U = require('../utils/utils.js')
const { cloudIO } = require('../utils/cloudIO.js')

export default class Feed extends Component {
  constructor(props) {
    super(props);
    // const origin = window.location.origin;
    const appConfig = new AppConfig(['store_write', 'publish_data', 'email'])
    this.userSession = new UserSession({ appConfig })
    const isSignedIn = this.checkSignedInStatus();
    const userData = isSignedIn && this.userSession.loadUserData();
    const person = (userData.username) ? new Person(userData.profile) : false;

    cloudIO.setSignedIn(isSignedIn)
    cloudIO.setUserSession(this.userSession)

    this.state = {
      userData,
      person,
      isSignedIn,
      data: [],
      editingProfile: false,
      editingPost: false,
      initializing: true,
      saving: false,
      mediaUploading: '',
      showShareModal: false,
      showSquareModal: false,
      showPhoneModal: false,
      showArticleModal: false,
      showMessageModal: false,
      profileImgUploading: undefined,
      bgImgUploading: undefined,
      showUrlBar: undefined,
    };

    this.indexFileData = undefined
    this.configFileData = undefined

    this.newProfileData = {
      avatarImg: '',
      backgroundImg: '',
      nameStr: '',
      descriptionStr: '',
    }

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
      cloudIO.setMediaUrlRoot(this.mediaUrlRoot)
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
        cloudIO.setMediaUrlRoot(this.mediaUrlRoot)

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
          cloudIO.setMediaUrlRoot(this.mediaUrlRoot)
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
          cloudIO.setMediaUrlRoot(this.mediaUrlRoot)
        }
      }
    }

    await this.getIndexFileData()

    // Load the config data to show signed in users the URL bar if needed (only
    // for publishers though).
    if (this.state.isSignedIn) {
      try {
        this.configFileData = await this.readConfig()
        // Next line uncomment to test bar dismiss logic
        // this.configFileData.dismissedUrlBar = false
      } catch (suppressedError) {
        this.configFileData = this.getNewConfig()
        try {
          this.writeConfig()
        } catch (suppressedError2) {}
      }

      if (this.configFileData &&
          !this.configFileData.dismissedUrlBar) {
        this.setState({showUrlBar: true})
      }
    }

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

  static getNewProfile() {
    return {
      avatarImg: '',
      backgroundImg: '',
      nameStr: 'Your Name',
      descriptionStr: 'Your Description',
      followers: 0
    }
  }
  // TODO: make index file data a class. Possibly tie it to a schema.
  getNewIndex = () => {
    return {
      profile: Feed.getNewProfile(),
      pinnedPostId: '',
      descTimePostIds: [],
      version: '1.0',
      timeUtc: undefined
    }
  }

  readIndex = async () => {
    // Note: rawData will be null if the file does not exist.
    return await cloudIO.getFile(C.INDEX_FILE)
  }

  writeIndex = async () => {
    console.log('indexFileData:\n', this.indexFileData)

    this.indexFileData.timeUtc = Date.now()
    const sIndexFileData = JSON.stringify(this.indexFileData)
    await cloudIO.putFile(C.INDEX_FILE, sIndexFileData)
  }

  getNewConfig = () => {
    return {
      dismissedUrlBar: false
    }
  }

  readConfig = async () => {
    // Note: rawData will be null if the file does not exist.
    return await cloudIO.getFile(C.CONFIG_FILE)
  }

  writeConfig = async () => {
    this.configFileData.timeUtc = Date.now()
    const sConfigFileData = JSON.stringify(this.configFileData)
    await cloudIO.putFile(C.CONFIG_FILE, sConfigFileData)
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
    } else if (this.indexFileData && !this.indexFileData.hasOwnProperty('profile')) {
      // Code to handle existing accounts where we hardcoded the profile data
      // downstream--now inject it into the index data.  If the account didn't
      // have hardcoded profile data, set it up with the original default:
      if (this.mediaUrlRoot in C.FIRST_CARD_WORKAROUND) {
        const cProfileData = C.FIRST_CARD_WORKAROUND[this.mediaUrlRoot]
        this.indexFileData.profile = {
          avatarImg: cProfileData.avatarImg,
          backgroundImg: cProfileData.fcBackgroundImg,
          nameStr: cProfileData.nameStr,
          descriptionStr: cProfileData.positionStr,
          followers: cProfileData.followers
        }
      } else {
        this.indexFileData.profile = {
          avatarImg: '',
          backgroundImg: '',
          nameStr: 'Your Name',
          descriptionStr: 'Your Description',
          followers: 0
        }
      }

      // Save the updated index
      try {
        await this.writeIndex()
      } catch (error) {
        console.error(`Error creating ${C.INDEX_FILE}.\n${error}`)
      }
    }

    // 3. Load posts and initialize data.
    const data = []

    // Insert an entry to cause the header to be rendered.
    data.push({
      id:this.getUniqueKey(),
      header:true
    })

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
        const postPath = U.getPostFileName(postId)
        readPromises.push(
          cloudIO.getFile(postPath)
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
            const postData = rawPostData
            postData.pinned = (this.indexFileData.pinnedPostId &&
                  (this.indexFileData.pinnedPostId === postData.id))
            postData.likes = firebaseInstance.likesNumber(postData.id) ?
              firebaseInstance.likesNumber(postData.id) : 0

            data.push(postData)
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
      // If this user has no posts, show the post editor.
      // Also, if they have no profile data, enable the profile editor.
      const editingProfile = (this.state.isSignedIn &&
                              !this.indexFileData.profile.avatarImg &&
                              !this.indexFileData.profile.backgroundImg &&
                              this.indexFileData.profile.nameStr === 'Your Name' &&
                              this.indexFileData.profile.descriptionStr === 'Your Description')
      if (editingProfile) {
        this.profileEditorRequestSetup()
      }

      const editingPost = (this.state.isSignedIn && (data.length === 1))
      if (editingPost) {
        this.postEditorRequestSetup()
      }

      this.setState({
        initializing: false,
        data,
        editingProfile,
        editingPost,
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
      // this.userSession.signUserOut(window.location.href);
      this.userSession.signUserOut('/');
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
        `https://www.app.referenda.io/${this.campaignName}/${aPost.id}` :
        `${this.mediaUrlRoot}/${aPost.id}`

      this.shareModelContent = {
          url:url,
          id: aPost.id,
          twitterTitle: aPost.title,
          facebookQuote: aPost.title,
          emailSubject: aPost.title,
          emailBody: U.getTruncatedStr(aPost.description, 255)
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

  renderHeader = (headerData) => {
    let statusDisplay = undefined

    if (headerData && headerData.editing) {

      let avatarUploadActivity = undefined
      let avatarStatus = undefined
      if (headerData && headerData.profileImgUploading) {
        if (headerData.profileImgUploading.uploading) {
          avatarUploadActivity = ( <ActivityIndicator size='small' color='white' style={{marginRight:10}}/> )
        }

        if (headerData.profileImgUploading.status) {
          avatarStatus = (<Text style={styles.profileHeaderStatusTextStyle}>{`Set avatar: ${headerData.profileImgUploading.status}`}</Text>)
        }

        if (headerData.profileImgUploading.hasOwnProperty('fileName')) {
          this.newProfileData.avatarImg = headerData.profileImgUploading.fileName
        }
      }

      let backgroundUploadActivity = undefined
      let backgroundStatus = undefined
      if (headerData && headerData.bgImgUploading) {
        if (headerData.bgImgUploading.uploading) {
          backgroundUploadActivity = ( <ActivityIndicator size='small' color='white' style={{marginRight:10}}/> )
        }

        if (headerData.bgImgUploading.status) {
          backgroundStatus = (<Text style={styles.profileHeaderStatusTextStyle}>{`Set background: ${headerData.bgImgUploading.status}`}</Text>)
        }

        if (headerData.bgImgUploading.hasOwnProperty('fileName')) {
          this.newProfileData.backgroundImg = headerData.bgImgUploading.fileName
        }
      }

      statusDisplay = (
        <View style={styles.profileStatusDisplayStyle}>
          <View style={{flexDirection: 'row', justifyContent: 'flexStart'}}>
            {avatarUploadActivity}
            {avatarStatus}
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'flexStart'}}>
            {backgroundUploadActivity}
            {backgroundStatus}
          </View>
        </View>
      )
    }

    // Allow the user to edit the first card data.
    let editButton = undefined
    if (this.state.isSignedIn && !this.state.editingProfile) {
      editButton = (
        <Button small rounded success style={styles.firstCardButtonStyle}
          onPress={() => this.handleProfileEditorRequest()}>
          <Icon name='create'/>
        </Button>
      )
    }

    let cancelButton = undefined
    let saveButton = undefined
    if (this.state.editingProfile) {
      cancelButton = (
        <Button small rounded danger style={styles.firstCardButtonStyle}
          onPress={() => this.handleProfileEditorCancel()}>
          <Icon name='close-circle-outline'/>
        </Button>
      )
      saveButton = (
        <Button small rounded info style={styles.firstCardButtonStyle}
          onPress={() => this.handleProfileEditorSave()}>
          <Icon name='checkbox'/>
        </Button>
      )
    }
    const profileData = this.indexFileData.profile

    let nameLine =
      ( <Text style={styles.firstCardNameTextStyle}>{profileData.nameStr}</Text> )
    if (this.state.editingProfile) {
      nameLine = (
        <Input
          style={styles.profileNameInputStyle}
          multiline={false}
          onChangeText={(text) => {this.newProfileData.nameStr = text}}
          placeholder={profileData.nameStr}
          placeholderTextColor="rgb(242,242,242)"/>
      )
    }

    let descriptionLine =
      ( <Text style={styles.firstCardPositionTextStyle}>{profileData.descriptionStr}</Text> )
    if (this.state.editingProfile) {
      descriptionLine = (
        <Input
          style={styles.profileDescriptionInputStyle}
          multiline={false}
          onChangeText={(text) => {this.newProfileData.descriptionStr = text}}
          placeholder={profileData.descriptionStr}
          placeholderTextColor="rgb(242,242,242)"/>
      )
    }

    const spacer = ( <View style={{width:'100%', height:10}} /> )

    const bgImgStateVarName = 'bgImgUploading'
    const fileFilterObj = {
      maxSize:24500000,
      fileTypes: [C.MEDIA_TYPES.IMAGE]
    }

    // Can't move this to react styles--causes error in translation
    let profileBackgroundDropzoneTextStyle = {
      textAlign:'center',
      marginVertical:3,
      color:'white',
      fontFamily:'arial',
      fontSize:16
    }

    let backgroundDropZone = undefined
    if (this.state.editingProfile) {
      backgroundDropZone = (
        <View style={styles.profileBackgroundDropzoneStyle}>
          <Dropzone onDrop={
            (acceptedFiles) => this.handleUploadRequest(acceptedFiles, bgImgStateVarName, fileFilterObj)
          }>
            {({getRootProps, getInputProps}) => (
              <section>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <div style={profileBackgroundDropzoneTextStyle}>Drag 'n' drop</div>
                  <div style={profileBackgroundDropzoneTextStyle}>or click here to</div>
                  <div style={profileBackgroundDropzoneTextStyle}>set background</div>
                </div>
              </section>
            )}
          </Dropzone>
        </View>
      )
    }

    let avatarImgUrl = `${this.mediaUrlRoot}/${profileData.avatarImg}`
    let profileImgOrDropZone =
      ( <Thumbnail large
          style={styles.profileAvatarStyle}
          source={avatarImgUrl}/> )

    const profileImgStateVarName = 'profileImgUploading'
    if (this.state.editingProfile) {

      // Can't move this to react styles--causes error in translation
      const profileAvatarDropzoneTextStyle = {
        textAlign:'center',
        marginVertical:3,
        color:'white',
        fontFamily:'arial',
        fontSize:12
      }

      if (this.newProfileData && this.newProfileData.avatarImg &&
          this.newProfileData.avatarImg !== this.indexFileData.profile.avatarImg) {
        avatarImgUrl = `${this.mediaUrlRoot}/${this.newProfileData.avatarImg}`
      }

      profileImgOrDropZone = (
        <ImageBackground
          source={{uri: avatarImgUrl}}
          style={styles.profileAvatarDropzoneStyle}
          imageStyle={styles.profileAvatarDropzoneImageStyle}>
          <Dropzone onDrop={
            (acceptedFiles) => this.handleUploadRequest(acceptedFiles, profileImgStateVarName, fileFilterObj)
          }>
            {({getRootProps, getInputProps}) => (
              <section>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <div style={profileAvatarDropzoneTextStyle}>Drag or</div>
                  <div style={profileAvatarDropzoneTextStyle}>click to</div>
                  <div style={profileAvatarDropzoneTextStyle}>set avatar</div>
                </div>
              </section>
            )}
          </Dropzone>
        </ImageBackground>

      )
    }

    let bgImgUrl = `${this.mediaUrlRoot}/${profileData.backgroundImg}`
    if (this.newProfileData && this.newProfileData.backgroundImg &&
        this.newProfileData.backgroundImg !== this.indexFileData.profile.backgroundImg) {
      bgImgUrl = `${this.mediaUrlRoot}/${this.newProfileData.backgroundImg}`
    }
    return (
      <View style={{alignItems:'center'}}>
        <ImageBackground
          source={{uri: bgImgUrl}}
          resizeMode='cover'
          style={styles.firstCardStyle}>
          <View style={{width:'100%', height:'100%', backgroundColor:'rgba(0,0,0,0.4)',
                        flexDirection:'column', justifyContent:'flex-end',}}>
            {statusDisplay}
            <View style={{flexDirection: 'row', width: '100%'}}>
              {profileImgOrDropZone}
              <View style={{flex: 1, flexDirection:'row', justifyContent:'center'}}>
                {backgroundDropZone}
              </View>
            </View>
            {spacer}
            <View style={{paddingHorizontal: 10}}>{nameLine}</View>
            {spacer}
            <View style={{paddingHorizontal: 10, marginBottom:3}}>{descriptionLine}</View>
            <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
              <Text style={styles.firstCardFolowersNumber}>{profileData.followers}
                <Text style={styles.firstCardFollowersText}> Followers</Text>
              </Text>
              <View style={{flexDirection:'row', justifyContent:'flex-end'}}>
                {cancelButton}
                {saveButton}
                {editButton}
              </View>
            </View>
            {spacer}
          </View>
        </ImageBackground>
      </View>
    )
  }

  getUniqueKey() {
    return Date.now()
  }

  renderItem = ({ item }) => {
    // Render the header.
    if (item && item.hasOwnProperty('header') && item.header) {
      console.log(`renderItem: rendering header call for item`, item)
      return this.renderHeader(item)
    }

    if (item && item.hasOwnProperty('postEditor') && item.postEditor) {
      return this.renderPostEditor()
    }

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

    const widthStyle = {
      width: (isMobile ? '100%' : C.MAX_CARD_WIDTH)
    }

    let profileImg = undefined
    if (this.indexFileData.profile.avatarImg) {
      const profileImgUrl = `${this.mediaUrlRoot}/${this.indexFileData.profile.avatarImg}`
      profileImg =
        ( <Thumbnail source={profileImgUrl}/> )
    }

    return (
      <View style={{alignItems:'center'}}>
        <View style={widthStyle}>
          <Card style={{flex: 0}}>
            <Amplitude eventProperties={{campaign: this.campaignName, postId: item.id, userId: firebaseInstance.getUserId()}}>
              {({ logEvent }) =>
                <CardItem bordered>
                  {profileImg}
                  <Body style={{marginHorizontal:10}}>
                    <Text style={styles.postTitleText}>
                      {(isMobile ? U.getTruncatedStr(item.title) : item.title)}
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
                      {(isMobile ? U.getTruncatedStr(item.description) : U.getTruncatedStr(item.description, 512))}
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

  /*
   * Feed Button methods
   */
  getLogInFeedButton = () => {
    const icon = this.state.isSignedIn ? 'log-out' : 'log-in'
    const buttonName = this.state.isSignedIn ? 'Log Out' : 'Log In'
    const buttonText = (isMobile && (buttonName !== 'Log In')) ?
      undefined :
      ( <Text style={styles.feedButtonText} uppercase={false}>
          {buttonName}
        </Text> )

    return (
      <Amplitude eventProperties={{campaign: this.campaignName, buttonAction: icon, isMobile, userId: firebaseInstance.getUserId()}}>
        {({ logEvent }) =>
          <Button success bordered small={isMobile} iconLeft={!isMobile}
            style={styles.feedButton}
            onPress={(event) => this.handleLogin(event, logEvent)}>
            <Icon style={{marginLeft:0, marginRight:0}} name={icon}/>
            {buttonText}
          </Button>
        }
      </Amplitude>
    )
  }

  getNewPostFeedButton = () => {
    const icon = 'create'
    const buttonText = !isMobile ?
      ( <Text style={styles.feedButtonText} uppercase={false}>
          New Post ...
        </Text> ) :
      undefined

    if (isMobile) {
      return (
        <View style={{
          flexDirection:'row',
          position: 'absolute',
          bottom: 10,
          right: 15}}>
          <Amplitude eventProperties={{campaign: this.campaignName, buttonAction: icon, isMobile, userId: firebaseInstance.getUserId()}}>
            {({ logEvent }) =>
              <Button large
                style={{
                  backgroundColor: 'rgba(92, 184, 92, 0.75)',
                  height:60,
                  width:60,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 30,
                  borderStyle:'solid',
                  borderTopWidth:1,
                  borderBottomWidth:1,
                  borderRightWidth:1,
                  borderLeftWidth:1,
                  borderColor:'gray'}}
                onPress={(event) => this.handlePostEditorRequest(event, logEvent)}>
                <Icon name={icon}/>
                {buttonText}
              </Button>
            }
          </Amplitude>
        </View>
      )
    } else {
      return (
        <Amplitude eventProperties={{campaign: this.campaignName, buttonAction: icon, isMobile, userId: firebaseInstance.getUserId()}}>
          {({ logEvent }) =>
            <Button success bordered small={isMobile} iconLeft={!isMobile}
              style={styles.feedButton}
              onPress={(event) => this.handlePostEditorRequest(event, logEvent)}>
              <Icon style={{marginLeft:0, marginRight:0}} name={icon}/>
              {buttonText}
            </Button>
          }
        </Amplitude>
      )
    }
  }

  getContactUsFeedButton = () => {
    const icon = 'mail-open'

    return (
      <Amplitude eventProperties={{campaign: this.campaignName, buttonAction: icon, isMobile, userId: firebaseInstance.getUserId()}}>
        {({ logEvent }) =>
          <Button success bordered small={isMobile} iconLeft={!isMobile}
            style={styles.feedButton}
            onPress={(event) => {Linking.openURL('mailto:campaign@referenda.io?subject=help with campaign&body=')}}>
            <Icon style={{marginLeft:0, marginRight:0}} name={icon}/>
          </Button>
        }
      </Amplitude>
    )
  }

  getShareFeedButton = () => {
    const icon = 'share-alt'

    return (
      <Amplitude eventProperties={{campaign: this.campaignName, buttonAction: icon, isMobile, userId: firebaseInstance.getUserId()}}>
        {({ logEvent }) =>
          <Button success bordered small={isMobile} iconLeft={!isMobile}
            style={styles.feedButton}
            onPress={(event) => {this.setState({showUrlBar: true})}}>
            <Icon style={{marginLeft:0, marginRight:0}} name={icon}/>
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

    const editorWidthStyle = {
      width: (isMobile ? '100%' : C.MAX_CARD_WIDTH)
    }

    return (
      <View style={{width:'100%', alignItems:'center'}} >
        <View style={editorWidthStyle} >
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
        </View>
      </View>
    )
  }

  profileEditorRequestSetup = () => {
    const profileData = this.indexFileData.profile
    this.newProfileData = {
      avatarImg: profileData.avatarImg,
      backgroundImg: profileData.backgroundImg,
      nameStr: profileData.nameStr,
      descriptionStr: profileData.descriptionStr,
    }
  }
  handleProfileEditorRequest = () => {
    this.profileEditorRequestSetup()
    this.setState({ editingProfile: true })
  }

  handleProfileEditorCancel = () => {
    this.newProfileData = {
      avatarImg: '',
      backgroundImg: '',
      nameStr: '',
      descriptionStr: '',
    }
    this.setState({
      profileImgUploading: undefined,
      bgImgUploading: undefined,
      editingProfile: false
    })
  }

  handleProfileEditorSave = async () => {
    //
    // 1. Compare the profile data to the existing and save any changes, storing
    //    a list of replaced files to delete.
    //
    let saveRequired = false
    const profileImagesToDelete = []
    for (const property of ['avatarImg', 'backgroundImg', 'nameStr', 'descriptionStr']) {
      if (this.indexFileData.profile[property] !== this.newProfileData[property]) {
        saveRequired = true
        if (property === 'avatarImg' || property === 'backgroundImg') {
          if (this.indexFileData.profile[property]) {
            profileImagesToDelete.push(this.indexFileData.profile[property])
          }
        }

        this.indexFileData.profile[property] = this.newProfileData[property]
      }
    }
    try {
      // TODO: Present the user with status messaging in the header.
      if (saveRequired) {
        await this.writeIndex()
      }
    } catch (error) {
      // TODO: Present the user with a message. Indicating the problem.
      // We don't shut down the editor b/c they can still cancel out.
      console.error(`Error saving ${C.INDEX_FILE}.\n${error}`)
      return
    }

    //
    // 2. Update the data that the user is viewing and close the editor.
    //
    const newData = [ ...this.state.data ]
    this.setState({ data: newData, editingProfile: false })

    // 3. Delete the replaced profile images (don't block on this)
    //
  }

  postEditorRequestSetup = () => {
    this.newPostId = Date.now()
    this.newPostTitle = undefined
    this.newPostDescription = undefined
    this.newPostMedia = undefined
  }

  handlePostEditorRequest = () => {
    this.postEditorRequestSetup()
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
    const postFileName = U.getPostFileName(this.newPostId)
    const postData = {
      title: this.newPostTitle,
      description: this.newPostDescription,
      media: this.newPostMedia,
      id: this.newPostId,
      time: Date.now(),
    }

    try {
      const stringifiedPostData = JSON.stringify(postData)
      await cloudIO.putFile(postFileName, stringifiedPostData)
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
    //
    // new post index either starts at 1 if their is no pinned post or 2 if
    // there is a pinned post b/c of the header which is the 0th post (0th index)
    //
    const newPostIndex = (this.indexFileData.pinnedPostId) ? 2 : 1
    const newData = [ ...this.state.data ]
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
          firebaseInstance.likePost(postId, uid)
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
        // Was an unshift, but now a splice to position 1 because of header post:
        //
        // updatedData.unshift(postToPin)
        //
        updatedData.splice(1, 0, postToPin)
      }
    } else { // unpinning
      // A. Find the post to unpin in the current render list and remove it:
      //
      let postToUnpin = undefined
      for (const index in updatedData) {
        const postId = updatedData[index].id
        if (postId === aPostId) {
          if (index === "1") {
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
            if (index === "1") {
              // Special case (1)

              // Was an unshift, but now a splice to position 1 because of header post:
              //
              // updatedData.unshift(postToUnpin)
              //
              updatedData.splice(1, 0, postToUnpin)

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
    const postFileName = U.getPostFileName(aPostId)
    try {
      const emptyPostData = {}
      const sPostData = JSON.stringify(emptyPostData)
      await cloudIO.putFile(postFileName, sPostData)
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

    const editingPost = this.state.editingPost || (updatedData.length <= 1)

    this.setState({
       saving: false,
       data: updatedData,
       editingPost
     })

    // 4. Get the post & check for media files--if there are any, delete them
    //    too:
    if (deletedPostData &&
        deletedPostData.hasOwnProperty('media') &&
        deletedPostData.media) {
      try {
        const fileNameToDel = deletedPostData.media.fileName

        cloudIO.putFile(fileNameToDel, JSON.stringify({}))
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

  /** handleUploadRequest:
   *
   *    Processes a list of accepted files from a drop zone, by reading and then
   *    attempting to upload them to a cloud storage.
   *
   *  @param theAcceptedFiles is an array containing file handles to process.
   *                          This method only processes the first file handle
   *                          ignoring any others.
   *  @param aStateObjVarName is a string that is the name of the state variable
   *                          for an object instance storing whether the process
   *                          is active, it's last status string and finally the
   *                          results of this operation if successful:
   *                          this.state.<aStateObjVarName>: {
   *                            active: [true|false],
   *                            status: 'a string'
   *                            originalFileName: 'filename.ext',
   *                            fileName: 'p<32084028930820493>.<ext>',
   *                            size: <a number of bytes>,
   *                            type: <a file type from constants, i.e. MEDIA_TYPES.IMAGE>,
   *                            data: <the data uploaded / read from theAcceptedFiles>
   *                          }
   *  @param aFileFilterObj is an object containing the types of files accepted
   *                        and the maximum file size permitted:
   *                        {
   *                          fileTypes: <An array of file types from constants, i.e. [MEDIA_TYPES.IMAGE]>
   *                          maxSize: <a number of bytes>
   *                        }
   */
  handleUploadRequest = (theAcceptedFiles,
                         aStateObjVarName,
                         aFileFilterObj={ maxSize:24500000, fileTypes:[] }) =>
  {
    if (!theAcceptedFiles || (theAcceptedFiles.length < 1) || !aStateObjVarName) {
      return
    }

    const fileHandle = theAcceptedFiles[0]
    const stateObj = {}
    const reader = new FileReader()

    reader.onabort = () => {
      stateObj[aStateObjVarName] = {
        active: false,
        status: `Processing ${fileHandle.name} aborted.`
      }
      this.setState(stateObj)
    }

    reader.onerror = () => {
      stateObj[aStateObjVarName] = {
        active: false,
        status: `Processing ${fileHandle.name} failed. ${reader.error}`
      }
      this.setState(stateObj)
    }

    reader.onload = () => {
      stateObj[aStateObjVarName] = {
        active: true,
        status: `Uploading ${fileHandle.name}.`
      }
      this.setState(stateObj)

      const uploadConfig = {
        originalFileName: fileHandle.name,
        fileName: U.getPostMediaFileName(Date.now(), fileHandle.name),
        size: fileHandle.size,
        type: U.getFileType(fileHandle.name),
      }

      cloudIO.putFile(uploadConfig.fileName, reader.result)
      .then(() => {
        stateObj[aStateObjVarName] = {
          active: false,
          status: `Uploaded ${fileHandle.name}.`,
          originalFileName: uploadConfig.originalFileName,
          fileName: uploadConfig.fileName,
          size: uploadConfig.size,
          type: uploadConfig.type
        }
        this.setState(stateObj)
      })
      .catch((error) => {
        stateObj[aStateObjVarName] = {
          active: false,
          status: `Uploading ${fileHandle.name} failed. ${error}`
        }
        this.setState(stateObj)
      })
    }

    if (aFileFilterObj) {
      if (aFileFilterObj.hasOwnProperty('maxSize') &&
        (fileHandle.size > aFileFilterObj.maxSize)) {
        // TODO: format status to something a user would understand.
        stateObj[aStateObjVarName] = {
          active: false,
          status: `${fileHandle.name} is too large. It must be less than ${aFileFilterObj.maxSize} bytes.`
        }
        this.setState(stateObj)
        return
      }

      if (aFileFilterObj.hasOwnProperty('fileTypes') &&
          aFileFilterObj.fileTypes) {
        const fileType = U.getFileType(fileHandle.name)
        if (!aFileFilterObj.fileTypes.includes(fileType)) {
          let supportedTypes = ''
          for (const filterType of aFileFilterObj.fileTypes) {
            if (filterType === C.MEDIA_TYPES.VIDEO) {
              supportedTypes += `Supported video types: ${C.VIDEO_EXTENSIONS.join()}. `
            } else if (filterType === C.MEDIA_TYPES.IMAGE) {
              supportedTypes += `Supported image types: ${C.IMAGE_EXTENSIONS.join()}. `
            }
          }

          stateObj[aStateObjVarName] = {
            active: false,
            status: `${fileHandle.name} is an unsupported file type. ${supportedTypes}`
          }
          this.setState(stateObj)
          return
        }
      }
    }

    stateObj[aStateObjVarName] = {
      active: true,
      status: `Reading ${fileHandle.name}.`
    }
    this.setState(stateObj)
    reader.readAsArrayBuffer(fileHandle)
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
          fileName: U.getPostMediaFileName(this.newPostId, firstFile.name),
          size: firstFile.size,
          type: U.getFileType(firstFile.name)
        }

        const postMediaDataBuffer = reader.result

        cloudIO.putFile(this.newPostMedia.fileName, postMediaDataBuffer)
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
      if (!U.getFileType(firstFile.name)) {
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

  handleDismissUrlBar = () => {
    this.setState({showUrlBar: false})
    try {
      this.configFileData.dismissedUrlBar = true
      this.writeConfig()
    } catch (suppressedError) {}
  }

  renderUrlBar = () => {
    if (!this.state.isSignedIn) {
      return undefined
    }

    if (!this.state.showUrlBar) {
      return undefined
    }

    let cancelButton = (
      <Button small rounded danger style={styles.urlBarCancelButtonStyle}
        onPress={() => this.handleDismissUrlBar()}>
        <Icon name='close-circle-outline'/>
      </Button>
    )

    return (
      <View style={{
        width:'100%',
        flexDirection: 'row',
        justifyContent: 'center'
      }}>
        <View style={{
          width:(isMobile ? '100%' : 2*C.MAX_CARD_WIDTH),
          flexDirection:'row',
          justifyContent: 'space-between',
          backgroundColor: '#34bbed',
          padding:15,
          alignItems: 'center',
        }}>
          <Text style={{
            fontFamily: 'arial',
            fontSize: (!isMobile ? 24 : 16),
            color: 'white',
          }}>
            Posts publically visible here: <Text style={{
              fontFamily: 'arial',
              fontSize: (!isMobile ? 24: 16),
              color: 'white',
              fontWeight:'bold'}}>{window.location.href}</Text>
          </Text>
          {cancelButton}
        </View>
      </View>
    )
  }

  render() {
    // console.log('In render, data:', this.state.data)
    // const postEditor = (this.state.editingPost) ?
    //   this.renderPostEditor() : undefined
    const loginButton = (!this.state.editingPost) ? this.getLogInFeedButton() : undefined
    const newPostButton =
      (!this.state.editingPost && this.state.isSignedIn) ? this.getNewPostFeedButton() : undefined
    const contactUsButton = this.getContactUsFeedButton()
    const shareButton = (this.state.isSignedIn) ? this.getShareFeedButton() : undefined

    const newPostButtonMobile = isMobile ? newPostButton : undefined

    const leftHeaderContent =
      ( <Text style={styles.headerLogoText} onPress={()=>Linking.openURL('https://referenda.io')}>Referenda</Text> )

    const buttonSpacer = (<View style={{width:5}} />)
    const rightHeaderContent = isMobile ?
      (
        <View style={{flexDirection:'row', justifyContent:'flex-end'}}>
          {shareButton}
          {buttonSpacer}
          {contactUsButton}
          {buttonSpacer}
          {loginButton}
        </View>
      ) :
      (
        <View style={{flexDirection:'row', justifyContent:'flex-end'}}>
          {shareButton}
          {buttonSpacer}
          {contactUsButton}
          {buttonSpacer}
          {loginButton}
          {buttonSpacer}
          {newPostButton}
        </View>
      )

    let activityIndicator = undefined
    if (this.state.initializing || this.state.saving) {
      const aiText = (this.state.initializing) ? ' Loading ...' : 'Saving ...'
      activityIndicator = (
        <View style={{paddingVertical:10, alignItems:'center', flexDirection:'row', justifyContent:'center', marginVertical:50, borderStyle:'solid', borderWidth:1, borderRadius:5, borderColor:'rgba(242, 242, 242, 1)'}}>
            <ActivityIndicator size='large' color='black'/>
            <Text style={{fontFamily:'arial', fontSize:27, color:'rgba(242, 242, 242, 1)'}}> {aiText}</Text>
        </View> )
    }

    const headerWidthStyle = {
      width: (isMobile ? '100%' : 2*C.MAX_CARD_WIDTH)
    }

    let feedData = [...this.state.data]   // shallow copy

    // Logic to update the header
    if (feedData && feedData.length > 0) {
      const headerItem = feedData[0]
      headerItem.editing = this.state.editingProfile

      try { // DO NOT COMBINE TRY BLOCK WITH OTHERS
        headerItem.profileImgUploading = {
          uploading: this.state.profileImgUploading.active,
          status: this.state.profileImgUploading.status,
          // data: this.profileImgUploading.data,
        }

        headerItem.profileImgUploading.fileName = this.state.profileImgUploading.fileName
        // headerItem.profileImgUploading.data = this.state.profileImgUploading.data
      } catch (suppressedError) {}

      try { // DO NOT COMBINE TRY BLOCK WITH OTHERS
        headerItem.bgImgUploading = {
          uploading: this.state.bgImgUploading.active,
          status: this.state.bgImgUploading.status,
        }

        headerItem.bgImgUploading.fileName = this.state.bgImgUploading.fileName
        // headerItem.bgImgUploading.data = this.state.bgImgUploading.data
      } catch (suppressedError) {}
    }

    if (this.state.editingPost) {
      // Append a feed editor cue object for render items
      feedData.splice(1, 0,
        {
          id: this.getUniqueKey(),
          postEditor: true
        })
    }

    let avatarImg = undefined
    try {
      avatarImg = this.indexFileData.profile.avatarImg
    } catch (suppressedError) {}

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
                          avatarImg={avatarImg}
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
        {this.renderUrlBar()}
        <Header transparent style={styles.headerStyle}>
          <View style={styles.headerContentStyle}>
            {leftHeaderContent}
            {rightHeaderContent}
          </View>
        </Header>

        <View style={{width:'100%', alignItems:'center'}} >
          <View style={headerWidthStyle} >
            { /* postEditor */ }
            {activityIndicator}
          </View>
        </View>
        <Grid>
          <FlatList
            data={feedData}
            renderItem={this.renderItem}
            keyExtractor={this.extractItemKey}
            style={styles.container} />
        </Grid>
        {newPostButtonMobile}
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
  headerStyle: {
    flexDirection: "row",
    alignItems: 'center',
  },
  headerContentStyle: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: (isMobile ? 5 : 0),
    paddingRight: (isMobile ? 5 : 0),
    alignItems: 'center',
    maxWidth: (isMobile ? '100%' : 2*C.MAX_CARD_WIDTH)
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
  firstCardStyle: {
    width: '100%',
    height: '33vh',
    minHeight: 200,
    maxWidth: (isMobile ? '100%' : 2 * C.MAX_CARD_WIDTH)
  },
  firstCardButtonStyle: {
    borderColor:'lightgray',
    borderStyle:'solid',
    borderTopWidth:1,
    borderBottomWidth:1,
    borderLeftWidth:1,
    borderRightWidth:1,
    marginRight: 10
  },
  urlBarCancelButtonStyle: {
    marginRight: 0,
    marginLeft: 0,
  },
  firstCardNameTextStyle: {
    fontFamily:'arial',
    fontSize: (isMobile ? 16 : 21),
    fontWeight:'bold',
    color:'white',
    marginBottom:1,   // Accounts for line when editing
  },
  firstCardPositionTextStyle: {
    fontFamily:'arial',
    fontSize: (isMobile ? 14 : 16),
    color:'white',
    marginBottom:1, // Accountes for editing line
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
  icon: {
    margin: 5,
  },
  profileHeaderStatusTextStyle: {
    fontFamily:'arial',
    fontSize: (isMobile ? 14 : 16),
    color: 'white',
    marginBottom: 3,
  },
  profileStatusDisplayStyle: {
    width:'100%',
    flex:1,
    paddingHorizontal:10,
    marginBottom:3,
    flexDirection: 'column',
    justifyContent:'center'
  },
  profileNameInputStyle: {
    flex:0,
    width:'50%',
    paddingLeft:0,
    paddingRight:0,
    fontFamily:'arial',
    fontStyle:'italic',
    fontSize:(isMobile ? 16 : 21),
    fontWeight:'bold',
    color:'white',
    placeholderTextColor: 'white',
    borderBottomColor:'rgb(242, 242, 242)',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid'
  },
  profileDescriptionInputStyle: {
    flex:0,
    width: (isMobile ? '100%' : '75%'),
    paddingLeft:0,
    paddingRight:0,
    fontFamily:'arial',
    fontStyle:'italic',
    fontSize:(isMobile ? 14 : 16),
    color:'white',
    placeholderTextColor: 'white',
    borderBottomColor:'rgb(242, 242, 242)',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid'
  },
  profileBackgroundDropzoneStyle: {
    borderStyle:'dashed',
    borderWidth: 2,
    borderRadius: 10,
    borderColor:'rgb(204,204,204)',
    paddingHorizontal: 15,
    minWidth: '50%',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  profileAvatarDropzoneStyle: {
    borderStyle:'dashed',
    borderWidth: 2,
    borderRadius: 40,
    borderColor:'rgb(204,204,204)',
    height:80,
    width:80,
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 10
  },
  profileAvatarDropzoneImageStyle: {
    borderRadius: 40,
  },
  profileAvatarStyle: {
    marginLeft:10,
    borderWidth:2,
    borderColor:'white',
    borderStyle:'solid'
  }
});
