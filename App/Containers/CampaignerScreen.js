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
// import { LinearGradient } from 'expo';
import LinearGradient from 'react-native-linear-gradient';
import { data } from '../Data';
import { PasswordTextInput } from '../Components/passwordTextInput';
import { UIConstants } from '../Config/AppConstants';
import { scaleVertical } from '../Utils/scale';
import Ionicons from 'react-native-vector-icons/Ionicons'
import FlipCard from 'react-native-flip-card'

import {
  ConversationsAreaChart,
  DebtProgressChart
} from '../Components/';

import voters from './../Data/raw/voters'

// ground swell (geyser image):
//   - from https://www.pexels.com/photo/water-geizer-1696474/
// import geyserImg from '../Assets/images/geyser.jpg'

// Campaigning:
//   - from https://www.reshot.com/photos/business-family-businessman-converse-conversation-conversations-millennial-business-professional_rs_vKjYG3
import campaignerImg from '../Assets/images/campaigner.jpg'

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

  static navigationOptions = {
    header: null
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

  handleSearchTransition(aNextState) {
    // Show a spinner while we search and for a bit
    const currentState = this.state.gsPage
    this.searchAnimation = true
    const upToTwoSeconds = Math.ceil(Math.random() * 1500) + 500

    setTimeout(() => {
      this.searchResults = []
      const normalizedPhoneNumber = undefined   // TODO:
      const lcLastName = (this.lastName) ? this.lastName.toLowerCase() : undefined
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
      console.info(`${this.handleSearchTransition.name}: num last name matches ${this.searchResults.length}`)
      console.info(`${this.handleSearchTransition.name}: transitioning to state:`)
      console.dir(aNextState)
      // TODO: some type of random delay with a spinner
      this.setState({ gsPage:aNextState })
    }, upToTwoSeconds)

    this.setState({gsPage:currentState})
  }

  getHeader(aTitle) {
    return (
      <View style={styles.gsHeaderPanelView}>
        <RkText rkType='large' style={styles.gsHeaderPanelText}>{aTitle}</RkText>
      </View>
    )
  }

  getButton(aButtonName, aNextState) {
    if (aNextState === CampaignerScreen.GS_PAGES.conversationRegisteredSearchResults) {
      return (
        <RkButton
          key={this.uniqueKey++}
          onPress={() => this.handleSearchTransition(aNextState)}
          rkType='clear'
          style={styles.gsButton}>
          <RkText style={styles.gsButtonText}>{aButtonName}</RkText>
        </RkButton>
      )
    }
    return (
      <RkButton
        key={this.uniqueKey++}
        onPress={() => this.setState({ gsPage:aNextState })}
        rkType='clear'
        style={styles.gsButton}>
        <RkText style={styles.gsButtonText}>{aButtonName}</RkText>
      </RkButton>
    )
  }

  getButtonPanel(theButtonsArr) {
    let buttons = theButtonsArr.map(buttonProps => (
      this.getButton(buttonProps.buttonName, buttonProps.nextState)
    ))

    return (
      <View style={styles.gsButtonPanelView}>
        {buttons}
      </View>
    )
  }

  getSearchResultSelector() {
    let searchResultSelectors = this.searchResults.map(searchResultProps => (
      <View style={styles.gsProgressBlob}>
        <RkText rkType='medium' style={styles.gsProgressBlobText}>{searchResultProps.first_name} {searchResultProps.last_name}</RkText>
        <RkText rkType='small' style={styles.gsProgressBlobText}>{searchResultProps.streetAddress}</RkText>
        <RkText rkType='small' style={styles.gsProgressBlobText}>{searchResultProps.city}, {searchResultProps.state}</RkText>
        <RkText rkType='small' style={styles.gsProgressBlobText}>{searchResultProps.zipCode}</RkText>
        <RkText rkType='small' style={styles.gsProgressBlobText}>{searchResultProps.phone}</RkText>
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
          {buttonName: 'Non-Registered Voter', nextState: CampaignerScreen.GS_PAGES.conversationNonRegisteredAdd},
          {buttonName: 'Back', nextState: CampaignerScreen.GS_PAGES.mainPage}
        ])
        groundSwell = (
          <View style={styles.gsView}>
            {this.getHeader('Voter Conversation')}
            <View style={{flex:.95}}/>
            {buttonPanel}
            <View style={{flex:.05}}/>
          </View>
        )
        break;
      case CampaignerScreen.GS_PAGES.conversationRegisteredSearch:
        buttonPanel = this.getButtonPanel([
          {buttonName: 'Search', nextState: CampaignerScreen.GS_PAGES.conversationRegisteredSearchResults},
          {buttonName: 'Back', nextState: CampaignerScreen.GS_PAGES.conversation}
        ])
        // TODO: disable the buttons and inputs if searchAnimation is true
        const ai = (this.searchAnimation) ?
          (<ActivityIndicator size='large' color='#FF8C00'/>) : undefined
        groundSwell = (
          <View style={styles.gsView}>
            {this.getHeader('Registered Voter Search')}
            <View style={{flex:.05}}/>
            {/* TODO: Search Inputs: Phone or Name */}
            <View style={{width:'90%'}}>
              <RkTextInput
                rkType='rounded'
                placeholder='Phone Number'
                onChangeText={(phoneNumber) => {this.phoneNumber = phoneNumber}}/>
              <RkText rkType='large' style={styles.gsText}>or</RkText>
              <RkTextInput
                rkType='rounded'
                placeholder='Last Name'
                onChangeText={(lastName) => {this.lastName = lastName}}/>
            </View>
            <View style={{width:'100%', flex:0.9, justifyContent:'center'}}>
              {ai}
            </View>
            {buttonPanel}
            <View style={{flex:.05}}/>
          </View>
        )
        break;
      case CampaignerScreen.GS_PAGES.conversationRegisteredSearchResults:
        buttonPanel = this.getButtonPanel([
          {buttonName: 'Next', nextState: CampaignerScreen.GS_PAGES.conversationRegisteredSurvey},
          {buttonName: 'Back', nextState: CampaignerScreen.GS_PAGES.conversationRegisteredSearch}
        ])
        const searchResultSelector = this.getSearchResultSelector()
        groundSwell = (
          <View style={styles.gsView}>
            {this.getHeader('Voter Search Results')}
            <ScrollView style={{flex:.9, width:'100%'}}>
              {/* TODO: Selectable search results */}
              {searchResultSelector}
            </ScrollView>
            <View style={[{flex: 0.05}, styles.gsButtonPanelHeader]}/>
            {buttonPanel}
            <View style={{flex:.05}}/>
          </View>
        )
        break;
      case CampaignerScreen.GS_PAGES.conversationRegisteredSurvey:
        // TODO: proxy search result info forward to add volunteer method
        buttonPanel = this.getButtonPanel([
          {buttonName: 'Add Volunteer', nextState: CampaignerScreen.GS_PAGES.addVoluneer},
          {buttonName: 'Done', nextState: CampaignerScreen.GS_PAGES.mainPage},
          {buttonName: 'Back', nextState: CampaignerScreen.GS_PAGES.conversationRegisteredSearchResults}
        ])
        groundSwell = (
          <View style={styles.gsView}>
            {this.getHeader('Voter Survey')}
            <View style={{flex:.95}}/>
            {/* TODO: Survey questions w/ selectable results */}
            {buttonPanel}
            <View style={{flex:.05}}/>
          </View>
        )
        break;
      case CampaignerScreen.GS_PAGES.conversationNonRegisteredAdd:
        buttonPanel = this.getButtonPanel([
          {buttonName: 'Next', nextState: CampaignerScreen.GS_PAGES.conversationNonRegisteredSurvey},
          {buttonName: 'Back', nextState: CampaignerScreen.GS_PAGES.conversationRegisteredSearchResults}
        ])
        groundSwell = (
          <View style={styles.gsView}>
            {this.getHeader('Non-Registered Voter')}
            <View style={{flex:.95}}/>
            {/* TODO: Blurb about sending reistration info. */}
            {/* TODO: Gather Phone & Name */}
            {buttonPanel}
            <View style={{flex:.05}}/>
          </View>
        )
        break;
      case CampaignerScreen.GS_PAGES.conversationNonRegisteredSurvey:
        // TODO: proxy search result info forward to add volunteer method
        buttonPanel = this.getButtonPanel([
          {buttonName: 'Add Volunteer', nextState: CampaignerScreen.GS_PAGES.addVoluneer},
          {buttonName: 'Done', nextState: CampaignerScreen.GS_PAGES.mainPage},
          {buttonName: 'Back', nextState: CampaignerScreen.GS_PAGES.conversationNonRegisteredAdd}
        ])
        groundSwell = (
          <View style={styles.gsView}>
            {this.getHeader('Non-Registered Voter Survey')}
            <View style={{flex:.95}}/>
            {/* TODO: Survey questions w/ selectable results */}
            {buttonPanel}
            <View style={{flex:.05}}/>
          </View>
        )
        break;
        break;
      case CampaignerScreen.GS_PAGES.addVoluneer:
        // TODO: set next state for back based on where we came from
        buttonPanel = this.getButtonPanel([
          {buttonName: 'Done', nextState: CampaignerScreen.GS_PAGES.mainPage},
          {buttonName: 'Back', nextState: CampaignerScreen.GS_PAGES.mainPage}
        ])
        groundSwell = (
          <View style={styles.gsView}>
            {this.getHeader('Add Volunteer')}
            <View style={{flex:.95}}/>
            {/* TODO: Blurb about sending deep link to app campaign info. */}
            {/* TODO: Gather Phone & Name */}
            {buttonPanel}
            <View style={{flex:.05}}/>
          </View>
        )
        break;
      case CampaignerScreen.GS_PAGES.progress:
        buttonPanel = this.getButtonPanel([
          {buttonName: 'Back', nextState: CampaignerScreen.GS_PAGES.mainPage}
        ])
        groundSwell = (
          <View style={styles.gsView}>
            {this.getHeader('Progress')}
            <ScrollView style={{flex:.9, width:'100%'}}>
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
            <View style={[{flex: 0.05}, styles.gsButtonPanelHeader]}/>
            {buttonPanel}
            <View style={{flex:.05}}/>
          </View>
        )
        break;
      default:  // CampaignerScreen.GS_PAGES.mainPage
        // TODO: refactor to an init method for common use
        this.searchResults = []
        this.phoneNumber = undefined
        this.lastName = undefined

        buttonPanel = this.getButtonPanel([
          {buttonName: 'Voter Conversation', nextState: CampaignerScreen.GS_PAGES.conversation},
          {buttonName: 'Add Volunteer', nextState: CampaignerScreen.GS_PAGES.addVoluneer},
          {buttonName: 'View Progress', nextState: CampaignerScreen.GS_PAGES.progress}
        ])
        groundSwell = (
          <View style={styles.gsView}>
            {this.getHeader('Campaigning')}
            <View style={{flex:.95}}/>
            {buttonPanel}
            <View style={{flex:.05}}/>
          </View>
        )
    }

    return (
      <ImageBackground style={styles.gsTopView} source={campaignerImg} >
        <View style={{backgroundColor:'rgba(0,0,0,0.75)', width:'100%', flex:1}}>
          {groundSwell}
        </View>
      </ImageBackground>
    )
  }
}

const styles = RkStyleSheet.create(theme => ({
  gsTopView: {
    flex: 1,
    alignItems: 'center',
    width: '100%'
  },
  gsView: {
    backgroundColor: 'transparent',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width:'100%',
    borderColor: '#FF8C00',
    borderStyle: 'solid',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 2,
  },
  gsHeaderPanelView: {
    width:'100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingTop: 30,
    borderColor: '#FF8C00',
    borderStyle: 'solid',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 2,
    marginBottom: 3,
  },
  gsHeaderPanelText: {
    color: '#FFFFFF',
    padding:10,
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
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderColor: '#FF8C00',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 10,
    margin: 5,
    padding: 10,
  },
  gsProgressBlobText: {
    color: '#FFFFFF',
  },
  gsPastProgressBlobText: {
    color: '#BBBBBB',
  },
  gsText: {
    color: '#FFFFFF',
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
