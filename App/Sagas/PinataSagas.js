import { call, put, fork, take, takeLatest } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'
import PinataActions, { PinataSelectors, PinataTypes } from '../Redux/PinataRedux'
import Config from 'react-native-config'
const axios = require('axios')
// const fs = require('fs')
// const FormData = require('form-data')

const postAxios = (url, data, headers) => {
  return axios.post(
    url,
    data,
    {
      headers
    }
  ).then(response => {
    console.log('IPFS response', response)
    return response
  })
  .catch(error => {
    console.log('IPFS error', error)
  })
}

function* pinJSONToIPFS (action) {
  const { json } = action
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`
  const headers = {
    'pinata_api_key': Config.PINATA_API_KEY,
    'pinata_secret_api_key': Config.PINATA_API_SECRET
  }
  try {
    const response = yield call(postAxios, url, json, headers)
    if (response)
      yield put(PinataActions.pinataSuccess(response))
  }
  catch (error) {
    yield put(PinataActions.pinataFailure())
  }
}

function* pinFileToIPFS (action) {
  const { file } = action
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`
  //You'll need to make sure that the metadata is in the form of a JSON object that's been convered to a string
  const metadata = JSON.stringify({
    name: 'testname',
    keyvalues: {
      exampleKey: 'exampleValue'
    }
  })
  const data = new FormData();
  data.append('photo', {
    uri: file,
    type: 'image/png', // or photo.type
  });
  data.append('pinataMetadata', metadata)
  const headers = {
    'Content-Type': `multipart/form-data; boundary= ${data._boundary}`,
    'pinata_api_key': Config.PINATA_API_KEY,
    'pinata_secret_api_key': Config.PINATA_API_SECRET
  }
  try {
    const response = yield call(postAxios, url, data, headers)
    console.log('IPFS response', response)
    if (response)
      yield put(PinataActions.pinataSuccess(response))
  }
  catch (error) {
    yield put(PinataActions.pinataFailure())
  }
};

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
  try {
    const response = yield call(postAxios, url, body, headers)
    if (response)
      yield put(PinataActions.pinataSuccess(response))
  }
  catch (error) {
    yield put(PinataActions.pinataFailure())
  }
}

export function* startPinata (action) {
  yield takeLatest(PinataTypes.PINATA_ADD_JSON, pinJSONToIPFS)
  yield takeLatest(PinataTypes.PINATA_ADD_FILE, pinFileToIPFS)
  yield takeLatest(PinataTypes.PINATA_REMOVE_PIN, removePinFromIPFS)
}