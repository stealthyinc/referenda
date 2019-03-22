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
      aPublicEncryptionKey,
      aPrivateEncryptionKey
    }
    return command
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
