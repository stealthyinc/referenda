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
   * @param aUserId
   */
  async write(aFileName, theData, aUserId=undefined) {
    try {
      const keyPath = LocalStore._getKeyPath(aFileName, aUserId)
      await AsyncStorage.setItem(keyPath, theData)
    } catch (error) {
      // TODO:
    } finally {
    }
  }

  /**
   * @param aFileName
   * @param aUserId
   * @return
   */
  async read(aFileName, aUserId=undefined) {
    let theData = undefined
    try {
      const keyPath = LocalStore._getKeyPath(aFileName, aUserId)
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
   * @param aUserId
   */
  async deleteLocalFile(aFileName, aUserId=undefined) {
    try {
      const keyPath = LocalStore._getKeyPath(aFileName, aUserId)
      await AsyncStorage.removeItem(keyPath)
    } catch (error) {
      // TODO:
    } finally {
    }
  }

  /**
   * @param aFileName
   * @param aUserId
   */
  static _getKeyPath(aFileName, aUserId=undefined) {
    return (aUserId) ?
      `${asyncStorageRoot}:${aUserId}:${aFileName}` :
      `${asyncStorageRoot}:${aFileName}`
  }
}

module.exports = { LocalStore }
