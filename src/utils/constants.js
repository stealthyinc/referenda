export const INDEX_FILE = 'index.json'

export const GAIA_MAP = {
  agatha: 'https://gaia.blockstack.org/hub/1KFqr64mYNP6Ma6D88ErxiY6YhaUgcdKHz',   // agatha
  guaido: 'https://gaia.blockstack.org/hub/1A7gPiEqdCHYLYzRnYtnBQWZMvRoP321Md',   // guaido
}

// TODO: post Oslo, all this will get pushed to GAIA via a profile editor.
//  - require is needed here b/c these it is elaborated at build time and
//    passing in a string dynamically fails...
export const FIRST_CARD_WORKAROUND = {
  'https://gaia.blockstack.org/hub/1KFqr64mYNP6Ma6D88ErxiY6YhaUgcdKHz' : {    // agatha
    avatarImg: require('../data/img/avatars/agatha.png'),
    fcBackgroundImg: 'https://untamedskies.files.wordpress.com/2012/07/americanflags.jpg',
    nameStr: 'Agatha Bacelar',
    positionStr: 'US Congress Candidate, CA12, 2020',
    followers: '29,521',
  },
  'https://gaia.blockstack.org/hub/1A7gPiEqdCHYLYzRnYtnBQWZMvRoP321Md' : {    // guaido
    avatarImg: require('../data/img/avatars/guaido.jpg'),
    fcBackgroundImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Flag_of_Venezuela_%28state%29.svg/1200px-Flag_of_Venezuela_%28state%29.svg.png',
    nameStr: 'Juan Guaidó',
    positionStr: 'President of the National Assembly of Venezuela',
    followers: '17,234,020',
  }
}

export const MEDIA_TYPES = { UNKNOWN: 0, VIDEO: 1, IMAGE: 2}
export const VIDEO_EXTENSIONS = ['mp4', 'mpeg', 'mpg', 'avi', 'mov']
export const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'bmp', 'gif']
