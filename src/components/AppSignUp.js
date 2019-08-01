import React, { Component } from 'react';
import {
  Button,
  Card,
  CardItem,
  Content,
  Form,
  Icon,
  H3,
  Item,
  Input,
  Label,
  Text
} from 'native-base';
import {
  View,
} from 'react-native';

const firebase = require('firebase');

// TODO: unify this with other versions of it in utilities.
function validateEmail (email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export default class AppSignUp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errorEmail: false,
    }

    this.email = ''
    this.props = props
  }

  cleanClose = () => {
    this.email = ''
    this.props.toggleModal()
  }

  sendInformation = async () => {
    if (validateEmail(this.email)) {
      if (this.state.errorEmail) {
        this.setState({errorEmail: false})
      }

      firebase.database().ref('/global/webapp/signup').push({
        time: Date.now(),
        email: this.email
      })

      this.cleanClose()
    } else if (!this.state.errorEmail) {
      this.setState({errorEmail: true})
    }
  }


  render() {
    const { title, styles, closeButtonFn } = this.props

    const headingText = (title) ?
      title : "Get notified by email when commenting is available in Referenda's mobile app."

    const closeButton = (closeButtonFn) ?
      (
        <Button rounded onClick={closeButtonFn} danger>
          <Icon active name="close" />
        </Button>
      ) : undefined


    return (
      <View style={{height:450, width:300, paddingVertical:10, paddingHorizontal:15, backgroundColor:'black'}}>
        <View style={{flexDirection:'row', alignItems:'flex-start', marginBottom:30}}>
          <Text style={[styles.headerLogoText, {color:'white', fontSize:32}]}>{headingText}</Text>
          {closeButton}
        </View>
        <Item error={this.state.errorEmail}>
          <Input
            id='emailInput'
            style={styles.inputStyleWithError}
            multiline={false}
            onChangeText={(text) => {this.email = text}}
            placeholder='Email Address'
            placeholderTextColor='rgb(255,255,255)' />
            {(this.state.errorEmail) ? <Icon name='close-circle' /> : null}
        </Item>
        <View style={{flex: 1, flexDirection:'column', justifyContent: 'center', alignItems: 'center', width:'100%'}}>
          {/* Keep the next view--otherwise we can't seem to center this button. TODO: why? */}
          <View>
            <Button success small={false}
              style={styles.feedButton}
              onPress={() => this.sendInformation() }>
              <Text style={[styles.feedButtonText, {paddingRight:10}]} uppercase={false}>Get Notified</Text>
            </Button>
          </View>
        </View>
      </View>
    )
  }
}
