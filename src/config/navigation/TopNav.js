import React from "react";
import { View, Button, StyleSheet } from "react-native";
import { withRouter } from "react-router-dom";
import {
  RkText,
  RkButton,
  RkStyleSheet,
} from 'react-native-ui-kitten';
import { FontIcons } from '../../assets/icons';

const TopNav = ({ history }) => {
  return (
    <View style={styles.main}>
      <RkButton
        rkType='tile'
        style={{ height: 60, width: 60 }}
        key='LoginMenu'
        onPress={() => this.onItemPressed(null)}>
        <RkText style={styles.icon} rkType='primary moon small'>
          {FontIcons.login}
        </RkText>
      </RkButton>
      {/*<RkButton
        rkType='tile'
        style={{ height: 60, width: 60 }}
        key='ProfileMenu'
        onPress={() => this.onItemPressed(null)}>
        <RkText style={styles.icon} rkType='primary moon small'>
          {FontIcons.profile}
        </RkText>
      </RkButton>*/}
      <RkButton
        rkType='tile'
        style={{ height: 60, width: 60 }}
        key='ArticleMenu'
        onPress={() => this.onItemPressed(null)}>
        <RkText style={styles.icon} rkType='primary moon small'>
          {FontIcons.article}
        </RkText>
      </RkButton>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#ffffff"
  },
  icon: {
    margin: 5,
  },
});

export default withRouter(TopNav);
