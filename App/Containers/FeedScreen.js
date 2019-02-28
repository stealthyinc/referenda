import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  FlatList,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  RkCard, RkStyleSheet,
  RkText,
} from 'react-native-ui-kitten';
import { Avatar } from '../Components';
import { data } from '../Data';
import NavigationType from '../Navigation/propTypes';
import Ionicons from 'react-native-vector-icons/Ionicons'
import SettingsActions from '../Redux/SettingsRedux'

const moment = require('moment');
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
const styles = RkStyleSheet.create(theme => ({
  container: {
    backgroundColor: theme.colors.screen.scroll,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  card: {
    marginVertical: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 17,
  },
}));

class FeedScreen extends Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    return {
      headerLeft: (
        <TouchableOpacity onPress={() => params.drawer()} style={{marginLeft: 10}}>
          <Ionicons name='ios-cog' size={30} color='gray' />
        </TouchableOpacity>
      ),
      headerTitle: 'Proposals'.toUpperCase(),
      headerBackTitle: 'Back',
      headerTintColor: 'black',
    }
  };

  state = {
    data: data.getArticles('article')
  };

  async componentDidMount () {
    this.props.navigation.setParams({ navigation: this.props.navigation, drawer: this.props.settingsMenuToggle })
  }

  extractItemKey = (item) => `${item.id}`;

  onItemPressed = (item) => {
    this.props.navigation.navigate('Article', { id: item.id });
  };

  renderItem = ({ item }) => (
    <TouchableOpacity
      delayPressIn={70}
      activeOpacity={0.8}
      onPress={() => this.onItemPressed(item)}>
      <RkCard rkType='blog' style={styles.card}>
        <Image rkCardImg source={item.photo} />
        <View rkCardHeader style={styles.content}>
          <RkText style={styles.section} rkType='header4'>{item.title}</RkText>
        </View>
        <View rkCardContent>
          <View>
            <RkText rkType='primary3 mediumLine' numberOfLines={2}>{item.text}</RkText>
          </View>
        </View>
        <View rkCardFooter>
          <View style={styles.userInfo}>
            <Avatar style={styles.avatar} rkType='circle small' img={item.user.photo} />
            <RkText rkType='header6'>{`${item.user.firstName} ${item.user.lastName}`}</RkText>
          </View>
          <RkText rkType='secondary2 hintColor'>{moment().add(item.time, 'seconds').fromNow()}</RkText>
        </View>
      </RkCard>
    </TouchableOpacity>
  );

  render = () => (
    <FlatList
      data={this.state.data}
      renderItem={this.renderItem}
      keyExtractor={this.extractItemKey}
      style={styles.container}
    />
  );
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    settingsMenuToggle: () => dispatch(SettingsActions.settingsMenuToggle())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedScreen)
