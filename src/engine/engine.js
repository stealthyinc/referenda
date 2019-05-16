import { AsyncStorage, Platform } from 'react-native'

// import crypto from 'crypto'
import {db} from './database'

import {Profile} from './data/profile'
import {LocalStore} from './io/localStore'

const { EventEmitterAdapter } = require('./platform/reactNative/eventEmitterAdapter.js')
const { firebaseInstance } = (Platform.OS === 'web') ? null : require('../utils/firebaseWrapper.js')
// const { firebaseInstance } = require('../utils/firebaseWrapper.js')

const agathaCampaignId = 'zxY123np31Pnoqfng2123'

export class ReferendaEngine extends EventEmitterAdapter {

  constructor () {
    super()

    this.localStore = new LocalStore()
    this.commandQueue = []
    this.executingCommand = false

    this.profile = undefined
  }

  /**
   * Engine commands
   *
   * These all take 'theArguments', a dictionary of key value pairs to effect
   * the desired parameter passing.
   *
   * Their name must match a value in engineCommand.js COMMAND_TYPES to be
   * called. They are called below by engineCommandExec
   *****************************************************************************
   */

  /**
   * signUp -
   *
   * @param theArguments  Expects profile object instance aProfileInstance.
   * @throws  If aProfileInstance is falsey or does not define the
   *          identity public/private key pair. (Required to read/write a
   *          profile.)
   *
   */
  async signUp(theArguments) {
    console.log(this.signUp.name)

    const {aProfileInstance} = theArguments

    // TODO: should this exit gracefully and set the command result to the UX to error?
    if (!aProfileInstance || !aProfileInstance.getIdentityPublicKey() || !aProfileInstance.getIdentityPrivateKey()) {
      throw `${this.signUp.name}: The profile and identity key pair must be defined.`
    }

    this.profile = aProfileInstance

    // const ecdh = crypto.createECDH('secp256k1')
    // // Generate and encryption key pair:
    // ecdh.generateKeys()
    // const encPrivateKey = ecdh.getPrivateKey()
    // const encPublicKey = ecdh.getPublicKey()
    // // Generate a signing key pair:
    // ecdh.generateKeys()
    // const signPrivateKey = ecdh.getPrivateKey()
    // const signPublicKey = ecdh.getPublicKey()

    // this.profile.setSigningKeyPair(signPublicKey, signPrivateKey)
    // this.profile.setEncryptionKeyPair(encPublicKey, encPrivateKey)

    // // Create the profile and persist it to local storage
    // let keySet = await SEA.pair()
    // this.profile.setSigningKeyPair(keySet.pub, keySet.priv)
    // this.profile.setEncryptionKeyPair(keySet.epub, keySet.epriv)

    // this.profile.setImageUrl('')
    // this.profile.setAlias('AC')
    // this.profile.setDescription('End of funnel operations center chief.')

    // Things that don't work that I tried:
    //
    // const signingAlgs = ['sha256', 'ecdsa-with-SHA1']
    // for (const alg of signingAlgs) {
    //   try {
    //     console.info(`trying to sign with ${alg}`)
    //     const sign = crypto.createSign(alg);
    //     sign.update('some data to sign');
    //     sign.end();
    //     const signature = sign.sign(signPrivateKey);
    //
    //     console.info(`trying to verify with ${alg}`)
    //     const verify = crypto.createVerify(alg);
    //     verify.update('some data to sign');
    //     verify.end();
    //     console.log(verify.verify(signPrivateKey, signature));
    //
    //     console.info(`succeeded sign/verify with ${alg}`)
    //     // Prints: true
    //   } catch (error) {
    //     console.error(`${alg} failed to sign/verify.\n${error}`)
    //   }
    // }
    //
    // const {ECDH} = require('crypto')
    // const derEncPublicKey = ECDH.convertKey(encPublicKey, 'secp256k1', 'hex', 'der', 'uncompressed')
    // const publicKeyObj = crypto.createPublicKey(encPublicKey)
    // const encSerializedProfile = crypto.publicEncrypt(encPublicKey, serializedProfile)
    // const decSerializedProfile = crypto.privateDecrypt(encPrivateKey, encSerializedProfile)

    // TODO: encryption etc. (when integration with keychain)
    const serializedProfile = this.profile.serializeToString()
    await this.localStore.write('profile.enc.json', serializedProfile, this.profile.getIdentityPublicKey())
    this.profile.clearModified()
  }

  /**
   * signIn - Reads and decrypts the user's profile from local storage with the
   *         provided aPrivateIdentityKey in the arguments. If the profile
   *         for this user cannot be found, a profile is created and written
   *         to local storage for the user.
   *
   * @param theArguments  Expects strings aPublicIdentityKey
   *                      and aPrivateIdentityKey.
   * @throws  If a aPublicIdentityKey is falsey. (It's required to read or
   *          write a profile.)
   *
   * TODO: verify the profile contains aPrivateIdentityKey (otherwise an
   *       error has occured).
   * TODO: can this be defined using the COMMAND_TYPES constant, i.e.:
   *       EngineCommand.COMMAND_TYPES.SIGN_IN = (blah...) => {}
   */
  async signIn(theArguments) {
    console.log(this.signIn.name)

    const {aPublicIdentityKey, aPrivateIdentityKey} = theArguments

    // TODO: should this exit gracefully and set the command result to the UX to error?
    if (!aPublicIdentityKey || !aPrivateIdentityKey) {
      throw `${this.signIn.name}: aPublicIdentityKey and aPrivateIdentityKey must be defined.`
    }

    const serEncProfileData = await this.localStore.read('profile.enc.json', aPublicIdentityKey)
    if (serEncProfileData) {
      // Restore the profile data from local storage
      const serProfileData = serEncProfileData  // TODO: decrypt with aPrivateIdentityKey
      this.profile = new Profile()
      this.profile.restore(serEncProfileData)
    } else {
      // TODO: throw / error
    }

    if (this.profile.getIdentityPrivateKey() !== aPrivateIdentityKey) {
      throw `Mismatched profile while executing ${this.signIn.name}.`
    }
  }

  /**
   * logout -
   *
   * @param theArguments
   */
  async logout(theArguments) {
    console.info(this.logout.name)
    // TODO:
  }

  /**
   * uploadPost - Receives an instance of the Post class, processes it to upload
   *              images / movies to a CDN, modifies the instance to reflect the
   *              CDN URLs, and then inserts it into this user's feed in the db.
   *              Also inserts the images into the URL cache.
   *
   * @param theArguments  Expects aPostObj, an instance of the Post class.
   */
  async uploadPost(theArguments) {
    console.info(this.uploadPost.name)

    if (!this.profile) {
      throw `${this.uploadPost.name} failed because user is not logged in.`
    }
    const identityPublicKey = this.profile.getIdentityPublicKey()

    const {aPostObj} = theArguments
    if (!aPostObj) {
      throw `${this.uploadPost.name} failed because a post object was not provided.`
    }

    // TODO: check user level before posting & throw if insufficient

    // Process the user's post up to the db (i.e. upload content to the CDNs,
    // create links and put them in the post, then push that up to the db).
    await aPostObj.uploadContentToCdn()
    const serPost = aPostObj.serializeToString()

    // We're going to try making a post a serialized string for now (eventually
    // probably compressed too--though objects are possible). The initial
    // structure for the posts in the db will be:
    //
    // <dbroot>/<location>/<userId>/content/
    //                                     <profile>:<serZipData>
    //                                     <date>/<postId>/
    //                                                    post:<serZipData>
    //                                                    comments:{
    //                                                      id1:<serZipComment>,
    //                                                      id2:<serZipComment>,
    //                                                      ...
    //                                                      idn/<serZipComment>,
    //                                                    }
    //                                                    responses:{
    //                                                      id1:<serZipResponse>,
    //                                                      id2:<serZipResponse>,
    //                                                      ...
    //                                                      idn:<serZipResponse>,
    //                                                    }
    //                                                    counts:{
    //                                                      numComments:<#>
    //                                                      numResponses: {
    //                                                        likes:<#>,
    //                                                        constructives:<#>,
    //                                                      },
    //                                                    }
    // <dbroot>/<location>/<userId>/internal/
    //                                      <date>/<postId>/
    //                                                    clicks:{
    //                                                      id1:<signClick>,
    //                                                      id2:<signClick>,
    //                                                      ...
    //                                                      idn/<signClick>,
    //                                                    }
    //                                                    views:{
    //                                                      id1:<signView>,
    //                                                      id2:<signView>,
    //                                                      ...
    //                                                      idn/<signView>,
    //                                                    }
    //
    //
    // Notes:
    //   - <location> will be short zip code
    //   - different countries should have a different db
    //   - <userId> is the identity public key
    //   - <date> is the UTC time resolved down to the day (ignore h:m:s)
    //   - <postId> is the id stored in the Post Class instance
    //   - concerns:
    //      - how to get the counts in this db system (no atomic ops).
    //        One solution could be an aggregator server or alternately having
    //        the customer phone do it.
    //        Another way might be modifying conflict resolution alg. and having
    //        each phone post an update on d/l.
    //      - internal is separated to prevent to many events in 'on' listeners
    //

    const zipCode = 94501
    const postId = aPostObj.getPostId()
    try {
      await this._gunWrite(zipCode, postId, serPost)
    } catch(error) {
      // debugger
    }
    try {
      await this._gunRead(zipCode, postId, serPost)
    } catch(error) {
      // debugger
    }
    aPostObj.clearModified()

    // console.info(`Attempting to write ${now} to db.`)
    // const now = Date.now()
    // db.instance().get('key').put({val: now}, (ack) => {
    //   if (ack && ack.ok) {
    //     console.info(`Wrote ${now} to gun.`)
    //
    //     console.info(`Attempting to read ${now}`)
    //     db.instance().get('key').once((data, key) => {
    //       console.info(`Fetched key: ${key}`)
    //       console.info('data = ', data)
    //     })
    //   } else {
    //     console.error(`Unable to write ${now} to gun.`)
    //   }
    // });
  }

  /**
   * textDonation - Sends a constituent a text message with a link for them to
   *                donate to the campaign.
   *                Records the donation in this campaign's user's pending
   *                donation bucket for confirmation with Square Database at
   *                a later date.
   *
   * @param theArguments donationRecord, a JS object documented below.
   * @throws If ...
   *
   * donationRecord is an object containing the following properties:
   *   - amount:
   *   - phoneNumber:
   *   - firstName:
   *   - lastName:
   *   - occupation:
   *   - employer:
   *
   */
  async textDonation(theArguments) {
    if (!this.profile) {
      throw `${this.uploadPost.name} failed because user is not logged in.`
    }

    const identityPublicKey = this.profile.getIdentityPublicKey()
    if (theArguments &&
        theArguments.hasOwnProperty('donationRecord')) {
      const campaignPath = `global/mobile/${agathaCampaignId}`
      const campaignAggregateDonationPath = `${campaignPath}/donate/all`
      const campaignUserDonationPath = `${campaignPath}/donate/${identityPublicKey}`

      const now = Date.now()
      const donationPath = `${campaignUserDonationPath}/${now}`
      const donationRecord = JSON.parse(JSON.stringify(theArguments.donationRecord))
      donationRecord['type'] = 'invoice'
      // const data = {}
      // const now = Date.now()
      // data[now] = donationRecord
      // console.log('Writing to firebase:')
      // console.log(`  ${campaignUserDonationPath}`)
      // console.log(`  ${now}`)
      // console.log('    ', donationRecord)
      //
      firebaseInstance.setFirebaseData(donationPath, donationRecord)

      // Need something more unique to set an aggregate value (collision possible
     //  for UTC.)
     // TODO:
    }
  }

  /**
   * creditCardDonation - Records teh donation in this campaign's user's
   *                      completed donation bucket.
   *                    - Sends the constituent a text message reciept, thanking
   *                      them and indicating that a future App link will be
   *                      sent, wherein they have special priviledges.
   */
  async creditCardDonation(theArguments) {
    console.log('engine - creditCardDonation')
    console.log(theArguments)

    if (!this.profile) {
      throw `${this.uploadPost.name} failed because user is not logged in.`
    }

    const identityPublicKey = this.profile.getIdentityPublicKey()
    if (theArguments &&
        theArguments.hasOwnProperty('donationRecord')) {
      const campaignPath = `global/mobile/${agathaCampaignId}`
      const campaignAggregateDonationPath = `${campaignPath}/donate/all`
      const campaignUserDonationPath = `${campaignPath}/donate/${identityPublicKey}`

      const now = Date.now()
      const donationPath = `${campaignUserDonationPath}/${now}`
      const donationRecord = JSON.parse(JSON.stringify(theArguments.donationRecord))
      donationRecord['type'] = 'cc'

      try {
        if (theArguments.hasOwnProperty('resultData')) {          
            donationRecord['resultData'] = JSON.stringify(theArguments.resultData)
        }
      } catch (suppressedError) {
        // ...
      }
      
      // TODO: should probably stringify these before setting them in firebase

      // const data = {}
      // const now = Date.now()
      // data[now] = donationRecord
      // console.log('Writing to firebase:')
      // console.log(`  ${campaignUserDonationPath}`)
      // console.log(`  ${now}`)
      // console.log('    ', donationRecord)
      //
      firebaseInstance.setFirebaseData(donationPath, donationRecord)

      // Need something more unique to set an aggregate value (collision possible
     //  for UTC.)
     // TODO:
    }
  }

  /**
   *
   */
  async getDonationStatus(theArguments) {
    if (!this.profile) {
      throw `${this.uploadPost.name} failed because user is not logged in.`
    }

    const identityPublicKey = this.profile.getIdentityPublicKey()

    const campaignPath = `global/mobile/${agathaCampaignId}`
    const campaignAggregateDonationPath = `${campaignPath}/donate/all`
    const campaignUserDonationPath = `${campaignPath}/donate/${identityPublicKey}`

    // Get all the firebase donation records for this user and Calculate the
    // total donations collected:
    //
    let total = 0
    const ref = firebaseInstance.getFirebaseRef(campaignUserDonationPath)

    let snapshot = undefined
    try {
      snapshot = await ref.once('value')
    } catch (err) {
      throw `Unable to access campaign donations for user.`
    }

    if (!snapshot || !snapshot.exists()) {
      return total
    }

    const campaignRecordDict = snapshot.val()
    for (const campaignRecordKey in campaignRecordDict) {
      const campaignRecord = campaignRecordDict[campaignRecordKey]
      if (campaignRecord && campaignRecord.hasOwnProperty('amount')) {
        const amount = parseFloat(campaignRecord.amount)
        total += amount
      }
    }

    return total
  }


  /**
   *
   */
  async initEngine(anIdentityKeyPair) {
    console.info("initEngine called")

    // const profile = new Profile()
    //
    // // Check to see if we already have profile data:
    // if (!anIdentityKeyPair) {
      // debugger
      // let keys = await SEA.pair()
      //
      // profile.setSigningKeyPair(keys.pub, keys.priv)
      // profile.setEncryptionKeyPair(keys.epub, keys.epriv)
      // profile.setImageUrl('')
      // profile.setAlias('AC')
      // profile.setDescription('End of funnel operations center chief.')
      //
      // // TODO: encryption etc. (when integration with keychain)
      // this.localStore.write('profile.enc.json', JSON.stringify(profile), profile.getEncryptionPublicKey())
      //
      // // TODO: make this generic and additive etc. when integrating with keychain
      // const users = {}
      // users[profile.getAlias()] = profile.getEncryptionPublicKey()
      // this.localStore.write('users.json', JSON.stringify(users))
    // } else {
    //   debugger
    //   const profileDataSer = await this.localStore.read('profile.enc.json', anIdentityKeyPair)
    //   if (!profileDataSer) {
    //     throw 'Unable to read profile data from aync storage.'
    //   }
    //
    //   const profile = new Profile()
    //   profile.restore(profileDataSer)
    // }
    //
    //
    // console.info('The profile object:\n----------------\n\n')
    // console.dir(profile)
    // debugger

    // Send / Get test with gun db:
    //
    // console.info(`Attempting to write ${now} to gun.`)
    // const now = Date.now()
    // db.instance().get('key').put({val: now}, (ack) => {
    //   if (ack && ack.ok) {
    //     console.info(`Wrote ${now} to gun.`)
    //
    //     console.info(`Attempting to read ${now}`)
    //     db.instance().get('key').once((data, key) => {
    //       console.info(`Fetched key: ${key}`)
    //       console.info('data = ', data)
    //     })
    //   } else {
    //     console.error(`Unable to write ${now} to gun.`)
    //   }
    // });
  }

  async handleMobileForeground() {
    // TODO:
  }

  async handleMobileBackground() {
    // TODO:
  }

  async handleMobileBackgroundUpdate() {
    // TODO:
  }

  async handleMobileNotifications() {
    // TODO:
  }

  /**
   * @param commandObj  An object defining a command to execute and it's
   *                    arguments.
   */
  async engineCommandExec(aCommand) {
    console.info(this.engineCommandExec.name)

    // Add the command to the queue of commands to run
    aCommand.setTimeReceived()
    this.commandQueue.push(aCommand)

    // If we're already executing commands, exit (i.e. running commands is
    // only done in the first call to this function when commands stack up).
    if (!this.executingCommands) {
      while (this.commandQueue.length > 0) {
        const commandToRun = this.commandQueue.shift()
        commandToRun.setTimeProcessed()
        try {
          const result = await this[commandToRun.getCommandType()](commandToRun.getArguments())
          if (result) {
            commandToRun.setResult(result)
          }
        } catch (error) {
          commandToRun.setError(error)
        }
        commandToRun.setTimeCompleted()
        this.emit('me-engine-command-result', commandToRun)
        console.info(`Executed ${commandToRun.getCommandType()} (exec time: ${commandToRun.getTimeProcessedToCompleted()} ms, total time: ${commandToRun.getTimeIssuedToCompleted()} ms)`)
      }
    }

    this.executingCommands = false
  }

  async _gunWrite(aZipCode, aPostId, aSerPost) {
    return new Promise((resolve, reject) => {
      const userId = this.profile.getIdentityPublicKey()
      const tempDate = new Date()
      const date = `${tempDate.getFullYear()}${tempDate.getMonth()+1}${tempDate.getDate()}`
      const dbPostPath = `${aZipCode}/${userId}/posts/${date}/${aPostId}`
      console.info(`${this._gunWrite.name} writing to db: /${dbPostPath}`)

      // production not working - debug by simplifying:
      db.instance().get(`${aZipCode}`).get(userId).get('posts').get(`${date}`).get(`${aPostId}`).put(aSerPost, (ack) => {
      // db.instance().get('testKey').put({post: aSerPost}, (ack) => {
        // debugger
        if (ack && ack.ok) {
          resolve(ack.ok)
        } else {
          reject(`Unable to write to ${dbPostPath}.\n${ack.err}`)
        }
      })
    })
  }

  async _gunRead(aZipCode, aPostId, aSerPost) {
    return new Promise((resolve, reject) => {
      const userId = this.profile.getIdentityPublicKey()
      const tempDate = new Date()
      const date = `${tempDate.getFullYear()}${tempDate.getMonth()+1}${tempDate.getDate()}`
      const dbPostPath = `${aZipCode}/${userId}/posts/${date}/${aPostId}`
      console.info(`${this._gunWrite.name} reading from db: /${dbPostPath}`)

      // production not working - debug by simplifying:
      db.instance().get(`${aZipCode}`).get(userId).get('posts').get(`${date}`).get(`${aPostId}`).once((data, key) => {
      // db.instance().get('testKey').once((data, key) => {
        // debugger
        console.info(`Fetched key: ${key}`)
        // console.dir(data)
        resolve(data)
      })
    })
  }
}
