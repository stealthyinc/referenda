// a library to wrap and simplify api calls
import apisauce from 'apisauce'
import Config from 'react-native-config'

const squareService = (data) => {
  const baseURL = Config.SQUARE_URL
  console.log("baseURL", baseURL)
  const api = apisauce.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      "Accept": "application/json"
    },
    data,
    timeout: 10000
  })
  const charge = () => api.post('/createCharge')
  const invoice = () => api.post('/createCheckout')
  return {
    charge,
    invoice
  }
}

export default {
  squareService
}