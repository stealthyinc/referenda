import React, { Component } from 'react'
import { connect } from 'react-redux'

// Styles
import NavigationType from '../Navigation/propTypes';
import CanvasActions, { CanvasSelectors } from '../Redux/CanvassingRedux'

import { Metrics } from '../Themes/'
import { FontAwesome } from '../Assets/icons'
const UIF = require('../Utils/UIFactory.js')

class CanvasConstituentSearchResults extends Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    return {
      headerTitle: 'Search Results'.toUpperCase(),
      headerBackTitle: 'Back',
      gesturesEnabled: false,
    }
  };

  constructor (props) {
    super(props)
    this.state = {
      searchFilterModal:false
    }
  }

  handleSearchFilterSort = () => {
    this.setState({searchFilterModal:!this.state.searchFilterModal})
  }

  handleSearchResultSelection = (aSelectionIndex) => {
    this.props.storeData({'toronto': 'canada', 'new york': 'usa'})
    this.props.navigation.navigate('Constituent Questionaire')
  }

  render () {
    const LEANING = {
      left:'#d8ecf3',           // 90% light blue: https://www.w3schools.com/colors/colors_picker.asp?colorhex=ADD8E6
      right:'#ffe6ea',          // 95% light pink: https://www.w3schools.com/colors/colors_picker.asp?colorhex=FFC0CB
      neutral:'#f2f2f2',        // 95% light gray: https://www.w3schools.com/colors/colors_picker.asp?colorhex=D3D3D3
      unknown:'#ffffe6'         // 95% light yellow: https://www.w3schools.com/colors/colors_picker.asp?colorhex=FFFF00
    }

    const voters = [
      {
        name: 'Jane Sock',
        street: '412 Clinton Ave. Apt. 3',
        city: 'Alameda',
        zip: '94501',
        leaning: LEANING.unknown
      },
      {
        name: 'Zhougamesh Farfoot',
        street: '952 San Jose Ave.',
        city: 'Alameda',
        zip: '94501',
        leaning: LEANING.left
      },
      {
        name: 'Prabu Mama',
        street: '2045 Clinton Ave. Apt. 34',
        city: 'Alameda',
        zip: '94501',
        leaning: LEANING.unknown
      },
      {
        name: 'Stacey Sox',
        street: '851 Encinal Ave. Apt. 7',
        city: 'Alameda',
        zip: '94501',
        leaning: LEANING.neutral
      },
      {
        name: 'Jin Girinker',
        street: '60 Bay Farm Court',
        city: 'Alameda',
        zip: '94501',
        leaning: LEANING.neutral
      },
      {
        name: 'Beer Swiller',
        street: '62 Bay Farm Court',
        city: 'Alameda',
        zip: '94501',
        leaning: LEANING.right
      },
      {
        name: 'Hector Garcia',
        street: '900 Park St. Apt 22',
        city: 'Alameda',
        zip: '94501',
        leaning: LEANING.left
      },
      {
        name: 'Genie Garcia',
        street: '900 Park St. Apt 22',
        city: 'Alameda',
        zip: '94501',
        leaning: LEANING.left
      },
      {
        name: 'Loretta Garcia',
        street: '900 Park St. Apt 22',
        city: 'Alameda',
        zip: '94501',
        leaning: LEANING.left
      },
    ]


    const rootContainerElements = []

    if (this.state.searchFilterModal) {
      const modalElements = []
      modalElements.push(UIF.getText('Future home of sort & filter options.'))
      modalElements.push(UIF.getButton('Cancel', undefined, this.handleSearchFilterSort))
      rootContainerElements.push(UIF.getOptionsModal(modalElements))
    }

    // Other possibilities (sort or filter button--i.e. relevance, name, location)
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
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    storeData: (data) => dispatch(CanvasActions.storeData(data)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CanvasConstituentSearchResults)
