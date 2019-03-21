import { call, put, fork, take, takeLatest } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'
import PinataActions, { PinataSelectors, PinataTypes } from '../Redux/PinataRedux'
import Config from 'react-native-config'
const axios = require('axios')
// const fs = require('fs')
const FormData = require('form-data')

const postAxios = (url, data, headers) => {
  return axios.post(
    url,
    data,
    {
      headers
    }
  ).then(function (response) {
    console.log('IPFS response', response)
  })
  .catch(function (error) {
    console.log('IPFS error', error)
  })
}

function* pinJSONToIPFS (action) {
  console.log("PINATA")
  const { json } = action
  console.log("JSON", json)
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`
  const headers = {
    'pinata_api_key': Config.PINATA_API_KEY,
    'pinata_secret_api_key': Config.PINATA_API_SECRET
  }
  const { response } = yield call(postAxios, url, json, headers)
  if (response)
    yield put(PinataActions.pinataSuccess(response))
  else
    yield put(PinataActions.pinataFailure())
}

// function* pinFileToIPFS (action) {
//   const { file } = action
//   const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`
//   //we gather a local file from the API for this example, but you can gather the file from anywhere
//   let data = new FormData()
//   data.append('file', fs.createReadStream(file))
//   //You'll need to make sure that the metadata is in the form of a JSON object that's been convered to a string
//   const metadata = JSON.stringify({
//     name: 'testname',
//     keyvalues: {
//       exampleKey: 'exampleValue'
//     }
//   })
//   data.append('pinataMetadata', metadata)
//   const headers = {
//     'Content-Type': `multipart/form-data; boundary= ${data._boundary}`,
//     'pinata_api_key': Config.PINATA_API_KEY,
//     'pinata_secret_api_key': Config.PINATA_API_SECRET
//   }
//   const { response } = yield call(postAxios, url, data, headers)
//   if (response)
//     yield put(PinataActions.pinataSuccess(response))
//   else
//     yield put(PinataActions.pinataFailure())
// };

function* removePinFromIPFS (action) {
  const { pin } = action
  const url = `https://api.pinata.cloud/pinning/removePinFromIPFS`
  const body = {
    ipfs_pin_hash: pin
  }
  const headers = {
    'pinata_api_key': Config.PINATA_API_KEY,
    'pinata_secret_api_key': Config.PINATA_API_SECRET
  }
  const { response } = yield call(postAxios, url, body, headers)
  if (response)
    yield put(PinataActions.pinataSuccess(response))
  else
    yield put(PinataActions.pinataFailure())
}

export function* startPinata (action) {
  console.log('PINATAS!')
  yield takeLatest(PinataTypes.PINATA_ADD_JSON, pinJSONToIPFS)
  // yield takeLatest(PinataTypes.PINATA_ADD_FILE, pinFileToIPFS)
  yield takeLatest(PinataTypes.PINATA_REMOVE, removePinFromIPFS)
}