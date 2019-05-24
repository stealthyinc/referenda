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
  state = {
    email: '',
    error: true
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
  render() {
    return (
      <Card style={{marginBottom: 15}}>
        <CardItem header bordered>
          <View style={{width: '100%', flexDirection:'row', justifyContent:'space-between'}}>
            <H3>This feature is only available in the App, sign-up now to get the App:</H3>
            <View style={{width:15}} />
            <Button small bordered rounded onClick={()=>this.cleanClose()} danger style={{marginBottom: 15}}>
              <Icon active name="close" />
            </Button>
          </View>
        </CardItem>
        <CardItem>
          <Content>
            <Form>
              <Item error={this.state.error} success={!this.state.error} inlineLabel>
                <Label>E-Mail</Label>
                <Input placeholder="example@gmail.com" value={this.state.email} onChangeText={(text) => this.setEmail(text)} />
              </Item>
            </Form>
          </Content>
        </CardItem>
        <CardItem>
          <Content padder>
            <Button
              success
              block
              disabled={this.state.error}
              style={{ margin: 15 }}
              onPress={() => this.sendInformation() }
            >
              <Text>Submit</Text>
            </Button>
          </Content>
        </CardItem>
      </Card>
    );
  }
}
