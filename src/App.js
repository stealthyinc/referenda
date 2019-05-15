import React from 'react';
import { Platform, View } from 'react-native';
import WebRoutesGenerator from './config/navigation/webRouteWrapper';
import { ModalContainer } from "react-router-modal";
import {
  createDrawerNavigator,
  createStackNavigator,
} from 'react-navigation';
import { withRkTheme } from 'react-native-ui-kitten';
import { AppRoutes } from './config/navigation/routesBuilder';
import { WebRoutes } from './config/navigation/routes';
import * as Screens from './screens';
import { bootstrap } from './config/bootstrap';
// import track from './config/analytics';
import TopNav from "./config/navigation//TopNav";
import { data } from './data';

bootstrap();
data.populateData();

const KittenApp = createStackNavigator({
  First: {
    screen: Screens.SplashScreen,
  },
  Home: {
    screen: createDrawerNavigator(
      {
        ...AppRoutes,
      },
      {
        contentComponent: (props) => {
          const SideMenu = withRkTheme(Screens.SideMenu);
          return <SideMenu {...props} />;
        },
      },
    ),
  },
}, {
  headerMode: 'none',
});

class App extends React.Component {
  state = {
    isLoaded: false,
  };

  componentWillMount() {
    // this.loadAssets();
  }

  onNavigationStateChange = (previous, current) => {
    const screen = {
      current: this.getCurrentRouteName(current),
      previous: this.getCurrentRouteName(previous),
    };
    // if (screen.previous !== screen.current) {
    //   track(screen.current);
    // }
  };

  getCurrentRouteName = (navigation) => {
    const route = navigation.routes[navigation.index];
    return route.routes ? this.getCurrentRouteName(route) : route.routeName;
  };

  render() {
    if (Platform.OS === 'web') {
      return (
        <View style={{ height: "100vh", width: "100vw" }}>
          {/*<TopNav />*/}
          {WebRoutesGenerator({ routeMap: WebRoutes })}
          <ModalContainer />
        </View>
      );
    }
    else {
      return (
        <View style={{ flex: 1 }}>
          <KittenApp onNavigationStateChange={this.onNavigationStateChange} />
        </View>
      )
    }
  }
}

// const dApp = createAppContainer(App)

let hotWrapper = () => () => App;
if (Platform.OS === 'web') {
  const { hot } = require('react-hot-loader');
  hotWrapper = hot;
}
export default hotWrapper(module)(App);
