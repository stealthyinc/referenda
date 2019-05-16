import RNAmplitude from 'react-native-amplitude-analytics';
import Config from 'react-native-config'
import * as Keychain from 'react-native-keychain';

class Anonalytics {
  constructor () {
    const amplitudeKey = (process.env.NODE_ENV === 'production') ? Config.AMPLITUDE_PRODUCTION_API : Config.AMPLITUDE_SANDBOX_API
    this.amplitude = new RNAmplitude(amplitudeKey);
    this.publicKey = 'USER_NOT_LOGGED_IN'
  }

  setCredentials(publicKey) {
    this.publicKey = publicKey
  }

  aeEnable = () => {
    this.amplitude.setOptOut(false);
  }

  aeDisable = () => {
    this.amplitude.setOptOut(true);
  }

  // Proper ID Application Page Events:
  //
  aeLogin() {
    this._storeEvent('loginOccured')
  }

  aePlatformDescription(aPlatformDescription) {
    if (aPlatformDescription !== undefined) {
      this._storeEvent('platformDescription', aPlatformDescription)
    }
  }

  aeLoginContext(aContext) {
    if (aContext !== undefined) {
      this._storeEvent('loginContext', aContext)
    }
  }

  aeStoreEvent(eventName, information) {
    this._storeEvent(eventName, information)
  }

  // Private:
  // ////////////////////////////////////////////////////////////////////////////
  _storeEvent (anEventName, aString = undefined) {
    try {
      if (anEventName && this.publicKey) {
        // const eventTimeMs = Date.now()
        const AWS_LIMIT = 1000
        const d = new Date()
        const dateStamp = d.toDateString()
        this.amplitude.setUserId(this.publicKey)
        if (aString) {
          let awsCleanString = (aString.length >= AWS_LIMIT)
            ? aString.substring(0, AWS_LIMIT - 2)
            : aString
          this.amplitude.logEvent(anEventName, {attributes: {data: awsCleanString, id: this.publicKey, dateStamp}})
        } else {
          this.amplitude.logEvent(anEventName, {attributes: {id: this.publicKey, dateStamp}})
        }
      }
    } catch (error) {
      // const eventTimeMs = Date.now()
      this.amplitude.logEvent('error', error)
    }
  }
}

export var Analytics = new Anonalytics()