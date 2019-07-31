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
export default class AppSignUp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      error: true
    }

    this.props = props
  }

  validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  setEmail(email) {
    const error = !(this.validateEmail(email))
    this.setState({email, error})
  }
  cleanClose = () => {
    this.setState({ email: ''})
    this.props.toggleModal()
  }
  sendInformation = async () => {
    if (!this.state.error) {
      firebase.database().ref('/global/webapp/signup').push({
        time: Date.now(),
        email: this.state.email
      })
      this.cleanClose()
    }
  }


  // render() {
  //   return (
  //     <Card style={{marginBottom: 15}}>
  //       <CardItem header bordered>
  //         <View style={{width: '100%', flexDirection:'row', justifyContent:'space-between'}}>
  //           <H3>This feature is only available in the App, sign-up now to get the App:</H3>
  //           <View style={{width:15}} />
  //           <Button rounded onClick={()=>this.cleanClose()} danger style={{marginBottom: 15}}>
  //             <Icon active name="close" />
  //           </Button>
  //         </View>
  //       </CardItem>
  //       <CardItem>
  //         <Content>
  //           <Form>
  //             <Item error={this.state.error} success={!this.state.error} inlineLabel>
  //               <Label>E-Mail</Label>
  //               <Input placeholder="example@gmail.com" value={this.state.email} onChangeText={(text) => this.setEmail(text)} />
  //             </Item>
  //           </Form>
  //         </Content>
  //       </CardItem>
  //       <CardItem>
  //         <Content padder>
  //           <Button
  //             success
  //             block
  //             disabled={this.state.error}
  //             style={{ margin: 15 }}
  //             onPress={() => this.sendInformation() }
  //           >
  //             <Text>Submit</Text>
  //           </Button>
  //         </Content>
  //       </CardItem>
  //     </Card>
  //   );
  // }

  render() {
    const { title, styles, closeButtonFn } = this.props

    if (!styles || !styles.headerLogoText) {
      debugger
    }

    const headingText = (title) ?
      title : "Get notified by email when commenting is available in Referenda's mobile app."

    const closeButton = (closeButtonFn) ?
      (
        <Button rounded onClick={closeButtonFn} danger>
          <Icon active name="close" />
        </Button>
      ) : undefined

    // TODO: pull in error checking from PBJ work in SignUpBox for dealing with

    return (
      <View style={{height:450, width:300, paddingVertical:10, paddingHorizontal:15, backgroundColor:'black'}}>
        <View style={{flexDirection:'row', alignItems:'flex-start', marginBottom:30}}>
          <Text style={[styles.headerLogoText, {color:'white', fontSize:32}]}>{headingText}</Text>
          {closeButton}
        </View>
        <Input
          id='emailInput'
          style={styles.inputStyle}
          multiline={false}
          value={this.state.email}
          onChangeText={(text) => this.setEmail(text)}
          placeholder='example@gmail.com'
          placeholderTextColor='rgb(255,255,255)' />

        <View style={{flex: 1, flexDirection:'column', justifyContent: 'center', alignItems: 'center', width:'100%'}}>
          {/* Keep the next view--otherwise we can't seem to center this button. TODO: why? */}
          <View>
            <Button success small={false}
              style={styles.feedButton}
              onPress={() => this.sendInformation() }>
              <Text style={styles.feedButtonText} uppercase={false}>Get Notified</Text>
            </Button>
          </View>
        </View>
      </View>
    )
  }
}
