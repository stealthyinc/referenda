export const INDEX_FILE = 'index.json'
export const CONFIG_FILE = 'config.json'

// export const GAIA_MAP = {
//   default: 'https://gaia.blockstack.org/hub/16BzKWyRz4MtxQAz4Z1jE4s1GJz2xL1d7z',   // default: https://core.blockstack.org/v1/users/braphaav.personal.id
//   agatha: 'https://gaia.blockstack.org/hub/1GECbWbpaDhEfpUi2Q46TtuHgfUvDStd5W',   // agatha: https://core.blockstack.org/v1/users/agathaforcongress.id.blockstack
//   guaido: 'https://gaia.blockstack.org/hub/17xxKVFrjq1DAkphELyP2NVvhVwM81XSSs',   // guaido: https://core.blockstack.org/v1/users/pbj.id
// }

// TODO: post Oslo, all this will get pushed to GAIA via a profile editor.
//  - require is needed here b/c these it is elaborated at build time and
//    passing in a string dynamically fails...
export const FIRST_CARD_WORKAROUND = {
  'https://gaia.blockstack.org/hub/16BzKWyRz4MtxQAz4Z1jE4s1GJz2xL1d7z' : {    // default
    avatarImg: require('../data/img/avatars/default.png'),
    fcBackgroundImg: require('../data/img/democracy_wall.jpg'),
    nameStr: 'Default Campaign',
    positionStr: 'Your Campaign',
    followers: '3,432',
  },
  'https://gaia.blockstack.org/hub/1MURn3uZbTy7mAZ9ShrhDeFkgG1AU8vRkP' : {    // agatha
    avatarImg: require('../data/img/avatars/agatha.png'),
    fcBackgroundImg: 'https://untamedskies.files.wordpress.com/2012/07/americanflags.jpg',
    nameStr: 'Agatha Bacelar',
    positionStr: 'US Congress Candidate, CA12, 2020',
    followers: '29,521',
  },
  'https://gaia.blockstack.org/hub/17xxKVFrjq1DAkphELyP2NVvhVwM81XSSs' : {    // guaido
    avatarImg: require('../data/img/avatars/guaido.jpg'),
    fcBackgroundImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Flag_of_Venezuela_%28state%29.svg/1200px-Flag_of_Venezuela_%28state%29.svg.png',
    nameStr: 'Juan Guaidó',
    positionStr: 'President of the National Assembly of Venezuela',
    followers: '17,234,020',
  },
  'https://gaia.blockstack.org/hub/1AWEUPLVhMZkke6qUnkw7T9g6tqBGnpKnv' : {    // nabilah
    avatarImg: require('../data/img/avatars/nabilah.jpg'),
    fcBackgroundImg: require('../data/img/nabilahBack.jpeg'),
    nameStr: 'Nabilah Islam',
    positionStr: 'US Congress Candidate, GA-07, 2020',
    followers: '1,234',
  }
}

export const MEDIA_TYPES = { UNKNOWN: 0, VIDEO: 1, IMAGE: 2}
export const VIDEO_EXTENSIONS = ['mp4', 'mpeg', 'mpg', 'avi', 'mov']
export const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'bmp', 'gif']

export const MAX_CARD_WIDTH = 512
export const MIN_CARD_WIDTH = 400

export const DIALOG_BOX_BACKGROUND = 'rgba(100,100,100,1.0)'
export const ENABLE_SIMPLE_ID = true

export const MIN_AXIS_CHANGE_TO_RERENDER_PX = 25
