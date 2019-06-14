import FeedContainer from '../../containers/FeedContainer'
import SurveyContainer from '../../containers/SurveyContainer'
import ArticleContainer from '../../containers/ArticleContainer'

export const WebRoutes = {
  Home: {
    component: SurveyContainer,
    path: "/",
    exact: true
  },
  Survey: {
    component: SurveyContainer,
    path: "/survey"
  },
  Article: {
    component: ArticleContainer,
    path: "/article"
  },
  Feed: {
    component: FeedContainer,
    path: "/feed"
  },
};
