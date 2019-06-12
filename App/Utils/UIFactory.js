import React from 'react'
import {
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View } from 'react-native'
import {
  Colors,
  Fonts,
  Metrics } from '../Themes/'
import {
  FontAwesome } from '../Assets/icons';
// RkText to display icons easily. (Could also switch to Oblador's FontAwesome RN component if removeing rk)
import {
  RkText} from 'react-native-ui-kitten';

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
  theTextChangeHandlerFun) =>
{
  return (
    <TextInput
      key={getUniqueKey()}
      style={styles.textInput}
      placeholder={thePlaceHolderText}
      placeholderTextColor={Colors.lightText}
      onChangeText={(theText) => theTextChangeHandlerFun(theText, thePropertyName)}/>
  )
}

export const getButtonBar = (theButtons) {
  return (
    <View key={getUniqueKey()} style={styles.buttonOuterContainer}>
      {theButtons}
    </View>
  )
}
// Supports FontAwesome icons.
// Set text or icon to undefined to exclude one or the other.
//
export const getButton = (
  theButtonText=undefined,
  theButtonIcon=undefined,
  theClickHandlerFn=() => {}) =>
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
        <TouchableOpacity style={{
            flexDirection:'row',
            borderStyle:'solid',
            borderWidth:2,
            borderRadius:15,
            borderColor:Colors.facebook,
            alignItems:'center',
            paddingHorizontal:10,
            paddingVertical:5}}>
          {uiElements}
        </TouchableOpacity>
      </View>
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

export const getContainer = (theViewElements) =>
{
  return (
    <ScrollView key={getUniqueKey()} style={styles.container}>
      {theViewElements}
    </ScrollView>
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

  },
  container: {
    flex: 1,
    marginHorizontal: Metrics.marginHorizontal,
    marginVertical: Metrics.marginVertical,
    backgroundColor: Colors.background
  }
})
