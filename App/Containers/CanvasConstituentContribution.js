import React, { Component } from 'react'
import { ScrollView, Text, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/CanvasConstituentContributionStyle'
import NavigationType from '../Navigation/propTypes';
import CanvasActions, { CanvasSelectors } from '../Redux/CanvassingRedux'

class CanvasConstituentContribution extends Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    return {
      headerTitle: 'Contribution'.toUpperCase(),
      headerBackTitle: 'Back',
      gesturesEnabled: false,
    }
  };
  // constructor (props) {
  //   super(props)
  //   this.state = {}
  // }

  render () {
    return (
      <ScrollView style={styles.container}>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Contact Search')} style={{marginLeft: 10}}>
          <Text>Click here to Goto Contacts Import</Text>
        </TouchableOpacity>
      </ScrollView>
    )
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

export default connect(mapStateToProps, mapDispatchToProps)(CanvasConstituentContribution)
