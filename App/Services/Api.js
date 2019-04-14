// a library to wrap and simplify api calls
import apisauce from 'apisauce'
import Config from 'react-native-config'

const squareCharge = (baseURL, data) => {
  const ACCESS_TOKEN = (process.env.NODE_ENV === 'production') ? Config.SQUARE_PRODUCTION_ACCESS_TOKEN : Config.SQUARE_SANDBOX_ACCESS_TOKEN
  const api = apisauce.create({
    // base URL is read from the "constructor"
    baseURL,
    // here are some default headers
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${ACCESS_TOKEN}`,
      "Accept": "application/json"
    },
    data,
    // 10 second timeout...
    timeout: 10000
  })
  const charge = () => api.post()
  return {
    // a list of the API functions from step 2
    charge
  }
}

const squareInvoice = (baseURL, data) => {
  const ACCESS_TOKEN = (process.env.NODE_ENV === 'production') ? Config.SQUARE_PRODUCTION_ACCESS_TOKEN : Config.SQUARE_SANDBOX_ACCESS_TOKEN
  const api = apisauce.create({
    // base URL is read from the "constructor"
    baseURL,
    // here are some default headers
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${ACCESS_TOKEN}`,
    },
    data,
    // 10 second timeout...
    timeout: 10000
  })
  const invoice = () => api.post()
  return {
    // a list of the API functions from step 2
    invoice
  }
}

const twilio = (baseURL, number, message) => {
  const phoneNumber = (process.env.NODE_ENV === 'production') ? number : '15044606946'
  const api = apisauce.create({
    // base URL is read from the "constructor"
    baseURL,
    // here are some default headers
    headers: {
      'Content-Type': 'application/json',
      'cache-control': 'no-cache',
    },
    data: {
      to: phoneNumber,
      message
    },
    // 10 second timeout...
    timeout: 10000
  })
  const send = () => api.post()
  return {
    send
  }
}

// let's return back our create method as the default.
export default {
  squareCharge,
  squareInvoice,
  twilio
}
