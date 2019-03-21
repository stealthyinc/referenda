import {AsyncStorage} from 'react-native'
const { EventEmitterAdapter } = require('./platform/reactNative/eventEmitterAdapter.js')

import {db, SEA} from './database'

import {Profile} from './data/profile'
import {LocalStore} from './io/localStore'

export class ReferendaEngine extends EventEmitterAdapter {
  /**
   * @param anIdentityKeyPair  A pair of SEA encryption keys uniquely identifying
   *                           this user. Required in production. In development
   *                           builds to facilitate work, a profile is created if
   *                           this param is not specified.
   *
   * @throws  If param anIdentityKeyPair is undefined in production.
   */
  constructor (anIdentityKeyPair = undefined) {
    super()

    if (!anIdentityKeyPair && (process.env.NODE_ENV === 'production')) {
      throw 'param anIdentityKeyPair is undefined. Unable to create ReferendaEngine.'
    }

    this.commandQueue = []
    this.executingCommand = false

    this.localStore = new LocalStore()

    this.initEngine(anIdentityKeyPair)
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
    //   debugger
    //   let keys = await SEA.pair()
    //
    //   profile.setSigningKeyPair(keys.pub, keys.priv)
    //   profile.setEncryptionKeyPair(keys.epub, keys.epriv)
    //   profile.setImageUrl('')
    //   profile.setAlias('AC')
    //   profile.setDescription('End of funnel operations center chief.')
    //
    //   // TODO: encryption etc. (when integration with keychain)
    //   this.localStore.write('profile.enc.json', JSON.stringify(profile), profile.getEncryptionPublicKey())
    //
    //   // TODO: make this generic and additive etc. when integrating with keychain
    //   const users = {}
    //   users[profile.getAlias()] = profile.getEncryptionPublicKey()
    //   this.localStore.write('users.json', JSON.stringify(users))
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
  execEngineCommand(aCommand) {
    console.info(this.execEngineCommand.name)

    // Add the command to the queue of commands to run
    aCommand.setTimeReceived()
    this.commandQueue.push(aCommand)

    // If we're already executing commands, exit (i.e. running commands is
    // only done in the first call to this function when commands stack up).
    if (!this.executingCommands) {
      while (this.commandQueue.length > 0) {
        const commandToRun = this.commandQueue.shift()
        commandToRun.setTimeProcessed()
        // TODO: programmatic call to command code, await ...
        commandToRun.setTimeCompleted()
        console.info(`Executed ${commandToRun.getCommandType()} (exec time: ${commandToRun.getTimeProcessedToCompleted()} ms, total time: ${commandToRun.getTimeIssuedToCompleted()} ms)`)
      }
    }
  }
}
