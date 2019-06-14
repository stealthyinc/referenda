import React, { Component } from 'react'
import { ScrollView, Text, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/CanvasConstituentQuestionaireStyle'
import NavigationType from '../Navigation/propTypes';
import CanvasActions, { CanvasSelectors } from '../Redux/CanvassingRedux'

class CanvasConstituentQuestionaire extends Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    return {
      headerTitle: 'Questionaire'.toUpperCase(),
      headerBackTitle: 'Back',
      gesturesEnabled: false,
    }
  };
  // constructor (props) {
  //   super(props)
  //   this.state = {}
  // }

  render () {
    console.log("ACREDUX", this.props.canvasPayload)
    return (
      <ScrollView style={styles.container}>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Constituent Contribution')} style={{marginLeft: 10}}>
          <Text>Click here to Goto Contribution Container</Text>
        </TouchableOpacity>
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    canvasPayload: CanvasSelectors.fetchData(state),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CanvasConstituentQuestionaire)
