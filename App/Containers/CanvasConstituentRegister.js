import { Component } from 'react'
import { connect } from 'react-redux'
import CanvasActions, { CanvasSelectors } from '../Redux/CanvassingRedux'

import { Metrics } from '../Themes/'
import { FontAwesome } from '../Assets/icons'
const UIF = require('../Utils/UIFactory.js')
const C = require('../Utils/constants.js')
const NUIF = require('../Utils/NavUIFactory.js')

const zipcodes = require('zipcodes')

class CanvasConstituentRegister extends Component {
  static propTypes = NUIF.requireNavBar
  static navigationOptions = NUIF.getNavOptions('Register Voter', false)

  constructor (props) {
    super(props)

    this.voter =
    {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      birthDate: '',
      streetAddress: '',
      city: '',
      state: '',
      zip: '',
    }

    this.manuallyEnterCity = false
    this.manuallyEnterState = false

    this.updateRedux()    // Clear redux storage for this page

    this.state = {
      updateTime: Date.now(),
      showAI:false
    }
  }

  updateRedux = (context='') => {
    const reduxData = {
      CanvasConstituentRegister: {
        voter: this.voter,
      },
      // Data for search selection
      CanvasConstituentSearchResults: {
        selectedVoter: this.voter
      }
    }

    this.props.storeReduxData(reduxData)
  }

  handleVoterTextChange = (theText, theProperty) => {
    this.voter[theProperty] = theText

    if (theProperty === 'zip' &&
        !this.manuallyEnterCity &&
        !this.manuallyEnterState) {
      try {
        const zipData = zipcodes.lookup(parseInt(theText))
        if (zipData) {
          this.voter['city'] = zipData.city
          this.voter['state'] = zipData.state
          this.setState({updateTime: Date.now()})
        }
      } catch (suppressedError) {}
    } else if (theProperty === 'city') {
      this.manuallyEnterCity = true
    } else if (theProperty === 'state') {
      this.manuallyEnterState = true
    }
  }

  handleRegVoterPressed = () => {
    this.setState({showAI: true})

    const delayInSeconds = 2 * 1000
    setTimeout(
      () => {
        this.setState({showAI: false})

        this.updateRedux()

        // Update the headerTitle state var for navigating to the Constituent Contribution page:
        let voterName = ''
        try {
          voterName = `${this.voter.firstName} ${this.voter.lastName}`
        } catch (suppressedError) {}

        this.props.navigation.navigate(
          'Constituent Contribution', { contributionHeaderTitle: voterName })
      },
      delayInSeconds
    )
  }

  render () {
    if (this.voter.firstName === undefined &&
        this.voter.lastName === undefined &&
        this.voter.phoneNumber === undefined &&
        this.voter.email === undefined &&
        this.voter.birthDate === undefined &&
        this.voter.streetAddress === undefined &&
        this.voter.city === undefined &&
        this.voter.zip === undefined) {
      // Check redux state for values to set the UI to. Prevents redux from
      // clearing existing values in the text input UI.
      // TODO: probably a better way to do this, but the new react lifecycle is
      //       less clear right now with the deprecation of componentWillReceiveProps.
      //
      const rd = this.props.fetchReduxData
      if (rd &&
          rd.hasOwnProperty('CanvasConstituentRegister') &&
          rd.CanvasConstituentRegister.hasOwnProperty('voter')) {

        try {
          this.voter = JSON.parse(JSON.stringify(rd.CanvasConstituentRegister.voter))
        } catch (suppressedError) {}
      }
    }

    const uiElements = []

    if (this.state.showAI) {
      uiElements.push(UIF.getActivityIndicator('State specific voter registration actions happen now. Also text link to campaign / app can happen here ...'))
    }

    // TODO: modify auto-capitalize for email type.
    uiElements.push(UIF.getTextInput('First Name', 'firstName', this.handleVoterTextChange, this.voter.firstName))
    uiElements.push(UIF.getTextInput('Last Name', 'lastName', this.handleVoterTextChange, this.voter.lastName))
    uiElements.push(UIF.getTextInput('Phone Number', 'phoneNumber', this.handleVoterTextChange, this.voter.phoneNumber))
    uiElements.push(UIF.getTextInput('Email', 'email', this.handleVoterTextChange, this.voter.email))
    uiElements.push(UIF.getTextInput('Birth Date (MM/DD/YYYY)', 'birthDate', this.handleVoterTextChange, this.voter.birthDate))
    uiElements.push(UIF.getTextInput('Street Address', 'streetAddress', this.handleVoterTextChange, this.voter.streetAddress))
    uiElements.push(UIF.getTextInput('Zip', 'zip', this.handleVoterTextChange, this.voter.zip))
    uiElements.push(UIF.getTextInput('City', 'city', this.handleVoterTextChange, this.voter.city))
    uiElements.push(UIF.getTextInput('State', 'state', this.handleVoterTextChange, this.voter.state))
    uiElements.push(UIF.getVerticalSpacer(Metrics.doubleBaseMargin))
    uiElements.push(UIF.getButton('Register Voter', 'user', this.handleRegVoterPressed))
    uiElements.push(UIF.getVerticalSpacer(Metrics.screenHeight/3))

    return (UIF.getScrollingContainer(uiElements))
  }
}

const mapStateToProps = (state) => {
  return {
    fetchReduxData: CanvasSelectors.fetchData(state),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    storeReduxData: (data) => dispatch(CanvasActions.storeData(data)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CanvasConstituentRegister)
