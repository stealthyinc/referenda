import {BaseData} from './baseData'

/**
 * Profile - A container for user data (encryption keys, description, imageUrl etc.)
 *
 * @author Stealthy Inc.
 * @version 1.0
 *
 * @flow
 */
class Profile extends BaseData {
  constructor() {
    super()
    this.data = {
      keys: {
        identity: {
          public: '',
          private: ''
        },
        signing: {
          public: '',
          private: ''
        },
        encryption: {
          public: '',
          private: ''
        },
      },
      phoneNumber: '',
      alias: '',
      firstName: '',
      lastName: '',
      birthDate: '',
      imageUrl: '',
      description: '',
      address: {
        street1: '',
        street2: '',
        city: '',
        state: '',
        zip: ''
      },
      candidate: false,
      official: false,
    }
  }

  /**
   * @param aPhoneNumber A string representing a phone number.
   *                     Formatless--i.e. 4037469712
   */
  setPhoneNumber(aPhoneNumber) {
    this.data.phoneNumber = aPhoneNumber
    super.setModified()
  }

  /**
   * @return A string representing a phone number. Formatless--i.e. 8712312040
   */
  getPhoneNumber() {
    return this.data.phoneNumber
  }

  /**
   * @param aPublicKey   A string containing a public key for signature
   *                     verification.
   * @param aPrivateKey  A string containing a private key for identity.
   */
  setIdentityKeyPair(aPublicKey, aPrivateKey) {
    this.data.keys.identity.public = aPublicKey
    this.data.keys.identity.private = aPrivateKey
    super.setModified()
  }

  /**
   * @return  A string containing the public key used for identity (i.e. keying
   *          this user profile in local storage and encrypting the profile).
   */
  getIdentityPublicKey() {
    return this.data.keys.identity.public
  }

  /**
   * @return  A string containing the private key used for identity (i.e.
   *          decrypting the profile).
   */
  getIdentityPrivateKey() {
    return this.data.keys.identity.private
  }

  /**
   * @param aPublicKey   A string containing a public key for signature
   *                     verification.
   * @param aPrivateKey  A string containing a private key for signing.
   */
  setSigningKeyPair(aPublicKey, aPrivateKey) {
    this.data.keys.signing.public = aPublicKey
    this.data.keys.signing.private = aPrivateKey
    super.setModified()
  }

  /**
   * @return  A string containing the public key used to verify signed data.
   */
  getSigningPublicKey() {
    return this.data.keys.signing.public
  }

  /**
   * @return  A string containing the private key to sign data.
   */
  getSigningPrivateKey() {
    return this.data.keys.signing.private
  }

  /**
   * @param aPublicKey   A string containing a public key for receiving
   *                     encrypted communication and encrypting data.
   * @param aPrivateKey  A string containing a private key for decrypting
   *                     encrpted data.
   */
  setEncryptionKeyPair(aPublicKey, aPrivateKey) {
    this.data.keys.encryption.public = aPublicKey
    this.data.keys.encryption.private = aPrivateKey
    super.setModified()
  }

  /**
   * @return  A string containing the public key to encrypt data for this
   *          profile.
   */
  getEncryptionPublicKey() {
    return this.data.keys.encryption.public
  }

  /**
   * @return  A string containing the private key to decrypt data for this
   *          profile.
   */
  getEncryptionPrivateKey() {
    return this.data.keys.encryption.private
  }

  /**
   * @param  aBirthDate  A string representing a birthdate in MM/DD/YYYY format.
   */
  setBirthDate(aBirthDate) {
    this.data.birthDate = aBirthDate
    super.setModified()
  }

  /**
   * @return  A string representing a birth date in MM/DD/YYYY format.
   */
  getBirthDate() {
    return this.data.birthDate
  }

  /**
   * @param aUrl  A string linking to a profile image--should resolve to a PNG
   *              or JPEG.
   */
  setImageUrl(aUrl) {
    this.data.imageUrl = aUrl
    super.setModified()
  }

  /**
   * @return  A string containing a URL to the profile image.
   */
  getImageUrl() {
    return this.data.imageUrl
  }

  /**
   * @param anAlias  A string containing an alias (user-name) for this profile's
   *                 user.
   */
  setAlias(anAlias) {
    this.data.alias = anAlias
    super.setModified()
  }

  /**
   * @return A string contianing an alias (user-name) for this profile's user.
   */
  getAlias() {
    return this.data.alias
  }

  /**
   * @param aFirstName  A string containing the user's first name (i.e Jane)
   */
  setFirstName(aFirstName) {
    this.data.firstName = aFirstName
  }

  /**
   * @return A string containing the user's first name (i.e Jane)
   */
  getFirstName() {
    return this.data.firstName
  }

  /**
   * @param aLastName A string containing the user's last name (i.e Smith)
   */
  setLastName(aLastName) {
    this.data.lastName = aLastName
  }

  /**
   * @return A string containing the user's last name (i.e Smith)
   */
  getLastName() {
    return this.data.lastName
  }

  /**
   * @param aDescription  A string containing a description of this user.
   */
  setDescription(aDescription) {
    this.data.description = aDescription
    super.setModified()
  }

  /**
   * @return A string containing a description of this user.
   */
  getDescription() {
    return this.data.description
  }

  // TODO: getters / setters for address props

  /**
   * @param candidate  Optional boolean indicating true if this user is a political
   *                   candidate, false otherwise.
   */
  setCandidate(candidate = true) {
    this.data.candidate = candidate
  }

  /**
   * @return Boolean true if this user is a candidate, false otherwise.
   */
  isCandidate() {
    return this.data.candidate
  }

  /**
   * @param official  Optional boolean indicating true if this user is
   *                  a political official, false otherwise.
   */
  setOffical(official = true) {
    this.data.official = official
  }

  /**
   * @return Boolean true if this user is an elected official, false otherwise.
   */
  isOfficial() {
    return this.data.official
  }
}

module.exports = { Profile }
