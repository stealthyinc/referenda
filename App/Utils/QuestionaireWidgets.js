import React, { Component } from 'react'
import { Text,
         View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';

const UIF = require('./UIFactory.js')


class RangeQuestion extends Component {
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

  render() {
    const buttonBar = []
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
          buttons.push(UIF.getQuestionButton(index, id, index, this.handleSelectionChange, 'green', '#d3f8d3' /* 90% green */))
        } else {
          buttons.push(UIF.getQuestionButton(index, id, index, this.handleSelectionChange))
        }
      }

      questionWidget = (
        <View key={UIF.getUniqueKey()} style={{marginTop:10, borderColor:'lightgray', borderStyle:'solid', borderWidth:1, borderRadius:5, padding:4}}>
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

class ChoiceQuestion extends Component {
  constructor(props) {
    super(props)

    // TODO: these are common to all of these, probably move them to a superclass
    this.questionData = props.questionData
    this.selectionHandlerFn =
      (props.hasOwnProperty('selectionHandlerFn') &&
       props.selectionHandlerFn) ? props.selectionHandlerFn : undefined

    this.useRowLayout = (this.questionData.choices.length <= 3)
    for (const choice of this.questionData.choices) {
      if (choice.value.length > MAX_LEN_FOR_ROW_LAYOUT) {
        this.useRowLayout = false
      }
    }

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

  render() {
    const buttonBar = []
    let questionWidget = undefined

    try {
      const id = this.questionData.id

      let index = 1   // index starts counting at 1 for all question types/responses.
      const buttons = []
      for (const choice of this.questionData.choices) {
        if (index === this.state.response) {
          buttons.push(UIF.getQuestionButton(choice.value, id, index, this.handleSelectionChange, 'green', '#d3f8d3' /* 90% green */))
        } else {
          buttons.push(UIF.getQuestionButton(choice.value, id, index, this.handleSelectionChange, choice.color))
        }
        index++
      }

      const buttonContainer = (this.useRowLayout) ?
        UIF.getRow(buttons) : UIF.getColumn(buttons)

      questionWidget = (
        <View key={UIF.getUniqueKey()} style={{marginTop:10, borderColor:'lightgray', borderStyle:'solid', borderWidth:1, borderRadius:5, padding:4}}>
          {UIF.getRow(UIF.getText(this.questionData.question))}
          {buttonContainer}
        </View>
      )
    } catch (suppressedError) {}

    return questionWidget
  }
}

module.exports = { RangeQuestion, ChoiceQuestion }
