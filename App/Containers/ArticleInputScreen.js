import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  View,
  Image,
  Keyboard,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {
  RkCard,
  RkButton,
  RkText,
  RkTextInput,
  RkStyleSheet,
  RkTheme,
  RkAvoidKeyboard,
} from 'react-native-ui-kitten';
import { GradientButton } from '../Components/';
import { scaleVertical } from '../Utils/scale';
import NavigationType from '../Navigation/propTypes';
import Ionicons from 'react-native-vector-icons/Ionicons'
import GuiActions, { GuiSelectors } from '../Redux/GuiRedux'

class ArticleInputScreen extends Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    return {
      headerTitle: 'New Article'.toUpperCase(),
      headerBackTitle: 'Back',
      headerTintColor: 'black',
    }
  };
  componentWillMount () {
    this.props.guiSetPhoto(null)
    this.props.guiSetTitle(null)
    this.props.guiSetDescr(null)
  }
  onSubmitArticle = () => {
    this.props.navigation.goBack();
    //tell the engine to do something with this
  }
  render() { 
    const image = (!this.props.photo) ? (
      <Image rkCardImg source={require('../Assets/images/placeholder.png')} />
    ) : (
      <Image rkCardImg source={{uri: this.props.photo}} />
    )
    return (
      <RkAvoidKeyboard
        style={styles.screen}
        onStartShouldSetResponder={() => true}
        onResponderRelease={() => Keyboard.dismiss()}>
        <View style={styles.content}>
          <View>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('CameraRoll')}>
              <RkCard rkType='blog' style={styles.card}>
                {image}
              </RkCard>
            </TouchableOpacity>
            <RkTextInput placeholder='Add a title...' onChangeText={(title) => this.props.guiSetTitle(title)} />
            <RkTextInput multiline style={{height: 200}} placeholder="Add a description..." onChangeText={(descr) => this.props.guiSetDescr(descr)} />
            <GradientButton
              style={styles.save}
              rkType='medium'
              text='Submit Article'
              onPress={this.onSubmitArticle}
            />
          </View>
          <View style={styles.footer}>
            <View style={styles.textRow}>
              <RkText rkType='primary3'>Change your mind?</RkText>
              <RkButton rkType='clear' onPress={() => this.props.navigation.goBack()}>
                <RkText rkType='header6'> Cancel</RkText>
              </RkButton>
            </View>
          </View>
        </View>
      </RkAvoidKeyboard>
    )
  }
}

const styles = RkStyleSheet.create(theme => ({
  screen: {
    padding: 16,
    flex: 1,
    justifyContent: 'space-around',
    backgroundColor: theme.colors.screen.base,
  },
  image: {
    marginBottom: 10,
    height: scaleVertical(77),
    resizeMode: 'contain',
  },
  content: {
    justifyContent: 'space-between',
  },
  save: {
    marginVertical: 20,
  },
  card: {
    marginBottom: 24,
    justifyContent: 'space-around',
  },
  buttons: {
    flexDirection: 'row',
    marginBottom: 24,
    marginHorizontal: 24,
    justifyContent: 'space-around',
  },
  footer: {
    justifyContent: 'flex-end',
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
}));

const mapStateToProps = (state) => {
  return {
    photo: GuiSelectors.guiGetPhoto(state),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    guiSetPhoto: (photo) => dispatch(GuiActions.guiSetPhoto(photo)),
    guiSetTitle: (title) => dispatch(GuiActions.guiSetTitle(title)),
    guiSetDescr: (descr) => dispatch(GuiActions.guiSetDescr(descr)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ArticleInputScreen)
