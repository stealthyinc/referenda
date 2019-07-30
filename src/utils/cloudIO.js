class CloudIO {
  constructor() {
    this.isSignedIn = false
    this.userSession = undefined
    this.mediaUrlRoot = undefined
  }

  setSignedIn(theSignedInStatus=true) {
    this.isSignedIn = theSignedInStatus
  }

  setUserSession(aUserSession) {
    this.userSession = aUserSession
  }

  setMediaUrlRoot(aMediaUrlRoot) {
    this.mediaUrlRoot = aMediaUrlRoot
  }

  // Get File Blockstack
  getFileBS = async(aFileName, theOptions={ decrypt:false }) => {
    return this.userSession.getFile(aFileName, theOptions)
    .then((response) => {
      try {
        let result = undefined
        if (response) {
          result = JSON.parse(response)
        }
        return result
      } catch (error) {
        throw new Error(`Blockstack.getFile failed in getFile.\n${error}`)
      }
    })
  }

  // Get File Fetch API
  getFileWeb = async(aFileName, theOptions={ decrypt:false }) => {
    const pathToRead = `${this.mediaUrlRoot}/${aFileName}`
    return fetch(pathToRead)
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
      throw new Error(`Fetch failed in getFile with status ${response.status}.`)
    })
  }

  // getFile: abstraction above blockstack getFile that works if we're not
  //          signed in for reading files for static site load
  //
  getFile = async(aFileName, theOptions={ decrypt:false }) => {
    if (this.isSignedIn) {
      return this.getFileBS(aFileName, theOptions)
    } else {
      return this.getFileWeb(aFileName, theOptions)
    }
  }

  putFile = async(aFileName, theFileData, theOptions={encrypt: false}) => {
    return this.userSession.putFile(aFileName, theFileData, theOptions)
  }
}

// Singleton global of our CloudIO class.
// Must appear after the class definition above.
//
export var cloudIO = new CloudIO()
