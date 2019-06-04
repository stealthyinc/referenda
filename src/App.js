import React from 'react'
import { View } from 'react-native'
import WebRoutesGenerator from './config/navigation/webRouteWrapper'
import FeedContainer from './containers/FeedContainer'
import ArticleContainer from './containers/ArticleContainer'
import amplitude from "amplitude-js";
import {
  AmplitudeProvider,
} from "@amplitude/react-amplitude";
const AMPLITUDE_KEY = (process.env.NODE_ENV === 'development') ? process.env.REACT_APP_AMPLITUDE_SANDBOX_API : process.env.REACT_APP_AMPLITUDE_PRODUCTION_API
const { firebaseInstance } = require('./utils/firebaseWrapper.js')

export const WebRoutes = {
  Home: {
    component: FeedContainer,
    path: ["/", "/:campaignName/", "/:campaignName/:postId"],
    exact: true
  },
  Article: {
    component: ArticleContainer,
    path: "/article"
  }
}

export default class App extends React.Component {
  componentWillMount = async () => {
    await firebaseInstance.loadUser()
    console.log("************", firebaseInstance.getUserId())
  }
  render = () => {
    return (
      <View>
        <AmplitudeProvider
          amplitudeInstance={amplitude.getInstance()}
          apiKey={AMPLITUDE_KEY}
          userId={firebaseInstance.getUserId()}
        >
          {WebRoutesGenerator({ routeMap: WebRoutes })}
        </AmplitudeProvider>
      </View>
    )
  }
}
