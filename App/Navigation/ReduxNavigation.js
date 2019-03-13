import React, { Component } from 'react'
import { BackHandler, Platform } from 'react-native'
import {
  createReactNavigationReduxMiddleware,
  reduxifyNavigator
} from 'react-navigation-redux-helpers'
import { connect } from 'react-redux'
import SettingsActions from '../Redux/SettingsRedux'
import AppNavigation from './AppNavigation'
import { Bootstrap } from '../Config/Bootstrap'
import { data } from '../Data'
import SideMenu from 'react-native-side-menu'
import Settings from '../Components/SettingsScreen'
import { SettingsSelectors } from '../Redux/SettingsRedux'

createReactNavigationReduxMiddleware(
  'root',
  (state) => state.nav
)

Bootstrap();
data.populateData();

const ReduxAppNavigator = reduxifyNavigator(AppNavigation, 'root')

class ReduxNavigation extends Component {
  componentDidMount () {
    if (Platform.OS === 'ios') return
    BackHandler.addEventListener('hardwareBackPress', () => {
      const { dispatch, nav } = this.props
      // change to whatever is your first screen, otherwise unpredictable results may occur
      if (nav.routes.length === 1 && (nav.routes[0].routeName === 'LaunchScreen')) {
        return false
      }
      // if (shouldCloseApp(nav)) return false
      dispatch({ type: 'Navigation/BACK' })
      return true
    })
  }

  componentWillUnmount () {
    if (Platform.OS === 'ios') return
    BackHandler.removeEventListener('hardwareBackPress', undefined)
  }

  logout () {
    this.props.dispatch(SettingsActions.settingsMenuToggle())
    this.props.dispatch({ type: 'Navigation/NAVIGATE', routeName: 'Auth' })
  }

  render () {
    return (
      <SideMenu
        menu={<Settings logout={() => this.logout()} />}
        isOpen={this.props.open}
        openMenuOffset={300}
        disableGestures={true}
        onChange={isOpen => this.props.dispatch(SettingsActions.settingsMenuUpdate(isOpen))}
      >
        <ReduxAppNavigator dispatch={this.props.dispatch} state={this.props.nav} />
      </SideMenu>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    nav: state.nav,
    open: SettingsSelectors.getOpen(state),
  }
}

export default connect(mapStateToProps)(ReduxNavigation)
