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

  setResult(aResult) {

  }

  getResult() {

  }

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

  /*
   * Static
   *****************************************************************************
   */

  static COMMAND_TYPES = {
    LOGIN: 'login'
  }

  /*
   * Infrastructure commands:
   **************************************
   */
  static loginCommand(aPublicEncryptionKey, aPrivateEncryptionKey) {
    const command = new EngineCommand()
    command.commandType = EngineCommand.COMMAND_TYPES.LOGIN
    command.arguments = {
      publicEncKey: aPublicEncryptionKey,
      privateEncKey: aPrivateEncryptionKey
    }
  }

  /*
   * Staff level commands:
   **************************************
   */
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
