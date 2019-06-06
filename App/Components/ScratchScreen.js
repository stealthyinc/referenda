import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  FlatList,
  Text,
  View
} from 'react-native'
import { Dashboard } from '../Screens'
import {
  Badge,
  Card,
  Button,
  Divider,
  Icon,
  ListItem
} from 'react-native-elements'

const list = [
  {
    name: 'Jack Black',
    avatar: require('../Data/img/avatars/Image1.png'),
    icon: (<Icon
      name='star'
      type='font-awesome'
      color='#ffd700'/>)
  },
  {
    name: 'Chris Jackson',
    avatar: require('../Data/img/avatars/Image2.png'),
    icon: (<Icon
      name='star'
      type='font-awesome'
      color='#bec2cb'/>)
  },
  {
    name: 'Amy Farha',
    avatar: require('../Data/img/avatars/Image3.png'),
    icon: (<Icon
      name='star'
      type='font-awesome'
      color='#cd7f32'/>)
  },
  {
    name: 'Joe Davidson',
    avatar: require('../Data/img/avatars/Image4.png'),
    icon: 'flight-takeoff'
  },
  {
    name: 'Brett Saunders',
    avatar: require('../Data/img/avatars/Image5.png'),
    icon: 'av-timer'
  },
  {
    name: 'Flip Davis',
    avatar: require('../Data/img/avatars/Image6.png'),
    icon: 'flight-takeoff'
  },
  {
    name: 'Joe Davidson',
    avatar: require('../Data/img/avatars/Image7.png'),
    icon: 'flight-takeoff'
  },
  {
    name: 'Brett Saunders',
    avatar: require('../Data/img/avatars/Image8.png'),
    icon: 'av-timer'
  },
  {
    name: 'Flip Davis',
    avatar: require('../Data/img/avatars/Image9.png'),
    icon: 'flight-takeoff'
  },
]
  
class ScratchScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      gesturesEnabled: false
    }
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ({ item }) => (
    <View>
      <ListItem
        title={item.name}
        subtitle={item.subtitle}
        leftAvatar={{source: item.avatar}}
        rightIcon={item.icon}
        bottomDivider
      />
    </View>
  )

  render () {
    return (
      <View>
        <Card
          title='Agatha Campaign Leaderboard'
          image={require('../Data/img/avatars/agatha.png')}>
        </Card>
        <FlatList
          keyExtractor={this.keyExtractor}
          data={list}
          renderItem={this.renderItem}
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    engineCommandExec: (aCommand) => dispatch(EngineActions.engineCommandExec(aCommand))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScratchScreen)
