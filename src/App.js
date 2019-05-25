import React from 'react'
import { View } from 'react-native'
import WebRoutesGenerator from './config/navigation/webRouteWrapper'
import FeedContainer from './containers/FeedContainer'
import ArticleContainer from './containers/ArticleContainer'

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
  render = () => {
    return (
      <View>
        {WebRoutesGenerator({ routeMap: WebRoutes })}
      </View>
    )
  }
}
