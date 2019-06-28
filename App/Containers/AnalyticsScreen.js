import React, { Component } from 'react'
import { Alert, ScrollView, View } from 'react-native'
import { connect } from 'react-redux'
import {
  AreaChart,
  ProgressChart,
  DoughnutChart,
  AreaSmoothedChart,
  DebtProgressChart,
} from '../Components/charts'
const NUIF = require('../Utils/NavUIFactory.js')

class AnalyticsScreen extends Component {
  static propTypes = NUIF.requireNavBar
  static navigationOptions = NUIF.getNavOptions('Campaign Analytics', false)
  render() {
    return (
      <ScrollView contentContainerStyle={{alignItems: 'center'}}>
        <ProgressChart />
        <AreaChart />
        <DoughnutChart />
      </ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticsScreen)
