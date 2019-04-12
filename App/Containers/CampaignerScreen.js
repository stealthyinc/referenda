import React, { Component } from 'react'
import {
  FlatList,
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux'
import {
  RkText,
  RkTextInput,
  RkCard,
  RkButton,
  RkStyleSheet,
  RkTheme,
} from 'react-native-ui-kitten';
import { GradientButton } from '../Components/gradientButton';
import Ionicons from 'react-native-vector-icons/Ionicons'

import {
  ConversationsAreaChart,
  DebtProgressChart
} from '../Components/';

import { ifIphoneX } from 'react-native-iphone-x-helper'

import voters from './../Data/raw/voters'

// ground swell (geyser image):
//   - from https://www.pexels.com/photo/water-geizer-1696474/
// import geyserImg from '../Assets/images/geyser.jpg'

// Campaigning:
//   - from https://www.reshot.com/photos/business-family-businessman-converse-conversation-conversations-millennial-business-professional_rs_vKjYG3
import campaignerImg from '../Assets/images/campaigner.jpg'
const { userTypeInstance } = require('../Utils/UserType.js')

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

const randomAvatar = (userTypeInstance.getUserType()) ? avatarArr[Math.floor(Math.random() * Math.floor(12))] : require('../Data/img/avatars/agatha.png')

class CampaignerScreen extends Component {
  /**
   * Ground Swell mock-up
   */
  static GS_PAGES = {
    mainPage: 0,
    conversation: 1,
    conversationRegisteredSearch: 2,
    conversationRegisteredSearchResults: 3,
    conversationRegisteredSurvey: 4,
    conversationNonRegisteredAdd: 5,
    conversationNonRegisteredSurvey: 6,
    addVoluneer: 7,
    addVolunteerNameAddressPhone: 8,
    progress: 9
  }

  constructor() {
    super()

    this.phoneNumber = undefined
    this.lastName = undefined
    this.searchResults = []
    this.selectedResult = undefined
    this.searchAnimation = false
    this.conversations = {
      highScore: 35,
      yourTotal: 31,
      registered: 17
    }

    this.uniqueKey = 0
  }
  /**
   * End Ground Swell mock-up
   */

  static navigationOptions = ({ navigation }) => {
    return {
      header: null,
      gesturesEnabled: false,
    }
  }
  // static navigationOptions = ({ navigation }) => {
  //   const params = navigation.state.params || {}
  //   return {
  //     title: 'Ground Swell'.toUpperCase(),
  //     headerLeft: (
  //       <TouchableOpacity onPress={() => alert('Info')} style={{marginLeft: 10}}>
  //         <Ionicons name='ios-information-circle-outline' size={30} color='gray' />
  //       </TouchableOpacity>
  //     ),
  //     headerRight: (
  //       <TouchableOpacity onPress={() => alert('Settings')} style={{marginRight: 10}}>
  //         <Ionicons name='logo-buffer' size={30} color='gray' />
  //       </TouchableOpacity>
  //     )
  //   }
  // }

  state = {
    gsPage: CampaignerScreen.GS_PAGES.mainPage   // Ground Swell mock-up
  };

  matchesPhoneNumber(normalizedPhoneNumber, aVoter) {
    // TODO
    return false
  }

  matchesLastName(lcLastName, aVoter) {
    if (aVoter && aVoter.hasOwnProperty('last_name')) {
      const lcVoterLastName = aVoter.last_name.toLowerCase()
      return (lcLastName == lcVoterLastName)
    }

    return false
  }

  handleSearchResultSelected() {
    this.setState({ gsPage:CampaignerScreen.GS_PAGES.conversationRegisteredSurvey })
  }

  handleSearchTermEntered(event) {
    this.handleSearchTransition(CampaignerScreen.GS_PAGES.conversationRegisteredSearchResults)
  }

  handleSearchTransition(aNextState) {
    // Show a spinner while we search and for a bit
    const currentState = this.state.gsPage
    this.searchAnimation = true
    const upToTwoSeconds = Math.ceil(Math.random() * 1500) + 500

    setTimeout(() => {
      this.searchResults = []
      this.selectedResult = undefined
      const normalizedPhoneNumber = undefined   // TODO:
      const lcLastName = (this.lastName) ? this.lastName.toLowerCase().trim() : undefined
      // Search using the phone number or name and produce a list of results along
      // with a random delay before proceeding. Also show a spinner.
      for (const voter of voters) {
        if (normalizedPhoneNumber) {
          // TODO
        }
        if (lcLastName && this.matchesLastName(lcLastName, voter)) {
          this.searchResults.push(voter)
        }
      }

      this.searchAnimation = false
      // console.info(`${this.handleSearchTransition.name}: num last name matches ${this.searchResults.length}`)
      // console.info(`${this.handleSearchTransition.name}: transitioning to state:`)
      // console.dir(aNextState)
      // TODO: some type of random delay with a spinner
      this.setState({ gsPage:aNextState })
    }, upToTwoSeconds)

    this.setState({gsPage:currentState})
  }

  headerButtonAction(transitionToState=undefined) {
    if (transitionToState === undefined) {
      this.props.navigation.toggleDrawer()
    } else {
      this.setState({ gsPage:transitionToState })
    }
  }

  donateButtonAction() {
    this.props.navigation.navigate('Donation')
  }

  getHeader(aTitle, backNavigationState=undefined) {
    const headerArr = []

    const icon = (backNavigationState === undefined) ?
      (
        <Image
          source={randomAvatar}
          style={{height: 30, width: 30, borderRadius: 15}}/>
      ) : (
        <Ionicons name='ios-arrow-back' size={30} color='gray' style={{textAlign: 'center'}}/>
      )
    headerArr.push((
      <TouchableOpacity
        key={this.uniqueKey++}
        onPress={() => this.headerButtonAction(backNavigationState)}
        style={styles.gsHeaderPanelLeft}>
        {icon}
      </TouchableOpacity>
    ))

    const ucTitle = aTitle.toUpperCase()
    headerArr.push((
      <RkText
        key={this.uniqueKey++}
        rkType='large'
        style={styles.gsHeaderPanelText}>{ucTitle}</RkText>
      ))

    // if (rightAction) {
    //   headerArr.push((
    //     <TouchableOpacity
    //       onPress={rightAction}
    //       style={styles.gsHeaderPanelRight}>
    //       <Ionicons name='ios-menu' size={30} color='gray' style={{textAlign: 'center'}} />
    //     </TouchableOpacity>
    //   ))
    // } else {
      headerArr.push(
        <View
          key={this.uniqueKey++}
          style={styles.gsHeaderPanelRight}
        />
      )
    // }

    return (
      <View id='headerPanelView' style={styles.gsHeaderPanelView}>
        {headerArr}
      </View>
    )
  }

  getButton(aButtonName, aNextState) {
    if (aButtonName === 'Search' &&
        aNextState === CampaignerScreen.GS_PAGES.conversationRegisteredSearchResults) {
      return (
        <GradientButton
          key={this.uniqueKey++}
          style={styles.gsGradientButton}
          rkType='large'
          text={aButtonName}
          onPress={() => this.handleSearchTransition(aNextState)} />
      )
      //
      //   <RkButton
      //     key={this.uniqueKey++}
      //     onPress={() => this.handleSearchTransition(aNextState)}
      //     rkType='clear'
      //     style={styles.gsButton}>
      //     <RkText style={styles.gsButtonText}>{aButtonName}</RkText>
      //   </RkButton>
      // )
    } else if (aButtonName === 'New Donation' &&
               aNextState === undefined) {
      return (
        <GradientButton
          key={this.uniqueKey++}
          style={styles.gsGradientButton}
          rkType='large'
          text={aButtonName}
          onPress={() => this.donateButtonAction()} />
      )
    }

    return (
      <GradientButton
        key={this.uniqueKey++}
        style={styles.gsGradientButton}
        rkType='large'
        text={aButtonName}
        onPress={() => this.setState({ gsPage:aNextState })} />
    )
      //
      // <RkButton
      //   key={this.uniqueKey++}
      //   onPress={() => this.setState({ gsPage:aNextState })}
      //   rkType='clear'
      //   style={styles.gsButton}>
      //   <RkText style={styles.gsButtonText}>{aButtonName}</RkText>
      // </RkButton>
    // )
  }

  getButtonPanel(theButtonsArr) {
    let buttons = theButtonsArr.map(buttonProps => (
      this.getButton(buttonProps.buttonName, buttonProps.nextState)
    ))

    return (
      <View style={styles.gsButtonPanelView}>
        {buttons}
        <View id='buttonFooter' style={{height:'2%'}} />
      </View>
    )
  }

  getSearchResultSelector() {
    let searchResultSelectors = this.searchResults.map(searchResultProps => (
      <View
        key={this.uniqueKey++}
        style={styles.gsProgressBlob}>
        <TouchableOpacity onPress={() => {
          this.selectedResult = searchResultProps
          this.handleSearchResultSelected()
        }}>
          <RkText rkType='medium' style={styles.gsProgressBlobText}>{searchResultProps.first_name} {searchResultProps.last_name}</RkText>
          <RkText rkType='small' style={styles.gsProgressBlobText}>{searchResultProps.streetAddress}</RkText>
          <RkText rkType='small' style={styles.gsProgressBlobText}>{searchResultProps.city}, {searchResultProps.state}</RkText>
          <RkText rkType='small' style={styles.gsProgressBlobText}>{searchResultProps.zipCode}</RkText>
          <RkText rkType='small' style={styles.gsProgressBlobText}>{searchResultProps.phone}</RkText>
        </TouchableOpacity>
      </View>
    ))
    return searchResultSelectors
  }

  render () {
    let buttonPanel = undefined
    let groundSwell = (<View style={styles.gsView}></View>)

    switch (this.state.gsPage) {
      case CampaignerScreen.GS_PAGES.conversation:
        buttonPanel = this.getButtonPanel([
          {buttonName: 'Registered Voter', nextState: CampaignerScreen.GS_PAGES.conversationRegisteredSearch},
          {buttonName: 'Non-Registered Voter', nextState: CampaignerScreen.GS_PAGES.conversationNonRegisteredAdd}
        ])
        groundSwell = (
          <View style={styles.gsView}>
            {this.getHeader('Voter Conversation', CampaignerScreen.GS_PAGES.mainPage)}
            <View style={{flex:1}}/>
            {buttonPanel}
          </View>
        )
        break;
      case CampaignerScreen.GS_PAGES.conversationRegisteredSearch:
        // TODO: disable the buttons and inputs if searchAnimation is true
        const ai = (this.searchAnimation) ?
          (<ActivityIndicator size='large' color='#FF8C00'/>) : undefined
        groundSwell = (
          <View style={styles.gsView}>
            {this.getHeader('Registered Voter Search', CampaignerScreen.GS_PAGES.conversation)}
            <View style={{flex:.05}}/>
            {/* TODO: Search Inputs: Phone or Name */}
            <View style={{width:'90%'}}>
              <RkTextInput
                rkType='rounded'
                placeholder='Last Name'
                onChangeText={(lastName) => {this.lastName = lastName}}
                blurOnSubmit={true}
                onSubmitEditing={(event) => this.handleSearchTermEntered(event) } />
              <RkText rkType='large' style={styles.gsBlackText}>or</RkText>
              <RkTextInput
                rkType='rounded'
                placeholder='Phone Number'
                editable={false}
                onChangeText={(phoneNumber) => {this.phoneNumber = phoneNumber}} />
            </View>
            <View style={{width:'100%', flex:0.95, justifyContent:'center'}}>
              {ai}
            </View>
          </View>
        )
        break;
      case CampaignerScreen.GS_PAGES.conversationRegisteredSearchResults:
        const searchResultSelector = this.getSearchResultSelector()
        groundSwell = (
          <View style={styles.gsView}>
            {this.getHeader('Voter Search Results', CampaignerScreen.GS_PAGES.conversationRegisteredSearch)}
            <ScrollView style={{flex:1, width:'100%'}}>
              {/* TODO: Selectable search results */}
              {searchResultSelector}
            </ScrollView>
          </View>
        )
        break;
      case CampaignerScreen.GS_PAGES.conversationRegisteredSurvey:
        // TODO: proxy search result info forward to add volunteer method
        buttonPanel = this.getButtonPanel([
          {buttonName: 'Add Volunteer', nextState: CampaignerScreen.GS_PAGES.addVoluneer},
          {buttonName: 'Done', nextState: CampaignerScreen.GS_PAGES.mainPage},
        ])
        const headerText = (this.selectedResult) ?
          `${this.selectedResult.first_name} ${this.selectedResult.last_name} Survey` :
          'Voter Survey'
        groundSwell = (
          <View style={styles.gsView}>
            {this.getHeader(headerText, CampaignerScreen.GS_PAGES.conversationRegisteredSearchResults)}
            <ScrollView style={{flex:.95, width:'100%'}}>
            {/* TODO: Survey questions w/ selectable results */}
              <View style={styles.gsProgressBlob}>
                <RkText rkType='medium' style={styles.gsProgressBlobText}>How likely are you to vote this election?</RkText>
                <RkText rkType='small' style={styles.gsProgressBlobText}>Very likely</RkText>
                <RkText rkType='small' style={styles.gsProgressBlobText}>Not sure</RkText>
                <RkText rkType='small' style={styles.gsProgressBlobText}>Not likely</RkText>
              </View>
              <View style={styles.gsProgressBlob}>
                <RkText rkType='medium' style={styles.gsProgressBlobText}>How do you feel about proposition 428?</RkText>
                <RkText rkType='small' style={styles.gsProgressBlobText}>I'm for proposition 428</RkText>
                <RkText rkType='small' style={styles.gsProgressBlobText}>Not sure</RkText>
                <RkText rkType='small' style={styles.gsProgressBlobText}>I'm against proposition 428</RkText>
              </View>
              <View style={styles.gsProgressBlob}>
                <RkText rkType='medium' style={styles.gsProgressBlobText}>How much student debt do you have?</RkText>
                <RkTextInput
                  rkType='rounded'
                  placeholder='$28,000.00'
                  onChangeText={(studentDebt) => {console.log(`Student debt: ${studentDebt}`)}}/>
              </View>
              <View style={styles.gsProgressBlob}>
                <RkText rkType='medium' style={styles.gsProgressBlobText}>Would you like to see funding dedicated to helping the unhomed population?</RkText>
                <RkText rkType='small' style={styles.gsProgressBlobText}>Very likely</RkText>
                <RkText rkType='small' style={styles.gsProgressBlobText}>Not sure</RkText>
                <RkText rkType='small' style={styles.gsProgressBlobText}>Not likely</RkText>
              </View>
              <View style={styles.gsProgressBlob}>
                <RkText rkType='medium' style={styles.gsProgressBlobText}>Would you like to see funding dedicated to upgrading our roads?</RkText>
                <RkText rkType='small' style={styles.gsProgressBlobText}>Very likely</RkText>
                <RkText rkType='small' style={styles.gsProgressBlobText}>Not sure</RkText>
                <RkText rkType='small' style={styles.gsProgressBlobText}>Not likely</RkText>
              </View>
            </ScrollView>
            <View style={[{flex: 0.05}, styles.gsButtonPanelHeader]}/>
            {buttonPanel}
          </View>
        )
        break;
      case CampaignerScreen.GS_PAGES.conversationNonRegisteredAdd:
        buttonPanel = this.getButtonPanel([
          // {buttonName: 'Next', nextState: CampaignerScreen.GS_PAGES.conversationNonRegisteredSurvey},
        ])
        groundSwell = (
          <View style={styles.gsView}>
            {this.getHeader('Non-Registered Voter', CampaignerScreen.GS_PAGES.conversation)}
            <View style={{width:'100%', flex:1, justifyContent:'center'}}>
              <View style={[styles.gsProgressBlob, {flex:1, justifyContent:'center'}]}>
                <RkText rkType='large' style={styles.gsBlackText}>Under Construction</RkText>
                <RkText rkType='medium' style={styles.gsBlackText}></RkText>
                <RkText rkType='medium' style={styles.gsBlackText}>This page will allow campaigners to help non-registered voters figure out where they can register to vote. It also gets them in the campaign database for further help with registering and go to vote efforts.</RkText>
              </View>
            </View>
            {/* TODO: Blurb about sending reistration info. */}
            {/* TODO: Gather Phone & Name */}
            {buttonPanel}
          </View>
        )
        break;
      case CampaignerScreen.GS_PAGES.conversationNonRegisteredSurvey:
        // TODO: proxy search result info forward to add volunteer method
        buttonPanel = this.getButtonPanel([
          {buttonName: 'Add Volunteer', nextState: CampaignerScreen.GS_PAGES.addVoluneer},
          {buttonName: 'Done', nextState: CampaignerScreen.GS_PAGES.mainPage},
        ])
        groundSwell = (
          <View style={styles.gsView}>
            {this.getHeader('Non-Registered Voter Survey', CampaignerScreen.GS_PAGES.conversationNonRegisteredAdd)}
            <View style={{flex:1}}/>
            {/* TODO: Survey questions w/ selectable results */}
            {buttonPanel}
          </View>
        )
        break;
        break;
      case CampaignerScreen.GS_PAGES.addVoluneer:
        // TODO: set next state for back based on where we came from
        groundSwell = (
          <View style={styles.gsView}>
            {this.getHeader('Add Volunteer', CampaignerScreen.GS_PAGES.mainPage)}
            <View style={{width:'100%', flex:1, justifyContent:'center'}}>
              <View style={[styles.gsProgressBlob, {flex:1, justifyContent:'center'}]}>
                <RkText rkType='large' style={styles.gsBlackText}>Under Construction</RkText>
                <RkText rkType='medium' style={styles.gsBlackText}></RkText>
                <RkText rkType='medium' style={styles.gsBlackText}>This page will allow campaigners to add another campaign volunteer who can also interact with voters, surveying sentiment, and competing with other campaigners.</RkText>
              </View>
            </View>
            {/* TODO: Blurb about sending deep link to app campaign info. */}
            {/* TODO: Gather Phone & Name */}
          </View>
        )
        break;
      case CampaignerScreen.GS_PAGES.progress:
        groundSwell = (
          <View style={styles.gsView}>
            {this.getHeader('Progress', CampaignerScreen.GS_PAGES.mainPage)}
            <ScrollView style={{flex:1, width:'100%'}}>
              { /* TODO: Ignore this blob below for scrolling--right now it interferes with scrolling. */}
              { /*       (i.e. When you try to scroll by grabbing it, there's no scrolling.) */}
              <View style={styles.gsProgressBlob}>
                <ConversationsAreaChart initValue={this.conversations.highScore + this.conversations.yourTotal}/>
              </View>
              <View style={styles.gsProgressBlob}>
                <RkText rkType='medium' style={styles.gsProgressBlobText}>Today ⭐️⭐️⭐️⭐️⭐️</RkText>
                <RkText rkType='small' style={styles.gsProgressBlobText}>Today's high score: {this.conversations.highScore}</RkText>
                <RkText rkType='small' style={styles.gsProgressBlobText}>  - {this.conversations.highScore - this.conversations.yourTotal + 1} more conversations to capture the lead!</RkText>
                <RkText rkType='small' style={styles.gsProgressBlobText}></RkText>
                <RkText rkType='small' style={styles.gsProgressBlobText}>Your conversations: {this.conversations.yourTotal}</RkText>
                <RkText rkType='small' style={styles.gsProgressBlobText}>  - {this.conversations.registered} registered voters</RkText>
                <RkText rkType='small' style={styles.gsProgressBlobText}>  - {this.conversations.yourTotal - this.conversations.registered} unregistered voters</RkText>
              </View>
              { /* TODO: make the dates below generate based on today's date. */}
              <View style={styles.gsProgressBlob}>
                <RkText rkType='medium' style={styles.gsPastProgressBlobText}>Sun. Mar. 31, 2019 ⭐️⭐️⭐️</RkText>
                <RkText rkType='small' style={styles.gsPastProgressBlobText}>Your conversations: 4</RkText>
                <RkText rkType='small' style={styles.gsPastProgressBlobText}>  - 1 registered voters</RkText>
                <RkText rkType='small' style={styles.gsPastProgressBlobText}>  - 3 unregistered voters</RkText>
              </View>
              <View style={styles.gsProgressBlob}>
                <RkText rkType='medium' style={styles.gsPastProgressBlobText}>Sat. Mar. 30, 2019 ⭐️⭐️⭐️⭐️</RkText>
                <RkText rkType='small' style={styles.gsPastProgressBlobText}>Your conversations: 12</RkText>
                <RkText rkType='small' style={styles.gsPastProgressBlobText}>  - 11 registered voters</RkText>
                <RkText rkType='small' style={styles.gsPastProgressBlobText}>  - 1 unregistered voters</RkText>
              </View>
            </ScrollView>
          </View>
        )
        break;
      default:  // CampaignerScreen.GS_PAGES.mainPage
        // TODO: refactor to an init method for common use
        this.searchResults = []
        this.selectedResult = undefined
        this.phoneNumber = undefined
        this.lastName = undefined

        buttonPanel = this.getButtonPanel([
          {buttonName: 'New Donation', nextState: CampaignerScreen.GS_PAGES.donation},
          // {buttonName: 'Voter Conversation', nextState: CampaignerScreen.GS_PAGES.conversation},
          // {buttonName: 'Add Volunteer', nextState: CampaignerScreen.GS_PAGES.addVoluneer},
          {buttonName: 'View Progress', nextState: CampaignerScreen.GS_PAGES.progress}
        ])
        groundSwell = (
          <View style={styles.gsView}>
            {this.getHeader('Canvassing')}
            <View style={{flex:1}}/>
            {buttonPanel}
          </View>
        )
    }

    return (
      <ImageBackground style={styles.gsTopImageView} source={campaignerImg} >
        <View style={styles.gsTopImageCoverView}>
          {groundSwell}
        </View>
      </ImageBackground>
    )
  }
}


const styles = RkStyleSheet.create(theme => ({
  gsTopImageView: {
    flex: 1,
    alignItems: 'center',
    width: '100%'
  },
  gsTopImageCoverView: {
    backgroundColor:'rgba(255,255,255,0.85)',
    width:'100%',
    flex: 1
  },
  gsView: {
    backgroundColor: 'transparent',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width:'100%',
  },
  gsHeaderPanelView: {
    width:'100%',
    ...ifIphoneX({
      height: 88,
      paddingTop: 44,
    }, {
      height: 64,
      paddingTop: 20,
    }),
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderColor: 'rgba(220,220,220,1)',
    borderStyle: 'solid',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 1,
    paddingHorizontal: 14,
    marginBottom: 3,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  gsHeaderPanelText: {
    fontSize: 17,
    fontWeight: '600',
    color: 'rgba(0,0,0,0.9)',
    marginHorizontal: 16,
    color: '#000000',
    padding:0,
    marginTop: 0,
    marginBottom: 0,
    textAlign: 'center',
    flex: 0.7
  },
  gsHeaderPanelLeft: {
    flex: 0.1,
    justifyContent: 'center',
    textAlign: 'center',
  },
  gsHeaderPanelRight: {
    flex: 0.1,
    justifyContent: 'center',
    textAlign: 'center'
  },
  gsButtonPanelHeader: {
    borderColor: 'rgba(256,140,00,0.6)',
    borderStyle: 'solid',
    borderTopWidth: 2,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    width:'100%',
    marginTop: 3
  },
  gsButtonPanelView: {
    width:'90%'
  },
  gsGradientButton: {
    height: 40,
    marginTop: 15,
    marginBottom: 15
  },
  gsButton: {
    backgroundColor: 'rgba(256,140,00,0.7)',
    borderColor: '#FF8C00',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5
  },
  gsButtonText: {
    color: '#FFFFFF',
    padding: 10
  },
  gsProgressBlob: {
    backgroundColor: 'rgba(255,255,255,0.65)',
    borderColor: '#FF8C00',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 10,
    margin: 5,
    padding: 10,
  },
  gsProgressBlobText: {
    color: 'black',
  },
  gsPastProgressBlobText: {
    color: '#BBBBBB',
  },
  gsText: {
    color: '#FFFFFF',
    textAlign: 'center'
  },
  gsBlackText: {
    color: 'black',
    textAlign: 'center'
  }
}));

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CampaignerScreen)
