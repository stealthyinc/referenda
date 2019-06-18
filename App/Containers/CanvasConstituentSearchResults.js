import React, { Component } from 'react'
import { connect } from 'react-redux'
import CanvasActions, { CanvasSelectors } from '../Redux/CanvassingRedux'

import { Metrics } from '../Themes/'
import { FontAwesome } from '../Assets/icons'
const UIF = require('../Utils/UIFactory.js')
const NUIF = require('../Utils/NavUIFactory.js')

class CanvasConstituentSearchResults extends Component {
  static propTypes = NUIF.requireNavBar
  static navigationOptions = NUIF.getNavOptions(
    'Search Results', false /* omit left header avatar */ )

  constructor (props) {
    super(props)

    this.selectionIndex = undefined

    this.state = {
      searchFilterModal:false
    }
  }

  updateRedux = () => {
    const reduxData = {
      CanvasConstituentSearchResults: {
        selectionIndex: this.selectionIndex
      }
    }

    this.props.storeReduxData(reduxData)
  }


  handleSearchFilterSort = () => {
    this.setState({searchFilterModal:!this.state.searchFilterModal})
  }

  handleSearchResultSelection = (aSelectionIndex) => {
    this.selectionIndex = aSelectionIndex
    this.updateRedux()

    this.props.navigation.navigate('Constituent Questionaire')
  }

  render () {
    const rootContainerElements = []

    if (this.state.searchFilterModal) {
      // Other possibilities (sort or filter button--i.e. relevance, name, location)
      const modalElements = []
      modalElements.push(UIF.getText('Future home of sort & filter options.'))
      modalElements.push(UIF.getButton('Cancel', undefined, this.handleSearchFilterSort))
      rootContainerElements.push(UIF.getOptionsModal(modalElements))
    }

    const rd = this.props.fetchReduxData
    const voters = (rd &&
                    rd.hasOwnProperty('CanvasConstituentSearch') &&
                    rd.CanvasConstituentSearch.hasOwnProperty('results')) ?
                    rd.CanvasConstituentSearch.results : []
    console.log('CanvasConstituentSearchResults::render, rd:')
    console.log(rd)

    const uiRowElements = []
    uiRowElements.push(UIF.getText(`${voters.length} matching voters:`))
    uiRowElements.push(UIF.getButton(undefined, FontAwesome.ellipses_h, this.handleSearchFilterSort))
    rootContainerElements.push(UIF.getRow(uiRowElements))

    const scrollingContainerElements = []
    for (const voterIndex in voters) {
      const voter = voters[voterIndex].voter
      const voterText = `${voter.firstName} ${voter.lastName}`
      const addressText = `${voter.streetAddress}\n${voter.city} ${voter.state}\n${voter.zipCode}`
      const gray90pct = '#e6e6e6'
      const buttonColor = gray90pct
      // const voterText = `${voter.name}`
      // const addressText = `${voter.street}\n${voter.city}, ${voter.zip}`
      //
      // const buttonColor = voter.leaning
      scrollingContainerElements.push(UIF.getListButton(voterText, addressText, voterIndex, this.handleSearchResultSelection, buttonColor))
    }

    const noMargin=true
    rootContainerElements.push(UIF.getScrollingContainer(scrollingContainerElements, noMargin))

    return (UIF.getContainer(rootContainerElements))
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

export default connect(mapStateToProps, mapDispatchToProps)(CanvasConstituentSearchResults)
