import React, { Component } from 'react'
import { connect } from 'react-redux'
import CanvasActions, { CanvasSelectors } from '../Redux/CanvassingRedux'
const UIF = require('../Utils/UIFactory.js')
const NUIF = require('../Utils/NavUIFactory.js')


const QUESTION_TYPE = {
  RANGE: 0,
  CHOICE: 1,
  TEXT: 2,
  VALUE: 3
}

let qid = 0
function getUniqueQuestionId() {
  return qid++
}

class CanvasConstituentQuestionaire extends Component {
  static propTypes = NUIF.requireNavBar
  static navigationOptions = NUIF.getNavOptions(
    'Questionaire',  false /* omit left header avatar */ )

  constructor (props) {
    super(props)

    this.questionaire = [
      {
        type: QUESTION_TYPE.RANGE,
        id: getUniqueQuestionId(),
        question: 'Which political party best represents your interests and ideas presently?',
        min: {
          label: 'Democrat',
          color: 'blue'
        },
        middle: {             // optional
          label: 'Neither',
          color: 'gray'
        },
        max: {
          label: 'Republican',
          color: 'red'
        },
        steps: 10,
        response: ''
      },
      {
        type: QUESTION_TYPE.RANGE,
        id: getUniqueQuestionId(),
        question: 'Which political party best are you a member of?',
        min: {
          label: 'Democrat',
          color: 'blue'
        },
        middle: {             // optional
          label: 'Neither',
          color: 'gray'
        },
        max: {
          label: 'Republican',
          color: 'red'
        },
        steps: 3,
        response: ''
      },
      {
        type: QUESTION_TYPE.CHOICE,
        id: getUniqueQuestionId(),
        question: 'Have you heard of <candidate> prior to this conversation?',
        choices: [
          {
            value: 'Yes',
            color: 'green',
          },
          {
            value: 'No',
            color: 'red'
          }
        ],
        response: ''
      },
      {
        type: QUESTION_TYPE.CHOICE,
        id: getUniqueQuestionId(),
        question: 'Are you happy with the current congressional representative for this district?',
        choices: [
          {
            value: 'Yes',
            color: 'green',
          },
          {
            value: 'Undecided',
            color: 'grey',
          },
          {
            value: 'No',
            color: 'red'
          }
        ],
        response: ''
      },
      {
        type: QUESTION_TYPE.CHOICE,
        id: getUniqueQuestionId(),
        question: 'What is your favorite type of cheese?',
        choices: [
          { value: 'cheddar' },
          { value: 'mozarella' },
          { value: 'provolone' },
          { value: 'moterey jack' },
          { value: 'pepper jack' },
          { value: 'muenster' },
          { value: 'I hate cheese' }
        ],
        response: ''
      },
      {
        type: QUESTION_TYPE.TEXT,
        id: getUniqueQuestionId(),
        question: 'Do you have anything you would like to ask <candidate>?',
        response: ''
      },
      {
        type: QUESTION_TYPE.VALUE,
        id: getUniqueQuestionId(),
        question: 'How much student debt do you have?',
        response: undefined
      }
    ]

    this.state = {
      updated: Date.now()
    }
  }

  handleRangeQuestion = (aQuestionId, aValue) => {
    console.log(`handleRangeQuestion: ${aQuestionId} = ${aValue}`)

    // TODO: push this into a component to prevent re-render of all questions (ouch)
    for (const question of this.questionaire) {
      if (aQuestionId === question.id) {
        if (question.response === aValue) {
          question.response = ''
        } else {
          question.response = aValue
        }
        this.setState({updated: Date.now()})
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
        case QUESTION_TYPE.RANGE:
          uiElements.push(UIF.getRangeQuestion(question, question.response, this.handleRangeQuestion))
          break;
        case QUESTION_TYPE.CHOICE:
          // uiElements.push(UIF.getChoiceQuestion(question))
          break;
        case QUESTION_TYPE.TEXT:
          // uiElements.push(UIF.getTextQuestion(question))
          break;
        case QUESTION_TYPE.VALUE:
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
