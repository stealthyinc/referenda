import React, { Component } from 'react'
import { ScrollView, Text, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/CanvasConstituentSearchStyle'
import NavigationType from '../Navigation/propTypes';
import CanvasActions, { CanvasSelectors } from '../Redux/CanvasRedux'

const avatarArr = {
  0: require('../Data/img/avatars/Image0.png'),
  1: require('../Data/img/avatars/Image1.png'),
  2: require('../Data/img/avatars/Image2.png'),
  3: require('../Data/img/avatars/Image3.png'),
  4: require('../Data/img/avatars/Image4.png'),
  5: require('../Data/img/avatars/Image5.png'),
  6: require('../Data/img/avatars/Image6.png'),
  7: require('../Data/img/avatars/Image7.png'),
  8: require('../Data/img/avatars/Image8.png'),
  9: require('../Data/img/avatars/Image9.png'),
 10: require('../Data/img/avatars/Image10.png'),
 11: require('../Data/img/avatars/Image11.png'),
}

import { Metrics } from '../Themes/'
import { FontAwesome } from '../Assets/icons'
const UIF = require('../Utils/UIFactory.js')

const { userTypeInstance } = require('../Utils/UserType.js')
const randomAvatar = (userTypeInstance.getUserType()) ? avatarArr[Math.floor(Math.random() * Math.floor(12))] : require('../Data/img/avatars/agatha.png')

class CanvasConstituentSearch extends Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    return {
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{marginLeft: 10}}>
          <Image
            source={randomAvatar}
            style={{height: 30, width: 30, borderRadius: 15}}/>
        </TouchableOpacity>
      ),
      headerTitle: 'Canvasser'.toUpperCase(),
      headerBackTitle: 'Back',
      headerTintColor: 'black',
      gesturesEnabled: false,
    }
  };

  constructor (props) {
    super(props)

    this.firstName = undefined
    this.lastName = undefined
    this.streetAddress = undefined
    this.city = undefined
    this.zip = undefined
    this.phone = undefined

    this.state = {
      showAI:false
    }
  }

  handleTextChange = (theText, theProperty) => {
    this[theProperty] = theText
  }

  handleSearchPressed = () => {
    this.setState({showAI: true})

    const delayInSeconds = 2.5
    const ms_per_s = 1000
    setTimeout(
      () => {
        this.setState({showAI: false})
        this.props.navigation.navigate('Constituent Search Results')
      },
      delayInSeconds * ms_per_s )
  }

  render () {
    const uiElements = []

    if (this.state.showAI) {
      uiElements.push(UIF.getActivityIndicator('Searching registered voters ...'))
    }

    const headingSize = 'h4'
    uiElements.push(UIF.getHeading('Search for registered voters by name:', headingSize))
    uiElements.push(UIF.getTextInput('First Name', 'firstName', this.handleTextChange))
    uiElements.push(UIF.getTextInput('Last Name', 'lastName', this.handleTextChange))
    uiElements.push(UIF.getHeading('or address:', headingSize))
    uiElements.push(UIF.getTextInput('Street Address', 'streetAddress', this.handleTextChange))
    uiElements.push(UIF.getTextInput('City', 'city', this.handleTextChange))
    uiElements.push(UIF.getTextInput('Zip', 'zip', this.handleTextChange))
    uiElements.push(UIF.getVerticalSpacer(Metrics.doubleBaseMargin))
    uiElements.push(UIF.getButton('Search', FontAwesome.search, this.handleSearchPressed))

    return (UIF.getScrollingContainer(uiElements))
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CanvasConstituentSearch)
