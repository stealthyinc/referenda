import Config from 'react-native-config'
import bip39 from 'react-native-bip39'

class Bip39 {
  static generateMnemonic = async () => {
    try {
      return await bip39.generateMnemonic(128) // default to 128
    } catch(e) {
      return false
    }
  }
}

module.exports = { Bip39 }