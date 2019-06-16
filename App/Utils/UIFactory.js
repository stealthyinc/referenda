import React from 'react'
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
import { RkText } from 'react-native-ui-kitten';  // RkText to display icons easily. (Could also switch to Oblador's FontAwesome RN component if removeing rk)
import LinearGradient from 'react-native-linear-gradient';

let key = 0
function getUniqueKey()
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

export const getText = (theText) =>
{
  return (
    <Text key={getUniqueKey()} style={styles.text}>{theText}</Text>
  )
}

export const getTextInput = (
  thePlaceHolderText,
  thePropertyName,
  theTextChangeHandlerFun,
  theInitialValue=undefined) =>
{
  return (
    <TextInput
      key={getUniqueKey()}
      style={styles.textInput}
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
  theButtonColor='black') =>
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

  return (
      <View key={getUniqueKey()} style={styles.buttonOuterContainer}>
        <TouchableOpacity
          onPress={() => theClickHandlerFn()}
          style={{color:theButtonColor, ...styles.buttonInnerContainer}}>
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
  theBorderColor='black') =>
{
  return (
    <View key={getUniqueKey()} style={styles.listButtonOuterContainer}>
      <TouchableOpacity
        onPress={() => theSelectHandlerFn(theIndex)}
        style={{
          borderColor:theBorderColor,
          backgroundColor:theButtonColor,
          ...styles.listButtonInnerContainer}}>
        <Text style={styles.text}>
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

export const getRow = (theRowElements) => {
  return (
    <View key={getUniqueKey()} style={styles.row}>
      {theRowElements}
    </View>
  )
}

export const getRangeQuestion = (
  theQuestionData,
  theSelection,
  theSelectionHandlerFn=() => {} ) =>
{
  const buttonBar = []
  let questionWidget = undefined

  try {
    const labels = []
    const gradientColors = []

    for (const property of ['min', 'middle', 'max']) {
      if (theQuestionData.hasOwnProperty(property)) {
        const qProperty = theQuestionData[property]
        if (qProperty.hasOwnProperty('label')) {
          labels.push(
            <Text key={getUniqueKey()} style={styles.descriptionText}>
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

    const id = theQuestionData.id

    const buttons = []
    for (let index = 1; index <= theQuestionData.steps; index++) {
      if (index === theSelection) {
        buttons.push(getQuestionButton(index, id, index, theSelectionHandlerFn, 'green', '#d3f8d3' /* 90% green */))
      } else {
        buttons.push(getQuestionButton(index, id, index, theSelectionHandlerFn))
      }
    }

    questionWidget = (
      <View key={getUniqueKey()} style={{marginTop:10, borderColor:'lightgray', borderStyle:'solid', borderWidth:1, borderRadius:5, padding:4}}>
        {getRow(getText(theQuestionData.question))}
        {getRow(labels)}
        {gradient}
        {getRow(buttons)}
      </View>
    )
  } catch (suppressedError) {}

  return questionWidget
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
    borderRadius:15,
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
    borderStyle:'solid',
    marginTop: 5,
    borderWidth:1,
    borderRadius:10,
    paddingHorizontal:10,
    paddingVertical:5
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
    paddingVertical:10
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
  modalContainer: {
    height:'100%',
    backgroundColor:'rgba(255,255,255,0.85)',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    marginHorizontal: Metrics.marginHorizontal,
    marginVertical: Metrics.marginVertical,
  },
  container: {
    flex: 1,
    marginHorizontal: Metrics.marginHorizontal,
    marginVertical: Metrics.marginVertical,
    backgroundColor: Colors.background
  }
})
