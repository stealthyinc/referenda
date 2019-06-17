import React, { Component } from 'react'
import { connect } from 'react-redux'
import CanvasActions, { CanvasSelectors } from '../Redux/CanvassingRedux'
import { RangeQuestion,
         ChoiceQuestion } from '../Utils/QuestionaireWidgets'

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

  render () {
    // console.log("ACREDUX", this.props.fetchReduxData)

    const uiElements = []
    for (const questionIndex in this.questionaire) {
      const question = this.questionaire[questionIndex]

      switch (question.type) {
        case C.QUESTION_TYPE.RANGE:
          console.log(`processing question: ${question.id} (${question.question})`)
          uiElements.push(
            <RangeQuestion
              key={UIF.getUniqueKey()}
              questionData={question}
              selectionHandlerFn={this.handleQuestionResponse} /> )
          // uiElements.push(UIF.getRangeQuestion(question, question.response, this.handleQuestionResponse))
          break;
        case C.QUESTION_TYPE.CHOICE:
          console.log(`processing question: ${question.id} (${question.question})`)
          uiElements.push(
            <ChoiceQuestion
              key={UIF.getUniqueKey()}
              questionData={question}
              selectionHandlerFn={this.handleQuestionResponse} /> )
          // uiElements.push(UIF.getChoiceQuestion(question))
          break;
        case C.QUESTION_TYPE.TEXT:
          // uiElements.push(UIF.getTextQuestion(question))
          break;
        case C.QUESTION_TYPE.VALUE:
          // uiElements.push(UIF.getValueQuestion(question))
          break;
        default:
          console.error(`Malformed question at index ${questionIndex}`)
      }
    }

    return (UIF.getScrollingContainer(uiElements))

    // return (
    //   <ScrollView style={styles.container}>
    //     {UIF.getRangeQuestion(undefined)}
    //     <TouchableOpacity onPress={() => this.props.navigation.navigate('Constituent Contribution')} style={{marginLeft: 10}}>
    //       <Text>Click here to Goto Contribution Container</Text>
    //     </TouchableOpacity>
    //   </ScrollView>
    // )
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
