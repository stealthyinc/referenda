import React, { Component } from 'react'
import {
  FlatList,
  View,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  ImageBackground,
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

// ground swell (geyser image):
//   - from https://www.pexels.com/photo/water-geizer-1696474/
import geyserImg from '../Assets/images/geyser.jpg'

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

  componentDidMount () {
  }

  getHeader(aTitle) {
    return (
      <View style={styles.gsHeaderPanelView}>
        <RkText rkType='large' style={styles.gsHeaderPanelText}>{aTitle}</RkText>
      </View>
    )
  }

  getButton(aButtonName, aNextState) {
    return (
      <RkButton
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
        groundSwell = (
          <View style={styles.gsView}>
            {this.getHeader('Registered Voter Search')}
            <View style={{flex:.95}}/>
            {/* TODO: Search Inputs: Phone or Name */}
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
        groundSwell = (
          <View style={styles.gsView}>
            {this.getHeader('Voter Search Results')}
            <View style={{flex:.95}}/>
            {/* TODO: Selectable search results */}
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
            <View style={{flex:.95}}>
            <View style={{width:'95%'}}>
            
            </View>
            </View>
            {buttonPanel}
            <View style={{flex:.05}}/>
          </View>
        )
        break;
      default:  // CampaignerScreen.GS_PAGES.mainPage
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
      <ImageBackground style={styles.gsTopView} source={geyserImg} >
        {groundSwell}
      </ImageBackground>
    )
  }
}

const styles = RkStyleSheet.create(theme => ({
  gsTopView: {
    flex: 1,
    alignItems: 'center',
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
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingTop: 30,
    borderColor: '#FF8C00',
    borderStyle: 'solid',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 2,
  },
  gsHeaderPanelText: {
    color: '#FFFFFF',
    padding:10,
    textAlign: 'center'
  },
  gsButtonPanelView: {
    width:'85%'
  },
  gsButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderColor: '#FF8C00',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 10,
    margin: 5,
    width: '100%',
  },
  gsButtonText: {
    color: '#FFFFFF',
    padding: 10
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
