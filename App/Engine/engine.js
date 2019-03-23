import {AsyncStorage} from 'react-native'
const { EventEmitterAdapter } = require('./platform/reactNative/eventEmitterAdapter.js')

import crypto from 'crypto'
import {db} from './database'

import {Profile} from './data/profile'
import {LocalStore} from './io/localStore'

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
   * login - Reads and decrypts the user's profile from local storage with the
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
   */
  async login(theArguments) {
    console.log(this.login.name)

    const {aPublicIdentityKey, aPrivateIdentityKey} = theArguments

    // TODO: should this exit gracefully and set the command result to the UX to error?
    if (!aPublicIdentityKey || !aPrivateIdentityKey) {
      throw `${this.login.name}: aPublicIdentityKey and aPrivateIdentityKey must be defined.`
    }

    const serEncProfileData = await this.localStore.read('profile.enc.json', aPublicIdentityKey)
    if (serEncProfileData) {
      // Restore the profile data from local storage
      const serProfileData = serEncProfileData  // TODO: decrypt with aPrivateIdentityKey
      this.profile = new Profile()
      this.profile.restore(serEncProfileData)
    } else {
      this.profile = new Profile()

      this.profile.setIdentityKeyPair(aPublicIdentityKey, aPrivateIdentityKey)

      const ecdh = crypto.createECDH('secp256k1')
      // Generate and encryption key pair:
      ecdh.generateKeys()
      const encPrivateKey = ecdh.getPrivateKey()
      const encPublicKey = ecdh.getPublicKey()
      // Generate a signing key pair:
      ecdh.generateKeys()
      const signPrivateKey = ecdh.getPrivateKey()
      const signPublicKey = ecdh.getPublicKey()

      this.profile.setSigningKeyPair(signPublicKey, signPrivateKey)
      this.profile.setEncryptionKeyPair(encPublicKey, encPrivateKey)

      // // Create the profile and persist it to local storage
      // let keySet = await SEA.pair()
      // this.profile.setSigningKeyPair(keySet.pub, keySet.priv)
      // this.profile.setEncryptionKeyPair(keySet.epub, keySet.epriv)

      this.profile.setImageUrl('')
      this.profile.setAlias('AC')
      this.profile.setDescription('End of funnel operations center chief.')

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

    if (this.profile.getIdentityPrivateKey() !== aPrivateIdentityKey) {
      throw `Mismatched profile while executing ${this.login.name}.`
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
        debugger
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
}
