import React from 'react'
import { Alert, View } from 'react-native';
import { Button, Icon, Input, Item, Text } from 'native-base'

import { createUserAccount, login } from 'simpleid-js-sdk'
const { firebaseInstance } = require('../utils/firebaseWrapper.js')

function validateEmail(email) {
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
    }
    this.simpleIdData = {
      userName: '',
      email: '',
      password: '',
    }
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
    debugger
    // TODO: Prabhaav
    // FUTURE TODO:
    //  - unique user name check?
    //  - password recovery flow?
    // Data is stored in this.simpleIdData
    console.log(`simpleIdData: ${JSON.stringify(this.simpleIdData)}`)
    const { userName, email, password } = this.simpleIdData
    if (!validateEmail(email)) {
      this.setState({errorEmail: true})
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
      // const params = {
      //     login: true,
      //     credObj,
      //     appObj,
      //     userPayload: {},
      //     email
      // }
      const create = await createUserAccount(credObj, appObj);
      const { message, body } = create
      if(message === "name taken") {
        //show some error
        Alert(message)
        this.setState({errorUsername: true})
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
  }

  render() {
    const { title, styles, updateUserSessionFn } = this.props

    const headingText = (title) ?
      title : "Referenda connects you with movements that matter."

    return (
      <View style={{height:450, width:300, paddingVertical:10, paddingHorizontal:15}}>
        <Text style={[styles.headerLogoText, {color:'white', fontSize:32}]}>{headingText}</Text>
        <Item error={this.state.errorUsername}>
          <Input
            id='userNameInput'
            multiline={false}
            onChangeText={(text)=>{this.handleSignUpTextChange('userName', text)}}
            placeholder='User Name'
            placeholderTextColor='rgb(255,255,255)' />
            {(this.state.errorUsername) ? <Icon name='close-circle' /> : null}
        </Item>
        <Item error={this.state.errorEmail}>
          <Input
            id='emailInput'
            multiline={false}
            onChangeText={(text)=>{this.handleSignUpTextChange('email', text)}}
            placeholder='Email Address'
            placeholderTextColor='rgb(255,255,255)' />
            {(this.state.errorEmail) ? <Icon name='close-circle' /> : null}
        </Item>
        <Item>
          <Input
            id='passwordInput'
            multiline={false}
            onChangeText={(text)=>{this.handleSignUpTextChange('password', text)}}
            placeholder='Password'
            placeholderTextColor='rgb(255,255,255)' />
        </Item>
        <View style={{flex: 1, flexDirection:'column', justifyContent: 'center', alignItems: 'center', width:'100%'}}>
          {/* Keep the next view--otherwise we can't seem to center this button. TODO: why? */}
          <View>
            <Button success small={false}
              style={styles.feedButton}
              onPress={this.handleSignUp}>
              <Text style={styles.feedButtonText} uppercase={false}>Sign Up</Text>
            </Button>
          </View>
        </View>
      </View>
    )
  }
}
