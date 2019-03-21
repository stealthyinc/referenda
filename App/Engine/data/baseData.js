/**
 * BaseData - A abstract base class for data objects providing:
 * <ul compact>
 * <li>A modified indicator (i.e. the data needs to be persisted).</li>
 * <li>Serialization ability.</li>
 * <li>Restoring an object from a serialization.</li>
 * </ul>
 *
 * @author Stealthy Inc.
 * @version 1.0
 *
 * @flow
 *
 * TODO: Consider introducing a className member that allows us to throw if we
 *       try to restore from a stringified obj that is not of the desired class
 *       type.
 * TODO: There's probably a better class already existing that uses reflection/
 *       introspection methods to identify subclass elements, hoist and bundle
 *       them into a "this.data" container for serialization. Look for it and
 *       replace this with it.
 */
class BaseData {
  // Initialize class members here (makes flow able to infer member var types):
  data = undefined
  modified = false

  constructor() {
    if (this.constructor === BaseData) {
      throw new TypeError('Abstract class "BaseData" cannot be instantiated directly.')
    }
  }

  /**
   * @param aStringifiedObj  A string representation of this class instance's
   *                         data to initialize member variables. If this arg
   *                         is falsey or missing property data no change is
   *                         made to the instance.
   * @throws                 If aStringifiedObj cannot be parsed by JSON.parse.
   * @since 1.0
   */
  restore(aStringifiedObj: string) {
    if (aStringifiedObj) {
      const obj = JSON.parse(aStringifiedObj)

      if (obj && obj.hasOwnProperty('data')) {
        this.data = obj.data
        this.modified = undefined
      }
    }
  }

  /**
   * @return  A string representation of this class's data suitable for storing
   *          in a DB or local storage. The modified value is cleared to
   *          undefined in the serialized data.
   * @since 1.0
   */
  serializeToString() {
    const tempModified = this.modified
    this.modified = undefined

    const serializationString = JSON.stringify(this)

    this.modified = tempModified
    return serializationString
  }

  /**
   * Clear the modified indicator of this class (for instance after the data
   * has been saved/persisted somewhere)
   *
   * @since 1.0
   */
  clearModified() {
    this.modified = undefined
  }

  /**
   * Indicate that the object has been modified and requires persistence.
   *
   * @param aUTC  If specified, sets the 'modified' member to this value, unless
   *              specified as undefined, in which case Date.now is used.
   *              If not specified, modified is set to the current UTC time.
   */
  setModified(aUTC=undefined) {
    this.modified = (aUTC) ? aUTC : Date.now()
  }

  /**
   * @return  A boolean indicating whether or not this object has been marked
   *          as modified since construction/initialization.
   */
  isModified() {
    return (this.modified && (this.modified !== undefined))
  }
}

module.exports = { BaseData }
