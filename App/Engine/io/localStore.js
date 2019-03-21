import {AsyncStorage} from 'react-native'

const asyncStorageRoot = '@ReferendaDeviceStorage'

/** LocalStore - An abstraction for reading and writing to local storage on
 * the device that Referenda is operating on.
 *
 * Presently it wraps React Native's AsyncStorage and provides a specific root
 * key under which file paths are converted to keys for storing data. The root
 * key also takes into account different user's ids--i.e. if you log in as user1
 * and write a file, you then log out and log in as user2, you would have
 * problems decrypting and over-writing user1's local storage. We key around that
 * with unique paths for each local user.
 *
 * @author Stealthy Inc.
 * @version 1.0
 *
 * @flow
 *
 * TODO: Introduce optional encryption / decryption of files written / read.
 *
 */
class LocalStore {
  /**
   * @param aFileName
   * @param theData
   * @param aUserName
   */
  async write(aFileName, theData, aUserName=undefined) {
    try {
      const keyPath = LocalStore._getKeyPath(aFileName, aUserName)
      await AsyncStorage.setItem(keyPath, theData)
    } catch (error) {
      // TODO:
    } finally {
    }
  }

  /**
   * @param aFileName
   * @param aUserName
   * @return
   */
  async read(aFileName, aUserName=undefined) {
    let theData = undefined
    try {
      const keyPath = LocalStore._getKeyPath(aFileName, aUserName)
      // Returns 'null' on iOS (possibly Android too) if no file.
      theData = await AsyncStorage.getItem(keyPath)
    } catch (error) {
      // TODO:
    } finally {
      return theData
    }
  }

  /**
   * @param aFileName
   * @param aUserName
   */
  async deleteLocalFile(aFileName, aUserName=undefined) {
    try {
      const keyPath = LocalStore._getKeyPath(aFileName, aUserName)
      await AsyncStorage.removeItem(keyPath)
    } catch (error) {
      // TODO:
    } finally {
    }
  }

  _getKeyPath(aFileName, aUserName=undefined) {
    return (aUserName) ?
      `${asyncStorageRoot}:${aUserName}:${aFileName}` :
      `${asyncStorageRoot}:${aFileName}`
  }
}

module.exports = { LocalStore }
