import React, { Component } from 'react'
import '../styles/Square.css'
import PaymentForm from '../components/PaymentForm'

export default class Square extends Component {
  constructor(props){
    super(props)
    this.state = {
      loaded: false
    }
  }
  componentWillMount(){
    const that = this
    let sqPaymentScript = document.createElement('script')
    sqPaymentScript.src = "https://js.squareup.com/v2/paymentform"
    sqPaymentScript.type = "text/javascript"
    sqPaymentScript.async = false
    sqPaymentScript.onload = ()=>{that.setState({
      loaded: true
    })}
    document.getElementsByTagName("head")[0].appendChild(sqPaymentScript)
  }
  render() {
    {/*<Button
      onPress={() => this.props.navigation.goBack()}
      title="Dismiss"
    />*/}
    return (
      this.state.loaded &&
        <PaymentForm
          paymentForm={ window.SqPaymentForm }
        />
    )
  }
}