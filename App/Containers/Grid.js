import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  RkButton, RkStyleSheet,
  RkText,
} from 'react-native-ui-kitten';
import { MainRoutes } from '../Navigation/Routes';

const paddingValue = 8;
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

class Grid extends Component {
  constructor(props) {
    super(props);
    const screenWidth = Dimensions.get('window').width;
    this.itemSize = {
      width: (screenWidth - (paddingValue * 6)) / 2,
      height: (screenWidth - (paddingValue * 6)) / 2,
    };
  }

  onItemPressed = (item) => {
    this.props.navigation.navigate(item.id);
  };

  renderItems = () => MainRoutes.map(route => (
    <RkButton
      rkType='square shadow'
      style={{ ...this.itemSize }}
      key={route.id}
      onPress={() => this.onItemPressed(route)}>
      <RkText style={styles.icon} rkType='primary moon menuIcon'>
        {route.icon}
      </RkText>
      <RkText>{route.title}</RkText>
    </RkButton>
  ));

  render = () => (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.rootContainer}>
      {this.renderItems()}
    </ScrollView>
  );
}

const styles = RkStyleSheet.create(theme => ({
  root: {
    backgroundColor: theme.colors.screen.base,
  },
  rootContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  empty: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border.base,
  },
  icon: {
    marginBottom: 16,
  },
}));

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Grid)
