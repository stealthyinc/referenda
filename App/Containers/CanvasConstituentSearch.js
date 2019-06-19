import { Component } from 'react'
import { connect } from 'react-redux'
import CanvasActions, { CanvasSelectors } from '../Redux/CanvassingRedux'

import { Metrics } from '../Themes/'
import { FontAwesome } from '../Assets/icons'
const UIF = require('../Utils/UIFactory.js')
const C = require('../Utils/constants.js')
const NUIF = require('../Utils/NavUIFactory.js')

class CanvasConstituentSearch extends Component {
  static propTypes = NUIF.requireNavBar
  static navigationOptions = NUIF.getNavOptions('Canvassing', false)

  constructor (props) {
    super(props)
    console.log('CanvasConstituentSearch::CONSTRUCTOR')

    this.search =
    {
      firstName: '',
      lastName: '',
      streetAddress: '',
      city: '',
      zip: '',
    }
    this.results = []

    this.updateRedux()    // Clear redux storage for this page

    this.state = {
      updateTime: Date.now(),
      showAI:false
    }
  }

  updateRedux = (context='') => {
    const reduxData = {
      CanvasConstituentSearch: {
        search: this.search,
        results: this.results
      }
    }

    this.props.storeReduxData(reduxData)
  }

  handleSearchTextChange = (theText, theProperty) => {
    this.search[theProperty] = theText
  }

  handleSearchPressed = () => {
    // // Push the search data to redux to prevent re-rendering of old data:
    // this.updateRedux('handleSearchPressed')
    this.setState({showAI: true})

    const delayInSeconds = 1.5 * 1000
    setTimeout(
      () => {
        this.setState({showAI: false})

        // TODO: insert search results into spoofed data and replace this delay etc. and
        //       the fetch from demoVoters with a search in voters.js
        this.results = C.demoVoters
        this.updateRedux('handleSearchPressed after timeout')

        this.props.navigation.navigate('Constituent Search Results')
      },
      delayInSeconds)
  }

  render () {
    if (this.search.firstName === undefined &&
        this.search.lastName === undefined &&
        this.search.streetAddress === undefined &&
        this.search.city === undefined &&
        this.search.zip === undefined) {
      // Check redux state for values to set the UI to. Prevents redux from
      // clearing existing values in the text input UI.
      // TODO: probably a better way to do this, but the new react lifecycle is
      //       less clear right now with the deprecation of componentWillReceiveProps.
      //
      const rd = this.props.fetchReduxData
      if (rd &&
          rd.hasOwnProperty('CanvasConstituentSearch') &&
          rd.CanvasConstituentSearch.hasOwnProperty('search')) {

        try {
          this.search = JSON.parse(JSON.stringify(rd.CanvasConstituentSearch.search))
        } catch (suppressedError) {}
      }
    }

    const uiElements = []

    if (this.state.showAI) {
      uiElements.push(UIF.getActivityIndicator('Searching registered voters ...'))
    }

    const headingSize = 'h4'
    uiElements.push(UIF.getHeading('Search for registered voters by name:', headingSize))
    uiElements.push(UIF.getTextInput('First Name', 'firstName', this.handleSearchTextChange, this.search.firstName))
    uiElements.push(UIF.getTextInput('Last Name', 'lastName', this.handleSearchTextChange, this.search.lastName))
    uiElements.push(UIF.getHeading('or address:', headingSize))
    uiElements.push(UIF.getTextInput('Street Address', 'streetAddress', this.handleSearchTextChange, this.search.streetAddress))
    uiElements.push(UIF.getTextInput('City', 'city', this.handleSearchTextChange, this.search.city))
    uiElements.push(UIF.getTextInput('Zip', 'zip', this.handleSearchTextChange, this.search.zip))
    uiElements.push(UIF.getVerticalSpacer(Metrics.doubleBaseMargin))
    uiElements.push(UIF.getButton('Search', FontAwesome.search, this.handleSearchPressed))

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

export default connect(mapStateToProps, mapDispatchToProps)(CanvasConstituentSearch)
