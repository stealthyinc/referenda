import React from 'react'
import {
  ActivityIndicator,
  Alert,
  Image,
  View,
  TouchableHighlight
} from 'react-native'
import {
  Button,
  Icon,
  Input,
  Item,
  Text
} from 'native-base'
import FitImage from 'react-native-fit-image';
import { createUserAccount } from 'simpleid-js-sdk'
const C = require('../utils/constants.js')

function validateEmail (email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export default class SignUpBox extends React.Component {
  constructor(props) {
    super(props)
    this.props = props
    this.state = {
      errorUsername: false,
      errorEmail: false,
      loading: false,
      showSignUpDialog: true,
    }
    this.simpleIdData = {
      userName: '',
      email: '',
      password: '',
    }
    this.key = 0
  }

  getUniqueKey = () => {
    return `${Date.now()}_${this.key++}`
  }

  handleSignUpSignInToggle = () => {
    this.setState({showSignUpDialog: !this.state.showSignUpDialog})
  }

  handleSignUpTextChange = (aFieldName, aFieldValue) => {
    // TODO: validation
    switch (aFieldName) {
      case 'userName':
      case 'email':
      case 'password':
        this.simpleIdData[aFieldName] = aFieldValue
        break;
      default:
        console.log(`ERROR: Unexpected ${aFieldName}. Expecting userName, email, or password.`)
    }
  }

  handleSignUp = async () => {
    // TODO: Prabhaav
    // FUTURE TODO:
    //  - unique user name check?
    //  - password recovery flow?
    // Data is stored in this.simpleIdData
    console.log(`simpleIdData: ${JSON.stringify(this.simpleIdData)}`)
    const { userName, email, password } = this.simpleIdData
    if (!userName.length) {
      this.setState({errorUsername: true, loading: false})
    }
    else {
      if (!validateEmail(email)) {
        this.setState({errorEmail: true, loading: false})
      }
      else {
        const credObj = {
            id: userName, //This is the name the user selects and will be checked against existing registered names automatically.
            password, //This should be a complex password supplied by the user
            hubUrl: "http://hub.blockstack.org", //This will likely be "http://hub.blockstack.org" but can be any storage hub you allow
            email //Email address for the user, used during account recovery
        }
        const appObj = {
            appOrigin: "https://www.app.referenda.io", //This is the domain for your app
            scopes: ['store_write', 'publish_data', 'email'] //These are the scopes you are requesting to use
        }
        try {
          const create = await createUserAccount(credObj, appObj);
          const { message, body } = create
          if(message === "name taken") {
            //show some error
            Alert(message)
            this.setState({errorUsername: true, loading: false})
          } else {
            localStorage.setItem('blockstack-session', JSON.stringify(body.body.store.sessionData));
            if (message === "Need to go through recovery flow") {
              Alert(message)
            }
            else if(message === "successfully created user session") {
              this.updateUserSessionFn(body.body)
            }
          }
          console.log(create)
        }
        catch (error) {
          console.log(error)
        }
      }
    }
  }

  render() {
    const { title, styles, updateUserSessionFn, closeButtonFn } = this.props

    const buttonTouchableHighlightStyle = {
      width:'100%',
      height:45,
      flexDirection:'column',
      justifyContent: 'center',
      alignItems:'center'
    }
    const buttonWrapperViewStyle = {
      backgroundColor: '#003dff',
      alignItems:'center',
      width:'100%',
      flex:1,
      borderRadius:15,
      borderColor:'rgba(255,255,255,0.35)',
      borderWidth:1,
      // borderStyle:'solid',
      // borderColor:'blue',
      // borderWidth:2
    }
    const buttonFitImageStyle = {
      // backgroundColor: '#003dff',
      height:'auto',
      // borderStyle:'solid',
      // borderColor:'red',
      // borderWidth:2,
    }

    const headingText = (title) ?
      title : "Referenda connects you with movements that matter."

    const closeButton = (closeButtonFn) ?
      (
        <Button rounded onClick={closeButtonFn} danger>
          <Icon active name="close" />
        </Button>
      ) : undefined

    let signUpToggle = undefined
    let simpleIdInput = undefined
    let simpleIdButton = undefined
    let simpleIdSpacer = undefined

    if (C.ENABLE_SIMPLE_ID) {
      let signUpToggleText = (this.state.showSignUpDialog) ?
        'sign in to your account.' : 'sign up for an account.'
      signUpToggle = (
        <TouchableHighlight onPress={this.handleSignUpSignInToggle}>
          <Text style={{fontFamily: 'arial', color:'white'}}>or  <Text style={{fontFamily: 'arial', color:'rgb(98, 177, 246)'}}>{signUpToggleText}</Text></Text>
        </TouchableHighlight>
      )

      let simpleIdInputElements = [
        (
          <Item key={this.getUniqueKey()} error={this.state.errorUsername}>
            <Input
              id='userNameInput'
              style={styles.inputStyleWithError}
              multiline={false}
              onChangeText={(text)=>{this.handleSignUpTextChange('userName', text)}}
              placeholder='User Name'
              placeholderTextColor='rgb(255,255,255)' />
              {(this.state.errorUsername) ? <Icon name='close-circle' /> : null}
          </Item>
        )
      ]

      if (this.state.showSignUpDialog) {
        simpleIdInputElements.push(
          <Item key={this.getUniqueKey()} error={this.state.errorEmail}>
            <Input
              id='emailInput'
              style={styles.inputStyleWithError}
              multiline={false}
              onChangeText={(text)=>{this.handleSignUpTextChange('email', text)}}
              placeholder='Email Address'
              placeholderTextColor='rgb(255,255,255)' />
              {(this.state.errorEmail) ? <Icon name='close-circle' /> : null}
          </Item>
        )
      }

      simpleIdInputElements.push(
        <Item key={this.getUniqueKey()}>
          <Input
            id='passwordInput'
            style={styles.inputStyleWithError}
            multiline={false}
            onChangeText={(text)=>{this.handleSignUpTextChange('password', text)}}
            placeholder='Password'
            placeholderTextColor='rgb(255,255,255)' />
        </Item>
      )

      simpleIdInput = (
        <View>
          {simpleIdInputElements}
        </View>
      )


      simpleIdButton = (
        <TouchableHighlight
          style={buttonTouchableHighlightStyle}
          onPress={() => {
          this.setState({loading: true})
          this.handleSignUp()
        }}>
          <View style={[buttonWrapperViewStyle, {backgroundColor: 'black'}]} >
            <FitImage resizeMode="contain" style={[buttonFitImageStyle, {width:'100%'}]} source={require('../assets/loginButton.png')} />
          </View>
        </TouchableHighlight>
      )

      simpleIdSpacer = ( <View style={{height:15}} /> )
    }

    const activityIndicator = (this.state.loading) ? <ActivityIndicator size="large" color="#0000ff" /> : null

    return (
      <View style={{height:450, width:300, paddingVertical:10, paddingHorizontal:15, backgroundColor:C.DIALOG_BOX_BACKGROUND}}>
        <View style={{marginBottom:30}}>
          <View style={{flexDirection:'row', alignItems:'flex-start'}}>
            <Text style={[styles.headerLogoText, {color:'white', fontSize:32}]}>{headingText}</Text>
            {closeButton}
          </View>
          {signUpToggle}
        </View>
        {simpleIdInput}
        <View style={{height:15}} />
        <View style={{flex: 1, flexDirection:'column', justifyContent: 'center', alignItems: 'center', width:'100%'}}>

            {simpleIdButton}
            {simpleIdSpacer}

            <TouchableHighlight style={buttonTouchableHighlightStyle} onPress={this.props.blockstackSignUp}>
              <View style={[buttonWrapperViewStyle, {backgroundColor: '#230d2e'}]} >
                <FitImage resizeMode="contain" style={[buttonFitImageStyle, {backgroundColor:'#230d2e', width:'90%'}]} source={require('../assets/block.png')} />
              </View>
            </TouchableHighlight>

            <View style={{flex:1}} />
        </View>
      </View>
    )
  }
}
