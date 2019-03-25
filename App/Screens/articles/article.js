import React from 'react';

import {
  ScrollView,
  Image,
  View,
  TouchableOpacity,
} from 'react-native';
import {
  RkCard,
  RkText,
  RkStyleSheet,
  RkButton,
  RkTheme,
} from 'react-native-ui-kitten';
import { GradientButton } from '../../Components/gradientButton'
import { data } from '../../Data';
import {
  Avatar,
  SocialBar,
} from '../../Components';
import NavigationType from '../../Navigation/propTypes';

import {
  GuaidoDonutChart,
  DoughnutChart,
} from '../../Components/';

const moment = require('moment');

export class Article extends React.Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };
  static navigationOptions = {
    title: 'Article View'.toUpperCase(),
  };

  constructor(props) {
    super(props);
    const articleId = this.props.navigation.getParam('id', 1);
    this.data = data.getArticle(articleId);
  }

  onAvatarPressed = () => {
    this.props.navigation.navigate('Profile', { id: 0 });
  };

  render = () => {
    if (this.data.hasOwnProperty('survey') && this.data.survey) {
      const chartBackgroundStyle = { backgroundColor: RkTheme.current.colors.control.background };
      return (
        <ScrollView style={styles.root}>
          <RkCard rkType='article'>
            <TouchableOpacity
              delayPressIn={70}
              activeOpacity={0.8}
              onPress={() =>  this.props.navigation.navigate('Video')}>
              <Image rkCardImg source={this.data.photo} />
            </TouchableOpacity>
            <View rkCardHeader>
              <View>
                <RkText style={styles.title} rkType='header4'>{this.data.header}</RkText>
                <RkText rkType='secondary2 hintColor'>
                  {moment().add(this.data.time, 'seconds').fromNow()}
                </RkText>
              </View>
              <TouchableOpacity onPress={this.onAvatarPressed}>
                <Avatar rkType='circle' img={require('../../Data/img/avatars/guaido.jpg')} />
              </TouchableOpacity>
            </View>
            <View rkCardFooter>
              <SocialBar navigation={this.props.navigation}/>
            </View>
            <View rkCardContent>
              <View>
                <RkText rkType='primary3 bigLine'>{this.data.text}</RkText>
              </View>
            </View>
            <View rkCardContent>
              <View id='button-view' style={{height: 50,
                                             padding: 5,
                                             width: '100%',
                                             flexDirection: 'row',
                                             justifyContent: 'space-between'}}>
                <GradientButton
                  colors={['gold', '#828282']}
                  style={[{height:'100%', width:'35%'}]}
                  rkType='large'
                  text='Maduro'
                />
                <GradientButton
                  colors={['blue', '#828282']}
                  style={[{height:'100%', width:'35%'}]}
                  rkType='large'
                  text='Guaido'
                />
              </View>
            </View>
            <View rkCardContent>
              <View style={[styles.chartBlock, chartBackgroundStyle]}>
                <GuaidoDonutChart />
              </View>
            </View>
          </RkCard>
        </ScrollView>
      )
    } else {
      return (
        <ScrollView style={styles.root}>
          <RkCard rkType='article'>
            <TouchableOpacity
              delayPressIn={70}
              activeOpacity={0.8}
              onPress={() =>  this.props.navigation.navigate('Video')}>
              <Image rkCardImg source={this.data.photo} />
            </TouchableOpacity>
            <View rkCardHeader>
              <View>
                <RkText style={styles.title} rkType='header4'>{this.data.header}</RkText>
                <RkText rkType='secondary2 hintColor'>
                  {moment().add(this.data.time, 'seconds').fromNow()}
                </RkText>
              </View>
              <TouchableOpacity onPress={this.onAvatarPressed}>
                <Avatar rkType='circle' img={require('../../Data/img/avatars/guaido.jpg')} />
              </TouchableOpacity>
            </View>
            <View rkCardFooter>
              <SocialBar navigation={this.props.navigation}/>
            </View>
            <View rkCardContent>
              <View>
                <RkText rkType='primary3 bigLine'>{this.data.text}</RkText>
              </View>
            </View>
          </RkCard>
        </ScrollView>
      )
    }
  }
}

const styles = RkStyleSheet.create(theme => ({
  root: {
    backgroundColor: theme.colors.screen.base,
  },
  title: {
    marginBottom: 5,
  },
  chartBlock: {
    padding: 15,
    marginBottom: 15,
    justifyContent: 'center',
  },
}));
