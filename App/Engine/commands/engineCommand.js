/**
 * EngineCommand - A class to contain a command for Referenda's engine.
 *
 * @author Stealthy Inc.
 * @version 1.0
 */
class EngineCommand {
  constructor() {
    this.commandType = undefined
    this.arguments = {}
    this.result = undefined
    this.error = undefined
    this.timeUTC = {
      created: Date.now(),
      issued: undefined,
      received: undefined,
      processed: undefined,
      completed: undefined
    }
  }

  getCommandType() {
    return this.commandType
  }

  getArguments() {
    return this.arguments
  }

  setResult(theResult, deepCopy=false) {
    this.result = (deepCopy) ? JSON.parse(JSON.stringify(theResult)) : theResult
  }

  getResult() {
    return this.result
  }

  setError(anErrorStr) {
    this.error = anErrorStr
  }

  getError() {
    return this.error
  }

  succeeded() {
    return (this.error === undefined)
  }


  /*
   * Command timing / profiling methods
   *
   * When a command is created and sent by the UI, the recored time is
   * timeUTC.issued. When that command is received and queued in the engine, the
   * recorded time is timeUTC.received. When the command is actually first
   * executed, the recorded time is timeUTC.processed. Finally when the command
   * is finshed execution, timeUTC.completed is recorded.
   *****************************************************************************
   */

  setTimeIssued() {
    this.timeUTC.issued = Date.now()
  }

  setTimeReceived() {
    this.timeUTC.received = Date.now()
  }

  setTimeProcessed() {
    this.timeUTC.processed = Date.now()
  }

  setTimeCompleted() {
    this.timeUTC.completed = Date.now()
  }

  getTimeIssuedToProcessed() {
    return this.timeUTC.processed - this.timeUTC.issued
  }

  getTimeIssuedToCompleted() {
    return this.timeUTC.completed - this.timeUTC.issued
  }

  getTimeProcessedToCompleted() {
    return this.timeUTC.completed - this.timeUTC.processed
  }

  /*
   * Static
   *****************************************************************************
   */

  static COMMAND_TYPES = {
    SIGN_UP: 'signUp',
    SIGN_IN: 'signIn',
    UPLOAD_POST: 'uploadPost',
    TEXT_DONATION: 'textDonation',
    CREDIT_CARD_DONATION: 'creditCardDonation',
    GET_DONATION_STATUS: 'getDonationStatus'
  }

  /*
   * Infrastructure commands:
   **************************************
   */
  static signUpCommand(aProfileInstance) {
    const command = new EngineCommand()
    command.commandType = EngineCommand.COMMAND_TYPES.SIGN_UP
    command.arguments = {
      aProfileInstance
    }
    return command
  }

  static signInCommand(aPublicIdentityKey, aPrivateIdentityKey) {
    const command = new EngineCommand()
    command.commandType = EngineCommand.COMMAND_TYPES.SIGN_IN
    command.arguments = {
      aPublicIdentityKey,
      aPrivateIdentityKey
    }
    return command
  }

  /*
   * Campaign commands:
   **************************************
   */
  static textDonationCommand(donationRecord) {
    const command = new EngineCommand()
    command.commandType = EngineCommand.COMMAND_TYPES.TEXT_DONATION
    command.arguments = {
      donationRecord
    }
    return command
  }

  static creditCardDonationCommand() {
    const command = new EngineCommand()
    command.commandType = EngineCommand.COMMAND_TYPES.CREDIT_CARD_DONATION
    command.arguments = {
      // TODO
    }
    return command
  }

  static getDonationStatus() {
    const command = new EngineCommand()
    command.commandType = EngineCommand.COMMAND_TYPES.CREDIT_CARD_DONATION
    command.arguments = {
      // TODO
    }
    return command
  }

  /*
   * Staff level commands:
   **************************************
   */
  static uploadPostCommand(aPostObj) {
    const command = new EngineCommand()
    command.commandType = EngineCommand.COMMAND_TYPES.UPLOAD_POST
    command.arguments = {
      aPostObj
    }
    return command
  }

  static createPost() {
  }

  static deletePost() {

  }

  /*
   * Higher-level commands:
   **************************************
   */
  static commentOnComment() {

  }

  static respondToComment() {

  }

  /*
   * Level 2 commands:
   **************************************
   */
  static commentOnPost() {

  }

  /*
   * Level 1 commands:
   **************************************
   */
  static respondToPost() {

  }
}

module.exports = { EngineCommand }
