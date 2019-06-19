import React, { Component } from 'react'
import { ActivityIndicator,
         Modal,
         ScrollView,
         StyleSheet,
         Text,
         TextInput,
         TouchableOpacity,
         View } from 'react-native'
import { Colors, Fonts, Metrics } from '../Themes/'
import { FontAwesome } from '../Assets/icons';

import {
  RkAvoidKeyboard,
  RkText } from 'react-native-ui-kitten';  // RkText to display icons easily. (Could also switch to Oblador's FontAwesome RN component if removeing rk)

let key = 0
export function getUniqueKey()
{
  return key++
}

const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']

export const getHeading = (theHeading, headingStyle='h1') =>
{
  const headingStyles = Object.keys(Fonts.style)
  if (!headingStyles.includes(headingStyle)) {
    throw `getHeading called with unsupported headingStyle ${headingStyle}. Supported headingStyles: ${headingStyles.join()}`
  }

  // headingStyle must be one of the styles from Fonts.js:
  //
  const style = {
    ...styles.heading,
    ... Fonts.style[headingStyle]
  }

  return (
    <Text
      key={getUniqueKey()}
      style={style}>
      {theHeading}
    </Text> )
}

export const getText = (theText, style=styles.text) =>
{
  return (
    <Text key={getUniqueKey()} style={style}>{theText}</Text>
  )
}

export const getTextInput = (
  thePlaceHolderText,
  thePropertyName,
  theTextChangeHandlerFun,
  theInitialValue=undefined,
  styleModifer={}) =>
{
  let textInputStyle = styles.textInput
  if (styleModifer) {
    textInputStyle = {...styles.textInput, ...styleModifer}
  }

  return (
    <TextInput
      key={getUniqueKey()}
      style={textInputStyle}
      placeholder={thePlaceHolderText}
      placeholderTextColor={Colors.lightText}
      defaultValue={theInitialValue}
      onChangeText={(theText) => theTextChangeHandlerFun(theText, thePropertyName)}/>
  )
}

// Supports FontAwesome icons.
// Set text or icon to undefined to exclude one or the other.
//
export const getButton = (
  theButtonText=undefined,
  theButtonIcon=undefined,
  theClickHandlerFn=() => {},
  theButtonColor='black',
  hasBorder=true,
  hasPadding=true) =>
{
  const uiElements = []
  if (theButtonIcon) {
    uiElements.push(
      <RkText
        key={getUniqueKey()}
        rkType='awesome'
        style={styles.icon}>
        {theButtonIcon}
      </RkText>
    )
  }
  if (theButtonIcon && theButtonText) {
    uiElements.push(getHorizontalSpacer())
  }
  if (theButtonText) {
    uiElements.push(
      <Text
        key={getUniqueKey()}
        style={styles.text}>
        {theButtonText}
      </Text>
    )
  }

  let buttonStyle = (hasBorder) ?
    styles.buttonInnerContainer :
    {...styles.buttonInnerContainer, borderWidth:0}

  buttonStyle = (hasPadding) ?
    buttonStyle : {...buttonStyle, paddingVertical:0}

  return (
      <View key={getUniqueKey()} style={styles.buttonOuterContainer}>
        <TouchableOpacity
          onPress={() => theClickHandlerFn()}
          style={{color:theButtonColor, ...buttonStyle}}>
          {uiElements}
        </TouchableOpacity>
      </View>
  )
}

export const getListButton = (
  theEmphasisButtonText,
  theDescriptionButtonText,
  theIndex,
  theSelectHandlerFn,
  theButtonColor='black',
  theBorderColor=Colors.listBottomBorderColor) =>
{
  return (
    <View key={getUniqueKey()} style={styles.listButtonOuterContainer}>
      <TouchableOpacity
        onPress={() => theSelectHandlerFn(theIndex)}
        style={{
          borderColor:theBorderColor,
          backgroundColor:theButtonColor,
          ...styles.listButtonInnerContainer}}>
        <Text style={{...styles.text, color:Colors.listEmphasisText}}>
          {theEmphasisButtonText}
        </Text>
        <Text style={styles.descriptionText}>
          {theDescriptionButtonText}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export const getQuestionButton = (
  theButtonText=undefined,
  theQuestionId=undefined,
  thisButtonValue=undefined,
  theClickHandlerFn=() => {},
  theButtonColor='gray',
  theSelectionColor='undefined') =>
{
  return (
      <View key={getUniqueKey()} style={styles.questionButtonOuterContainer}>
        <TouchableOpacity
          onPress={() => theClickHandlerFn(theQuestionId, thisButtonValue)}
          style={{backgroundColor:theSelectionColor, borderColor:theButtonColor, ...styles.questionButtonInnerContainer}}>
          <Text
            key={getUniqueKey()}
            style={styles.descriptionText}>
            {theButtonText}
          </Text>
        </TouchableOpacity>
      </View>
  )
}

export const getActivityIndicator = (
  theActivityMessage=undefined,
  theCloseHandlerFn=() => {}) => {
  return (
    <Modal
      key={getUniqueKey()}
      animationType="fade"
      transparent={true}
      visible={true}
      onRequestClose={() => theCloseHandlerFn()}>
      <View style={styles.ActivityIndicatorModal}>
        <ActivityIndicator size="large"/>
        {getVerticalSpacer()}
        <Text style={styles.text}>{theActivityMessage}</Text>
      </View>
    </Modal>
  )
}

export const getOptionsModal = (
  theOptionsElements,
  theCloseHandlerFn=() => {}) =>
{
  return (
    <Modal
      key={getUniqueKey()}
      animationType="fade"
      transparent={true}
      visible={true}
      onRequestClose={() => theCloseHandlerFn()}>
      <View style={styles.modalContainer}>
        {theOptionsElements}
      </View>
    </Modal>
  )
}

export const getVerticalSpacer = (theDimension=Metrics.baseMargin) =>
{
  return (
    <View key={getUniqueKey()} style={{height:theDimension}} />
  )
}

export const getHorizontalSpacer = (theDimension=Metrics.baseMargin) =>
{
  return (
    <View key={getUniqueKey()} style={{width:theDimension}} />
  )
}

export const getRow = (theElements, paddingHorizontal=0) => {
  const rowStyle = { ...styles.row, paddingHorizontal:paddingHorizontal }
  return (
    <View key={getUniqueKey()} style={rowStyle}>
      {theElements}
    </View>
  )
}

export const getKeyValueTextRow = (
  theKey,
  theValue,
  options={}) =>
{
  const fnOptions = {
    theKeyTextStyle: styles.descriptionText,
    theValueTextStyle: styles.text,
    ...options
  }

  const rowElements = []
  rowElements.push(getText(theKey, fnOptions.theKeyTextStyle))
  rowElements.push(getText(theValue, fnOptions.theValueTextStyle))

  return getRow(rowElements)
}

export const getKeyValueTextInputRow = (
  theKey,
  theTextInputInitialValue,
  options={}) =>
{
  const fnOptions = {
    theKeyTextStyle: styles.descriptionText,
    theTextInputPlaceHolderText: theKey,
    theTextInputPropertyName: undefined,
    theTextInputChangeHandlerFn: () => {},
    theTextInputStyle: {
      width:'auto',
      marginTop:0,
      marginBottom:0,
      textAlign:'right'
    },
    ...options
  }

  const rowElements = []
  rowElements.push(getText(theKey, fnOptions.theKeyTextStyle))
  rowElements.push(getTextInput(
    fnOptions.theTextInputPlaceHolderText,
    fnOptions.theTextInputPropertyName,
    fnOptions.theTextInputChangeHandlerFn,
    theTextInputInitialValue,
    fnOptions.theTextInputStyle))

  return getRow(rowElements)
}

export const getKeyButtonsRow = (theKey, theButtons, options={}) =>
{
  const fnOptions = {
    theKeyTextStyle: styles.descriptionText,
    theValueTextStyle: styles.text,
    ...options
  }

  const rowElements = []
  rowElements.push(getText(theKey, fnOptions.theKeyTextStyle))
  rowElements.push(
    <View style={{flexDirection:'row'}}>
      {theButtons}
    </View>
  )

  return getRow(rowElements)
}

export const getColumn = (theElements) => {
  return (
    <View key={getUniqueKey()} style={styles.column}>
      {theElements}
    </View>
  )
}

class FoldingSection extends Component {
  constructor(props) {
    super(props)

    this.heading = props.hasOwnProperty('heading') ? props.heading : ''
    this.elements = props.hasOwnProperty('elements') ? props.elements : ''
    this.state = {
      showElements: true
    }
  }

  handleShowElementsToggle = () => {
    this.setState({showElements: !this.state.showElements})
  }

  render() {
    const buttonIcon = (this.state.showElements) ? FontAwesome.angle_up : FontAwesome.angle_down
    const elements = (this.state.showElements) ? this.elements : undefined

    return (
      <View style={styles.questionViewContainer}>
        {getRow([getText(this.heading, {...styles.text, fontWeight: 'bold'}), getButton(undefined, buttonIcon, this.handleShowElementsToggle, 'black', false)])}
        {elements}
      </View>
    )
  }
}

export const getFoldingSection = (theSectionHeading, theElements) => {
  return (
    <FoldingSection
      key={getUniqueKey()}
      heading={theSectionHeading}
      elements={theElements} />
  )
}

export const getScrollingContainer = (theUIElements, noMargin=false) =>
{
  const containerStyle = (noMargin) ?
    { ...styles.container, marginHorizontal:0, marginVertical:0} :
    styles.container

  return (
    <ScrollView key={getUniqueKey()} style={containerStyle}>
      {theUIElements}
    </ScrollView>
  )
}

export const getContainer = (theUIElements, noMargin=false) =>
{
  const containerStyle = (noMargin) ?
    { ...styles.container, marginHorizontal:0, marginVertical:0} :
    styles.container

  return (
    <View key={getUniqueKey()} style={containerStyle}>
      {theUIElements}
    </View>
  )
}

export const styles = StyleSheet.create({
  heading: {
    marginTop: Metrics.tripleBaseMargin,
    marginBottom: Metrics.baseMargin,
    color: Colors.text
  },
  icon: {
    color: Colors.text,
    fontSize: Fonts.size.regular
  },
  text: {
    color: Colors.text,
    ... Fonts.style.normal
  },
  descriptionText: {
    color: Colors.text,
    ... Fonts.style.description
  },
  textInput: {
    marginTop: Metrics.baseMargin,
    marginBottom: Metrics.baseMargin,
    color: Colors.text,
    width:'100%',
    borderStyle:'solid',
    borderBottomColor:Colors.text,
    borderBottomWidth:1,
    ... Fonts.style.normal
  },
  buttonOuterContainer: {
    flexDirection:'row',
    justifyContent:'center'
  },
  buttonInnerContainer: {
    flexDirection:'row',
    borderStyle:'solid',
    borderWidth:2,
    borderRadius:12,
    alignItems:'center',
    paddingHorizontal:10,
    paddingVertical:5
  },
  listButtonOuterContainer: {
    flexDirection:'row',
    justifyContent:'center'
  },
  listButtonInnerContainer: {
    width: '100%',
    flexDirection:'column',
    marginTop: 5,
    borderStyle:'solid',
    borderBottomWidth:1,
    paddingVertical:5,
    paddingLeft: 15,
    paddingRight: 5
  },
  questionButtonOuterContainer: {
    flex:1,
    flexDirection:'row',
    justifyContent:'center'
  },
  questionButtonInnerContainer: {
    flex:1,
    flexDirection:'row',
    borderStyle:'solid',
    borderWidth:1,
    borderRadius:5,
    alignItems:'center',
    justifyContent:'center',
    marginHorizontal:1,
    marginVertical:1,
    paddingVertical:10
  },
  questionViewContainer: {
    marginTop:10,
    borderColor:Colors.listBottomBorderColor,
    borderBottomWidth:1,
    borderStyle:'solid',
    paddingHorizontal:5,
    paddingVertical:5,
    // borderColor:'lightgray',
    // borderStyle:'solid',
    // borderWidth:1,
    // borderRadius:5,
    // padding:4
  },
  ActivityIndicatorModal: {
    height:'100%',
    backgroundColor:'rgba(255,255,255,0.85)',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
  },
  row: {
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    paddingVertical:5
  },
  column: {
    flexDirection:'column',
    justifyContent:'space-between',
    alignItems:'center',
    paddingVertical:5
  },
  modalContainer: {
    height:'100%',
    backgroundColor:'rgba(255,255,255,0.95)',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    // marginHorizontal: Metrics.marginHorizontal,
    // marginVertical: Metrics.marginVertical,
  },
  container: {
    flex: 1,
    marginHorizontal: Metrics.marginHorizontal,
    marginVertical: Metrics.marginVertical,
    backgroundColor: Colors.background
  }
})
