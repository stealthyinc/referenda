import React, { Component } from 'react'
import { Text,
         View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';

const UIF = require('./UIFactory.js')

class QuestionComponent extends Component {
  constructor(props) {
    super(props)

    this.questionData = props.questionData
    this.selectionHandlerFn =
      (props.hasOwnProperty('selectionHandlerFn') &&
       props.selectionHandlerFn) ? props.selectionHandlerFn : undefined

    this.state = {
      response: this.questionData.response
    }
  }

  handleSelectionChange = (aQuestionId, aValue) => {
    console.log(`handleSelectionChange: ${aQuestionId} = ${aValue}`)

    if (aQuestionId === this.questionData.id) {
      this.questionData.response =
        (this.questionData.response === aValue) ? '' : aValue

      if (this.hasOwnProperty('selectionHandlerFn') && this.selectionHandlerFn) {
        this.selectionHandlerFn(aQuestionId, aValue)
      }

      this.setState({response: this.questionData.response})
    }
  }

  handleValueChange = (aQuestionId, aValue) => {
    console.log(`handleValueChange: ${aQuestionId} = ${aValue}`)

    if (aQuestionId === this.questionData.id) {
      this.questionData.response = aValue

      if (this.hasOwnProperty('selectionHandlerFn') && this.selectionHandlerFn) {
        this.selectionHandlerFn(aQuestionId, aValue)
      }
    }
  }
}


class RangeQuestion extends QuestionComponent {
  constructor(props) {
    super(props)
  }

  render() {
    let questionWidget = undefined

    try {
      const labels = []
      const gradientColors = []

      for (const property of ['min', 'middle', 'max']) {
        if (this.questionData.hasOwnProperty(property)) {
          const qProperty = this.questionData[property]
          if (qProperty.hasOwnProperty('label')) {
            labels.push(
              <Text key={UIF.getUniqueKey()} style={UIF.styles.descriptionText}>
                {qProperty['label']}
              </Text> )
          }

          if (qProperty.hasOwnProperty('color')) {
            gradientColors.push(qProperty['color'])
          }
        }
      }

      let gradient = undefined
      if (gradientColors.length > 0) {
        gradient = (
          <LinearGradient
            colors={gradientColors}
            start={{x: 0, y: 0}} end={{x: 1, y: 0}}
            style={{height:5, borderRadius:2}} >
          </LinearGradient>
        )
      }

      const id = this.questionData.id

      const buttons = []
      for (let index = 1; index <= this.questionData.steps; index++) {
        if (index === this.state.response) {
          buttons.push(UIF.getQuestionButton(index, id, index, this.handleSelectionChange, 'gray', '#d9d9d9' /* 85% gray */))
        } else {
          buttons.push(UIF.getQuestionButton(index, id, index, this.handleSelectionChange))
        }
      }

      questionWidget = (
        <View key={UIF.getUniqueKey()} style={UIF.styles.questionViewContainer}>
          {UIF.getRow(UIF.getText(this.questionData.question))}
          {UIF.getRow(labels)}
          {gradient}
          {UIF.getRow(buttons)}
        </View>
      )
    } catch (suppressedError) {}

    return questionWidget
  }
}


const MAX_LEN_FOR_ROW_LAYOUT = 9    // characters

class ChoiceQuestion extends QuestionComponent {
  constructor(props) {
    super(props)

    this.useRowLayout = (this.questionData.choices.length <= 3)
    for (const choice of this.questionData.choices) {
      if (choice.value.length > MAX_LEN_FOR_ROW_LAYOUT) {
        this.useRowLayout = false
      }
    }

    this.selectionTrackingDict = props.hasOwnProperty('selectionTrackingDict') ?
      props.selectionTrackingDict : undefined
  }

  handleChoiceQuestionSelectionChange = (aQuestionId, aValue) => {
    console.log(`handleChoiceQuestionSelectionChange: ${aQuestionId} = ${aValue}`)

    if (!this.questionData.multipleResponses) {
      this.handleSelectionChange(aQuestionId, aValue)
      return
    } // else ... :

    if (aQuestionId === this.questionData.id) {
      // Multiple response handler:
      // If the value is in the response array, remove it, otherwise add it.
      if (this.questionData.response.includes(aValue)) {
        for (let index = 0; index < this.questionData.response.length; index++) {
          if (this.questionData.response[index] === aValue) {
            this.questionData.response.splice(index, 1)
            break;
          }
        }
      } else {
        this.questionData.response.push(aValue)
      }

      if (this.hasOwnProperty('selectionHandlerFn') && this.selectionHandlerFn) {
        this.selectionHandlerFn(aQuestionId, aValue)
      }

      // splice to create new array and force re-render
      this.setState({response: [...this.questionData.response]})
    }
  }

  render() {
    let questionWidget = undefined

    try {
      const id = this.questionData.id

      let index = 1   // index starts counting at 1 for all question types/responses.
      const buttons = []
      for (const choice of this.questionData.choices) {
        let buttonColor = undefined

        // multipleResponses behavior takes precedence over selectionTrackingDict
        if (this.questionData.multipleResponses) {
          if (this.state.response.includes(index)) {
            buttonColor = '#d9d9d9'
          }
        } else if (this.selectionTrackingDict !== undefined) {
          if (index in this.selectionTrackingDict) {
            buttonColor = '#d9d9d9'
          }
        } else if (index === this.state.response) {
          buttonColor = '#d9d9d9' // 85% gray
        }

        buttons.push(UIF.getQuestionButton(choice.value, id, index, this.handleChoiceQuestionSelectionChange, choice.color, buttonColor))
        index++
      }

      const buttonContainer = (this.useRowLayout) ?
        UIF.getRow(buttons) : UIF.getColumn(buttons)

      let questionText = (this.questionData.question) ?
        UIF.getRow(UIF.getText(this.questionData.question)) : undefined

      questionWidget = (
        <View key={UIF.getUniqueKey()} style={UIF.styles.questionViewContainer}>
          {questionText}
          {buttonContainer}
        </View>
      )
    } catch (suppressedError) {}

    return questionWidget
  }
}

class TextQuestion extends QuestionComponent {
  constructor(props) {
    super(props)

    // TODO: may need to set this / pass it in on re-entry.
    this.initialValue = undefined
  }

  handleTextChange = (theText, theQuestionId) => {
    this.handleValueChange(theQuestionId, theText, false)
  }

  render() {
    let questionWidget = undefined

    try {
      const id = this.questionData.id

      questionWidget = (
        <View key={UIF.getUniqueKey()} style={UIF.styles.questionViewContainer}>
          {UIF.getRow(UIF.getText(this.questionData.question))}
          {UIF.getTextInput('Your answer ...', id, this.handleTextChange, this.initialValue)}
        </View>
      )
    } catch (suppressedError) {}

    return questionWidget
  }
}

class ValueQuestion extends QuestionComponent {
  constructor(props) {
    super(props)

    // TODO: may need to set this / pass it in on re-entry.
    // TODO: only allow numerical values. Do a parse validation etc.
    this.initialValue = undefined
  }

  handleTextChange = (theText, theQuestionId) => {
    this.handleValueChange(theQuestionId, theText, false)
  }

  render() {
    let questionWidget = undefined

    try {
      const id = this.questionData.id

      questionWidget = (
        <View key={UIF.getUniqueKey()} style={UIF.styles.questionViewContainer}>
          {UIF.getRow(UIF.getText(this.questionData.question))}
          {UIF.getTextInput('An amount...', id, this.handleTextChange, this.initialValue)}
        </View>
      )
    } catch (suppressedError) {}

    return questionWidget
  }
}

module.exports = { RangeQuestion, ChoiceQuestion, TextQuestion, ValueQuestion }
