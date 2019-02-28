import React from 'react'
import {
  AsyncStorage,
  Image,
  NativeModules,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { connect } from 'react-redux'
import Config from 'react-native-config'
import verified from '../Assets/images/verified.png'

class AuthLoadingScreen extends React.Component {
  constructor (props) {
    super(props)
    this._bootstrapAsync()
  }
  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    if (false) {
      this.props.navigation.navigate('App')
    }
    else {
      this.props.navigation.navigate('Auth')
    }
  };

  // Render any loading content that you like here
  render () {
    return (
      <View style={styles.container}>
        <StatusBar barStyle='default' />
        <Image
          source={verified}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthLoadingScreen)
