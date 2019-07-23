import { Component } from 'react'
import { connect } from 'react-redux'
import CanvasActions, { CanvasSelectors } from '../Redux/CanvassingRedux'

import { Metrics } from '../Themes/'
import { FontAwesome } from '../Assets/icons'
const UIF = require('../Utils/UIFactory.js')
const C = require('../Utils/constants.js')
const NUIF = require('../Utils/NavUIFactory.js')

const Levenshtein = require('fast-levenshtein');

import { Voters } from '../Data/raw/sandiegovoters'

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

  handleRegVoterPressed = () => {
    this.props.navigation.navigate('Constituent Register')
  }

  compareVoterResults = (a, b) => {
    if (a.hasOwnProperty('firstNameLevDist') && b.hasOwnProperty('firstNameLevDist')) {
      return a.firstNameLevDist - b.firstNameLevDist
    }
  }

  handleSearchPressed = () => {
    // // Push the search data to redux to prevent re-rendering of old data:
    // this.updateRedux('handleSearchPressed')
    this.setState({showAI: true})

    // Search spoof:
    // Start by searching last name, then see about narrowing by first name.
    // If empty, search by address, then see about narrowing by city / zip.
    this.results = []
    for (const voter of Voters) {

      if (this.search.lastName) {
        const lastNameLevDist = Levenshtein.get(this.search.lastName, voter.lastName)
        if (lastNameLevDist < 2) {
          if (this.search.firstName) {
            const firstNameLevDist = Levenshtein.get(this.search.firstName, voter.firstName)
            if (firstNameLevDist < 3) {
              this.results.push({
                firstNameLevDist,
                lastNameLevDist,
                voter
              })
            }
          } else {
            this.results.push({
              lastNameLevDist,
              voter
            })
          }
        }
      } else if (this.search.streetAddress !== '') {
        if (levDist < 3) {
          this.results.push({
            levDist,
            voter
          })
        }
      }
    }

    this.results.sort(this.compareVoterResults)

    const delayInSeconds = 0.01 * 1000
    setTimeout(
      () => {
        this.setState({showAI: false})

        // this.results = C.demoVoters
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

    const headingSize = 'h5'
    // uiElements.push(UIF.getButton('Register Voter', undefined, this.handleRegVoterPressed))
    uiElements.push(UIF.getHeading('Search for registered voters by name:', headingSize))
    uiElements.push(UIF.getTextInput('First Name', 'firstName', this.handleSearchTextChange, this.search.firstName))
    uiElements.push(UIF.getTextInput('Last Name', 'lastName', this.handleSearchTextChange, this.search.lastName, this.handleSearchPressed))
    uiElements.push(UIF.getHeading('or address:', headingSize))
    uiElements.push(UIF.getTextInput('Street Address', 'streetAddress', this.handleSearchTextChange, this.search.streetAddress))
    uiElements.push(UIF.getTextInput('Zip', 'zip', this.handleSearchTextChange, this.search.zip, this.handleSearchPressed))
    uiElements.push(UIF.getVerticalSpacer(Metrics.doubleBaseMargin))
    uiElements.push(
      UIF.getRow([
        UIF.getButton('Register Voter', 'user', this.handleRegVoterPressed),
        //
        // KEEP THE SEARCH BUTTON (It's not obvious to a user who goes back to change
        // a search (i.e. the first name which happened to me) that they need to then
        // edit the last name and hit 'return')
        UIF.getButton('Search', 'search', this.handleSearchPressed)
      ])
    )
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

export default connect(mapStateToProps, mapDispatchToProps)(CanvasConstituentSearch)
