const images = [
  require('../img/Image10.png'),
  require('../img/Image11.png'),
  require('../img/Image2.png'),
  require('../img/Image3.png'),
  require('../img/Image4.png'),
  require('../img/Image1.png'),
  require('../img/Image12.png'),
  require('../img/Image8.png'),
  require('../img/Image6.png'),
  require('../img/Image9.png'),
  require('../img/Image5.png'),
  require('../img/Image7.png'),
];

const users = [{
  id: 0,
  firstName: 'Agatha',
  lastName: 'Bacelar',
  phone: '+1 415 670 90 34',
  country: 'USA',
  email: 'agatha.bacelar@senate.org',
  password: '123456',
  newPassword: '12345678',
  confirmPassword: '12345678',
  photo: require('../img/avatars/agatha.png'),
  postCount: 86,
  followersCount: 22102,
  followingCount: 536,
  images,

},
{
  id: 1,
  firstName: 'Agatha',
  lastName: 'Bacelar',
  phone: '+1 415 670 90 34',
  country: 'USA',
  email: 'agatha.bacelar@senate.org',
  password: '123456',
  newPassword: '12345678',
  confirmPassword: '12345678',
  photo: require('../img/avatars/agatha.png'),
  postCount: 86,
  followersCount: 22102,
  followingCount: 536,
  images,
},
{
  id: 2,
  firstName: 'Juan',
  lastName: 'Guaidó',
  phone: '+1 415 670 90 34',
  country: 'Venezuela',
  email: 'juan.guaido@venezuela.org',
  password: '123456',
  newPassword: '12345678',
  confirmPassword: '12345678',
  photo: require('../img/avatars/guaido.jpg'),
  postCount: 86,
  followersCount: 31322,
  followingCount: 635,
  images,
},
{
  id: 3,
  firstName: 'Kamala',
  lastName: 'Harris',
  phone: '+1 415 670 90 34',
  country: 'USA',
  email: 'kamala.harris@senate.org',
  password: '123456',
  newPassword: '12345678',
  confirmPassword: '12345678',
  photo: require('../img/avatars/kamala.jpg'),
  postCount: 86,
  followersCount: 22102,
  followingCount: 1323,
  images,
},
{
  id: 12,
  firstName: 'Helen',
  lastName: 'Gilbert',
  phone: '+1 415 670 90 34',
  country: 'Belarus',
  email: 'h.gilbert@akveo.com',
  password: '123456',
  newPassword: '12345678',
  confirmPassword: '12345678',
  photo: require('../img/avatars/Image9.png'),
  postCount: 86,
  followersCount: 2975,
  followingCount: 703,
  images,
},
{
  id: 14,
  firstName: 'Emilie',
  lastName: 'McDiarmid',
  email: 'emcdiarmid1@yale.edu',
  country: 'China',
  password: 'YyKgJ8A3b4b',
  newPassword: 'DpCRPYW7Fgy',
  confirmPassword: 'DpCRPYW7Fgy',
  postCount: 95,
  phone: '86-(261)670-4133',
  followingCount: 975,
  followersCount: 1703,
  images,
  photo: require('../img/avatars/Image1.png'),
},
{
  id: 13,
  firstName: 'Sandra',
  lastName: 'Paver',
  email: 'spaver2@ox.ac.uk',
  country: 'Greece',
  password: '0BCeHRlt84Zo',
  newPassword: '61BaifSE20w',
  confirmPassword: '61BaifSE20w',
  postCount: 60,
  phone: '30-(524)246-5851',
  followingCount: 736,
  followersCount: 1534,
  images,
  photo: require('../img/avatars/Image3.png'),
},
{
  id: 4,
  firstName: 'Nancy',
  lastName: 'O\'Crevan',
  email: 'nocrevan3@zimbio.com',
  country: 'China',
  password: 'W0NxvHo2C',
  newPassword: 'vj4ueTKK',
  confirmPassword: 'vj4ueTKK',
  postCount: 78,
  phone: '86-(499)721-5796',
  followingCount: 86,
  followersCount: 3303,
  images,
  photo: require('../img/avatars/Image4.png'),
},
{
  id: 5,
  firstName: 'Clayton',
  lastName: 'O\'Mullaney',
  email: 'cmullaney4@tripadvisor.com',
  country: 'Philippines',
  password: 'ZlzECwoN',
  newPassword: 'N9l5KLpBW',
  confirmPassword: 'N9l5KLpBW',
  postCount: 37,
  phone: '63-(210)188-9126',
  followingCount: 745,
  followersCount: 2703,
  images,
  photo: require('../img/avatars/Image5.png'),
},
{
  id: 6,
  firstName: 'Carlee',
  lastName: 'Aubry',
  email: 'caubry5@nytimes.com',
  country: 'China',
  password: 'jUIz9PNbU',
  newPassword: 'nJRP3MdIh4U',
  confirmPassword: 'nJRP3MdIh4U',
  postCount: 89,
  phone: '86-(939)186-9659',
  followingCount: 444,
  followersCount: 8432,
  images,
  photo: require('../img/avatars/Image6.png'),
},
{
  id: 7,
  firstName: 'Patrick',
  lastName: 'Holden',
  email: 'p.holden6@woothemes.com',
  country: 'Indonesia',
  password: 'inOEsoAlnh',
  newPassword: '60z2bgL',
  confirmPassword: '60z2bgL',
  postCount: 48,
  phone: '62-(373)613-7229',
  followingCount: 731,
  followersCount: 18230,
  images,
  photo: require('../img/avatars/Image7.png'),
},
{
  id: 8,
  firstName: 'Edward',
  lastName: 'Storton',
  email: 'estorton7@google.ca',
  country: 'Nigeria',
  password: 'e1H56GRP',
  newPassword: 't2a1FbI8oCo',
  confirmPassword: 't2a1FbI8oCo',
  postCount: 100,
  phone: '234-(135)610-8989',
  followingCount: 667,
  followersCount: 4234,
  images,
  photo: require('../img/avatars/Image8.png'),
},
{
  id: 9,
  firstName: 'Carole',
  lastName: 'Blundon',
  email: 'cblundon8@google.pl',
  country: 'United States',
  password: 't9xI6skPz',
  newPassword: 'y84Jquaxg8',
  confirmPassword: 'y84Jquaxg8',
  postCount: 74,
  phone: '1-(913)904-8423',
  followingCount: 750,
  followersCount: 1032,
  images,
  photo: require('../img/avatars/Image10.png'),
},
{
  id: 10,
  firstName: 'Bryce',
  lastName: 'Curle',
  email: 'bcurled@paginegialle.it',
  country: 'Indonesia',
  password: 'ACCsjlPq',
  newPassword: 'm05jBM1S88',
  confirmPassword: 'm05jBM1S88',
  postCount: 54,
  phone: '62-(688)911-5487',
  followingCount: 343,
  followersCount: 3721,
  images,
  photo: require('../img/avatars/Image11.png'),
},
{
  id: 11,
  firstName: 'Babara',
  lastName: 'Greasty',
  email: 'bgreastya@netlog.com',
  country: 'Russia',
  password: '0SuOdS8XQK',
  newPassword: 'f49mZd49eGHm',
  confirmPassword: 'f49mZd49eGHm',
  postCount: 58,
  phone: '7-(121)282-0448',
  followingCount: 165,
  followersCount: 5433,
  images,
  photo: require('../img/avatars/Image12.png'),
}];

export default users;
