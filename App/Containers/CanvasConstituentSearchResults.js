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
    this.redux = this.props.fetchReduxData
    this.state = {
      searchFilterModal:false
    }
  }

  handleSearchFilterSort = () => {
    this.setState({searchFilterModal:!this.state.searchFilterModal})
  }

  handleSearchResultSelection = (aSelectionIndex) => {
    // this.props.storeReduxData({'toronto': 'canada', 'new york': 'usa'})
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

    const voters = (this.redux &&
                    this.redux.hasOwnProperty('CanvasConstituentSearch') &&
                    this.redux.CanvasConstituentSearch.hasOwnProperty('results')) ?
                    this.redux.CanvasConstituentSearch.results : []

    const uiRowElements = []
    uiRowElements.push(UIF.getText(`${voters.length} matching voters:`))
    uiRowElements.push(UIF.getButton(undefined, FontAwesome.ellipses_h, this.handleSearchFilterSort))
    rootContainerElements.push(UIF.getRow(uiRowElements))

    const scrollingContainerElements = []
    for (const voterIndex in voters) {
      const voter = voters[voterIndex]
      const voterText = `${voter.name}`
      const addressText = `${voter.street}\n${voter.city}, ${voter.zip}`

      const buttonColor = voter.leaning
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
