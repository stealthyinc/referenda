import Config from 'react-native-config'
import bip39 from 'react-native-bip39'
const bitcoin = require("bitcoinjs-lib")
const IDENTITY_KEYCHAIN = 888
const BLOCKSTACK_ON_BITCOIN = 0

class Crypto {
  constructor() {
    this.generateKeys()
  }
  generateKeys() {
    bip39.generateMnemonic().then((mnemonic) => {
      const seed = bip39.mnemonicToSeed(mnemonic)
      const masterSeed = bitcoin.bip32.fromSeed(seed)
      const keys = masterSeed.deriveHardened(IDENTITY_KEYCHAIN)
      .deriveHardened(BLOCKSTACK_ON_BITCOIN)
      .deriveHardened(0)
      this.mnemonic = mnemonic
      this.publicKey = keys.publicKey.toString('hex')
      this.privateKey = `${keys.privateKey.toString('hex')}01`
      // console.log('mnemonic: ', this.mnemonic)
      // console.log('privateKey: ', this.privateKey)
      // console.log('publicKey: ', this.publicKey)
    })
  }
  getMnemonic() {
    return this.mnemonic
  }
  getPublicKey() {
    return this.publicKey
  }
  getPrivateKey() {
    return this.privateKey
  }
}

export var RefCrypto = new Crypto()