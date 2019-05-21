import React, { Component } from 'react'
import '../styles/Square.css'
import PaymentForm from '../components/PaymentForm'
import {
  Card,
  CardItem,
  H2,
} from "native-base";

export default class Square extends Component {
  constructor(props){
    super(props)
    this.state = {
      loaded: false
    }
  }
  componentWillMount(){
    const that = this
    let basicPaymentScript = document.createElement('script')
    basicPaymentScript.src = "./sqpaymentform-basic.js"
    basicPaymentScript.type = "text/javascript"
    basicPaymentScript.async = false
    let basicPaymentCss = document.createElement('script')
    basicPaymentCss.src = "./sqpaymentform-basic.css"
    basicPaymentCss.type = "stylesheet"
    basicPaymentCss.async = false
    let sqPaymentScript = document.createElement('script')
    sqPaymentScript.src = "https://js.squareup.com/v2/paymentform"
    sqPaymentScript.type = "text/javascript"
    sqPaymentScript.async = false
    sqPaymentScript.onload = ()=>{that.setState({
      loaded: true
    })}
    document.getElementsByTagName("head")[0].appendChild(sqPaymentScript)
    document.getElementsByTagName("head")[0].appendChild(basicPaymentScript)
    document.getElementsByTagName("head")[0].appendChild(basicPaymentCss)
  }
  render() {
    return (
      this.state.loaded && (
        <Card style={{marginBottom: 15}}>
          <CardItem header bordered>
            <H2>Campaign Donations</H2>
          </CardItem>
          <CardItem>
            <PaymentForm
              paymentForm={ window.SqPaymentForm }
            />
          </CardItem>
        </Card>
      )
    )
  }
}