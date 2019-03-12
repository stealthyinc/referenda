import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import {Agenda} from 'react-native-calendars';
import NavigationType from '../Navigation/propTypes';
import Ionicons from 'react-native-vector-icons/Ionicons'

class CalendarScreen extends Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    return {
      headerTitle: 'Events'.toUpperCase(),
      headerLeft: (
        <TouchableOpacity onPress={() => alert('More Info')} style={{marginLeft: 10}}>
          <Ionicons name='ios-information-circle-outline' size={30} color='gray' />
        </TouchableOpacity>
      ),
      headerRight: (
        <TouchableOpacity onPress={() => alert('New Event')} style={{marginRight: 10}}>
          <Ionicons name='ios-add-circle-outline' size={30} color='gray' />
        </TouchableOpacity>
      ),
      headerBackTitle: 'Back',
      headerTintColor: 'black',
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      items: {}
    };
  }

  render() {
    return (
      <Agenda
        items={this.state.items}
        loadItemsForMonth={this.loadItems.bind(this)}
        selected={'2019-03-08'}
        renderItem={this.renderItem.bind(this)}
        renderEmptyDate={this.renderEmptyDate.bind(this)}
        rowHasChanged={this.rowHasChanged.bind(this)}
        // markingType={'period'}
        // markedDates={{
        //    '2019-03-08': {textColor: '#666'},
        //    '2019-03-09': {textColor: '#666'},
        //    '2019-03-14': {startingDay: true, endingDay: true, color: '#90ee90'},
        //    '2019-03-21': {startingDay: true, color: '#90ee90'},
        //    '2019-03-22': {endingDay: true, color: '#ffcba4'},
        //    '2019-03-24': {startingDay: true, color: '#ffcba4'},
        //    '2019-03-25': {color: '#ffcba4'},
        //    '2019-03-26': {endingDay: true, color: '#ffcba4'}}}
         // monthFormat={'yyyy'}
         // theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
        //renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
      />
    );
  }

  loadItems(day) {
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);
        if (!this.state.items[strTime]) {
          this.state.items[strTime] = [];
          const numItems = Math.floor(Math.random() * 5);
          for (let j = 0; j < numItems; j++) {
            this.state.items[strTime].push({
              name: 'Agenda for ' + strTime,
              height: Math.max(50, Math.floor(Math.random() * 150))
            });
          }
        }
      }
      //console.log(this.state.items);
      const newItems = {};
      Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
      this.setState({
        items: newItems
      });
    }, 1000);
    // console.log(`Load Items for ${day.year}-${day.month}`);
  }

  renderItem(item) {
    return (
      <View style={[styles.item, {height: item.height}]}><Text>{item.name}</Text></View>
    );
  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}><Text>This is empty date!</Text></View>
    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    height: 15,
    flex:1,
    paddingTop: 30
  }
});

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CalendarScreen)
