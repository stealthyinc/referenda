import React, { Component } from 'react'
import { Alert, ScrollView, View } from 'react-native'
import { connect } from 'react-redux'
import {
  Container,
  Header,
  Title,
  Content,
  Text,
  Button,
  Icon,
  Left,
  Right,
  Body,
  Tabs,
  Tab,
  TabHeading,
  ScrollableTab
} from "native-base";
import LeaderBoard from '../Components/LeaderBoard'
import {
  AreaChart,
  ProgressChart,
  DoughnutChart,
  AreaSmoothedChart,
  DebtProgressChart,
} from '../Components/charts'
import Modal from 'react-native-modal';

class LeaderScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: null,
    }
  }
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      sortBy: 'score',
      data: [
        { name: 'We Tu Lo', level: 0, score: null, iconUrl: 'https://st2.depositphotos.com/1006318/5909/v/950/depositphotos_59094043-stock-illustration-profile-icon-male-avatar.jpg' },
        { name: 'Adam Savage', level: 0, score: 12, iconUrl: 'https://www.shareicon.net/data/128x128/2016/09/15/829473_man_512x512.png' },
        { name: 'Derek Black', level: 2, score: 244, iconUrl: 'http://ttsbilisim.com/wp-content/uploads/2014/09/20120807.png' },
        { name: 'Erika White', level: 1, score: 0, iconUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr27ZFBaclzKcxg2FgJh6xi3Z5-9vP_U1DPcB149bYXxlPKqv-' },
        { name: 'Jimmy John', level: 0, score: 20, iconUrl: 'https://static.witei.com/static/img/profile_pics/avatar4.png' },
        { name: 'Joe Roddy', level: 2, score: 69, iconUrl: 'https://st2.depositphotos.com/1006318/5909/v/950/depositphotos_59094043-stock-illustration-profile-icon-male-avatar.jpg' },
        { name: 'Ericka Johannesburg', level: 3, score: 101, iconUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShPis8NLdplTV1AJx40z-KS8zdgaSPaCfNINLtQ-ENdPvrtMWz' },
        { name: 'Tim Thomas', level: 1, score: 41, iconUrl: 'https://www.shareicon.net/data/128x128/2016/09/15/829473_man_512x512.png' },
        { name: 'Tina Turner', level: 1, score: 22, iconUrl: 'https://cdn.dribbble.com/users/223408/screenshots/2134810/me-dribbble-size-001-001_1x.png' },
        { name: 'Harry Reynolds', level: 0, score: null, iconUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsSlzi6GEickw2Ft62IdJTfXWsDFrOIbwXhzddXXt4FvsbNGhp' },
        { name: 'Betty Davis', level: 1, score: 25, iconUrl: 'https://landofblogging.files.wordpress.com/2014/01/bitstripavatarprofilepic.jpeg?w=300&h=300' },
        { name: 'Lauren Leonard', level: 2, score: 30, iconUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr27ZFBaclzKcxg2FgJh6xi3Z5-9vP_U1DPcB149bYXxlPKqv-' },
      ]
    };
  }
  _alert = (title, body) => {
    Alert.alert(title, body,
      [{ text: 'OK', onPress: () => { } },],
      { cancelable: false }
    )
  }
  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };
  renderModalContent = () => (
    <View style={{
      backgroundColor: 'white',
      padding: 22,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 4,
      borderColor: 'rgba(0, 0, 0, 0.1)',
    }}>
      <Text style={{
        fontSize: 20,
        marginBottom: 12,
      }}>Sort Options 🧮</Text>
      <View style={{width: '100%', flexDirection: 'row', justifyContent: 'center'}}>
      <Button
        style={{marginHorizontal:20}}
        onPress={() => this.setState({ isModalVisible: false, sortBy: 'score' })}
      >
        <Text>By Score</Text>
      </Button>
      <Button
        success
        style={{marginHorizontal:20}}
        onPress={() => this.setState({ isModalVisible: false, sortBy: 'level' })}
      >
        <Text>By Level</Text>
      </Button>
      </View>
    </View>
  );
  render() {
    const props = {
       labelBy: 'name',
       sortBy: this.state.sortBy,
       data: this.state.data,
       icon: 'iconUrl',
       onRowPress: (item, index) => {
         this._alert(item.name + " clicked",
           item.score + " points: will show history in the future!")
       },
       evenRowColor: '#F4F4F4',
    }
    return (
      <Container style={{ backgroundColor: "#fff" }}>
        <Modal
          isVisible={this.state.isModalVisible === true}
          onBackdropPress={() => this.setState({ isModalVisible: false })}
        >
          {this.renderModalContent()}
        </Modal>
        <Header hasTabs>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Leader Board</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => this.toggleModal()}>
              <Icon name="options" />
            </Button>
          </Right>
        </Header>
        <Tabs renderTabBar={() => <ScrollableTab />}>
          <Tab heading={ <TabHeading><Icon name="trophy" /><Text>Rankings</Text></TabHeading>}>
            <LeaderBoard {...props} />
          </Tab>
          <Tab style={{flex: 1}} heading={ <TabHeading><Icon name="stats" /><Text>Statistics</Text></TabHeading>}>
            <ScrollView contentContainerStyle={{alignItems: 'center'}}>
              <ProgressChart />
              <AreaChart />
              <DoughnutChart />
            </ScrollView>
          </Tab>
        </Tabs>
      </Container>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(LeaderScreen)
