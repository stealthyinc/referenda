import React, { Component } from 'react'
import { connect } from 'react-redux'
import CanvasActions, { CanvasSelectors } from '../Redux/CanvassingRedux'
import { RangeQuestion,
         ChoiceQuestion,
         TextQuestion,
         ValueQuestion } from '../Utils/QuestionaireWidgets'
import { Metrics } from '../Themes/'
import { FontAwesome } from '../Assets/icons'

const C = require('../Utils/constants.js')
const UIF = require('../Utils/UIFactory.js')
const NUIF = require('../Utils/NavUIFactory.js')

class CanvasConstituentQuestionaire extends Component {
  static propTypes = NUIF.requireNavBar
  static navigationOptions = NUIF.getNavOptions(
    'Questionaire',  false /* omit left header avatar */ )

  constructor (props) {
    super(props)

    this.questionaire = C.questionaire

    this.state = {
      updated: Date.now()
    }
  }

  handleQuestionResponse = (aQuestionId, aValue) => {
    console.log(`handleQuestionResponse: ${aQuestionId} = ${aValue}`)

    for (const question of this.questionaire) {
      if (question.id === aQuestionId) {
        console.log(`Question id ${question.id} response is ${question.response}.`)
        break
      }
    }
  }

  handleDoneButtonPressed = () => {
    // TODO: push our data up to firebase for:
    //        - the Questionaire
    //        - the volunteer score
    //
    // TODO: we'll need to push the next destination up to redux and get it for here and
    //       modify the button so that users go back to the discussion screen.
    this.props.navigation.navigate('CanvasMenu')
  }

  render () {
    const uiElements = []
    for (const questionIndex in this.questionaire) {
      const question = this.questionaire[questionIndex]

      switch (question.type) {
        case C.QUESTION_TYPE.RANGE:
          uiElements.push(
            <RangeQuestion
              key={UIF.getUniqueKey()}
              questionData={question}
              selectionHandlerFn={this.handleQuestionResponse} /> )
          break;
        case C.QUESTION_TYPE.CHOICE:
          uiElements.push(
            <ChoiceQuestion
              key={UIF.getUniqueKey()}
              questionData={question}
              selectionHandlerFn={this.handleQuestionResponse} /> )
          break;
        case C.QUESTION_TYPE.TEXT:
          uiElements.push(
            <TextQuestion
              key={UIF.getUniqueKey()}
              questionData={question}
              selectionHandlerFn={this.handleQuestionResponse} /> )
          break;
        case C.QUESTION_TYPE.VALUE:
        uiElements.push(
          <ValueQuestion
            key={UIF.getUniqueKey()}
            questionData={question}
            selectionHandlerFn={this.handleQuestionResponse} /> )
          break;
        default:
          console.error(`Malformed question at index ${questionIndex}`)
      }
    }

    uiElements.push(UIF.getVerticalSpacer(Metrics.doubleBaseMargin))
    uiElements.push(UIF.getButton('Done', FontAwesome.chevronRight, this.handleDoneButtonPressed))

    return (UIF.getScrollingContainer(uiElements))
  }
}

const mapStateToProps = (state) => {
  return {
    fetchReduxData: CanvasSelectors.fetchData(state),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CanvasConstituentQuestionaire)
