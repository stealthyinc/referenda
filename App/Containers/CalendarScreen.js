import React, { Component } from 'react'
import { ScrollView, Text } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import {
  RkCalendar,
  RkStyleSheet,
} from 'react-native-ui-kitten';

// Styles
import styles from './Styles/CalendarScreenStyle'

class CalendarScreen extends Component {
  // constructor (props) {
  //   super(props)
  //   this.state = {}
  // }
  static navigationOptions = {
    title: 'Events Calendar',
  };
  
  render () {
    return (
      <ScrollView style={styles.container}>
        <RkCalendar
          min={new Date(2018, 0, 1)}
          max={new Date(2019, 0, 1)}
        />
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

// const styles = RkStyleSheet.create(theme => ({
//   container: {
//     flex: 1,
//     backgroundColor: theme.colors.background,
//     paddingHorizontal: 8,
//   },
// }));


export default connect(mapStateToProps, mapDispatchToProps)(CalendarScreen)
