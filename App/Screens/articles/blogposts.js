import React from 'react';
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
import { Avatar } from '../../Components';
import { data } from '../../Data';
import NavigationType from '../../Navigation/propTypes';
import SideMenu from 'react-native-side-menu'
import Settings from '../../Components/SettingsScreen'
import Ionicons from 'react-native-vector-icons/Ionicons'

const moment = require('moment');

export class Blogposts extends React.Component {
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
    data: data.getArticles('article'),
    isOpen: false,
  };

  async componentDidMount () {
    this.props.navigation.setParams({ navigation: this.props.navigation, drawer: this.toggleControlPanel })
  }

  extractItemKey = (item) => `${item.id}`;

  onItemPressed = (item) => {
    this.props.navigation.navigate('Article', { id: item.id });
  };

  toggleControlPanel = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  updateMenuState(isOpen) {
    this.setState({ isOpen });
  }

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
    <SideMenu
      menu={<Settings />}
      isOpen={this.state.isOpen}
      openMenuOffset={300}
      onChange={isOpen => this.updateMenuState(isOpen)}
    >
      <FlatList
        data={this.state.data}
        renderItem={this.renderItem}
        keyExtractor={this.extractItemKey}
        style={styles.container}
      />
    </SideMenu>
  );
}

const drawerStyles = {
  drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
  main: {paddingLeft: 3},
}

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
