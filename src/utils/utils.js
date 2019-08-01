const runes = require('runes')
const C = require('./constants.js')

export const avatarArr = {
  0: require('../assets/avatars/Image0.png'),
  1: require('../assets/avatars/Image1.png'),
  2: require('../assets/avatars/Image2.png'),
  3: require('../assets/avatars/Image3.png'),
  4: require('../assets/avatars/Image4.png'),
  5: require('../assets/avatars/Image5.png'),
  6: require('../assets/avatars/Image6.png'),
  7: require('../assets/avatars/Image7.png'),
  8: require('../assets/avatars/Image8.png'),
  9: require('../assets/avatars/Image9.png'),
 10: require('../assets/avatars/Image10.png'),
 11: require('../assets/avatars/Image11.png'),
}

// export const randomAvatar = avatarArr[Math.floor(Math.random() * Math.floor(12))]

export const getPostFileName = (aPostId) => {
  return `p${aPostId}.json`
}

export const getPostMediaFileName = (aPostId, theOriginalFileName) => {
  // Get the extension of the original file name and use that to
  // set the media file name extension. (The reason for this is
  // that ReactPlayer's canPlay functionality on mobile seems to
  // match against the extension to determine if something is
  // playable or not.)
  const extensionRaw = getFileExtension(theOriginalFileName)

  if (extensionRaw) {
    return `p${aPostId}.${extensionRaw}`
  } else {
    return `p${aPostId}.media`
  }
}

// Safe on emoji / unicode
export const getTruncatedStr = (aString, aTruncatedLen=256) => {
  try {
    if (Array.from(aString).length > aTruncatedLen) {
      return `${runes.substr(aString, 0, aTruncatedLen)} ...`
    }
  } catch (suppressedError) {}

  return aString
}

export const getFileExtension = (aFileName) => {
  // See: https://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript
  const re = /(?:\.([^.]+))?$/
  const extensionRaw = re.exec(aFileName)[1]

  return extensionRaw
}

export const getFileType = (aFileName) => {
  try {
    const extensionRaw = getFileExtension(aFileName)

    if (extensionRaw) {
      const extensionLc = extensionRaw.toLowerCase()

      if (C.IMAGE_EXTENSIONS.includes(extensionLc)) {
        return C.MEDIA_TYPES.IMAGE
      } else if (C.VIDEO_EXTENSIONS.includes(extensionLc)) {
        return C.MEDIA_TYPES.VIDEO
      }
    }
  } catch (suppressedError) {}
  return C.MEDIA_TYPES.UNKNOWN
}
