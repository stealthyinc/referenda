const articles = [{
  id: 1,
  photo: require('../img/warren1.jpg'),
  type: 'article',
  time: -300,
  header: 'Universal Child Care',
  text: `Democratic presidential candidate Elizabeth Warren proposed a universal child care plan that would limit American families’ expenses to 7 percent of ` +
  `income regardless of how many children they have in care -- paid for by a tax on the ultra-wealthy. \nThe Massachusetts senator’s plan, unveiled Tuesday on ` + 
  `Medium.com, would make child care free for families with incomes below 200 percent of the poverty level, or less than $51,500 for a family of four. `,
  comments: [{
    id: 1,
    text: 'Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis. Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem.',
    time: 0,
  }, {
    id: 2,
    text: 'Quisque ut erat. Curabitur gravida nisi at nibh.',
    time: -311,
  }, {
    id: 3,
    text: 'Etiam pretium iaculis justo. In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus. Nulla ut erat id mauris vulputate elementum.',
    time: -622,
  }, {
    id: 4,
    text: 'In est risus, auctor sed, tristique in, tempus sit amet, sem.',
    time: -933,
  }, {
    id: 5,
    text: 'In hac habitasse platea dictumst.',
    time: -1244,
  }, {
    id: 6,
    text: 'In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.',
    time: -1555,
  }, {
    id: 7,
    text: 'Vivamus vel nulla eget eros elementum pellentesque. Quisque porta volutpat erat.',
    time: -1866,
  }, {
    id: 8,
    text: 'Duis mattis egestas metus. Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.',
    time: -2177,
  }],
}, {
  id: 2,
  photo: require('../img/bernie1.jpg'),
  type: 'article',
  time: -1373,
  header: 'Save Social Security ',
  text: `Sen. Bernie Sanders has a plan to add more than 50 years of sustainability to Social Security, the New Deal-era program that's facing a looming cash crunch.` +
  `The proposal would shore up Social Security with payroll taxes on income above $250,000, the Vermont independent announced Wednesday. \nIt's the latest in a flurry ` + 
  `of ambitious legislation being floated by lawmakers with their eyes on the 2020 Democratic presidential nomination.`,
  comments: [],
}, {
  id: 3,
  photo: require('../img/guadido1.jpg'),
  type: 'article',
  time: -2446,
  header: 'Parlamento Andino',
  text: `Este jueves, el Parlamento Andino acordó reconocer a Juan Guaidó como Presidente encargado de Venezuela. `+ 
  `\nLa decisión fue tomada en la sesión plenaria realizada este 21 de febrero en Bogotá, Colombia, en la que participaron ` + 
  `parlamentarios de Perú, Ecuador, Bolivia, Colombia y Chile, país que estuvo representado por el senador de la UDI Alejandro ` +
  `García Huidobro tras decisión de la Cámara Alta.`,
  comments: [],
},
{
  id: 4,
  photo: require('../img/kamala1.jpg'),
  type: 'article',
  time: -2446,
  header: 'The Senator I Am Today',
  text: `When I was a young girl, I once spent an afternoon making lemon bars. I found a recipe in one of my mother’s cookbooks and set about beating the eggs, mixing ` +
  `the ingredients, and greasing the pan. \nThe lemon bars turned out beautifully, and I was excited to show them off. So I put them on a plate, covered them with Saran ` +
  `Wrap, and walked two doors down to our neighbor, Mrs. Shelton, who was drinking tea and laughing with her sister and my mother. I proudly showed off my creation, ` +
  `and Mrs. Shelton took a big bite.`,
  comments: [],
}, 
{
  id: 5,
  photo: require('../img/photo5.png'),
  type: 'article1',
  time: -4592,
  header: 'Birds Of Our Planet',
  text: 'Birds have feathers, wings, lay eggs and are warm blooded. There are around 10000 different species of birds worldwide. ' +
  'The Ostrich is the largest bird in the world. It also lays the largest eggs and has the fastest maximum running speed (97 kph). ' +
  'Scientists believe that birds evolved from theropod dinosaurs. Birds have hollow bones which help them fly. ' +
  'Some bird species are intelligent enough to create and use tools.',
  comments: [],
}, {
  id: 6,
  photo: require('../img/photo6.png'),
  type: 'article1',
  time: -5665,
  header: 'Mountains',
  text: 'Mountains make up about one-fifth of the world\'s landscape, and provide homes to at least one-tenth of the world\'s people. ' +
  'The tallest known mountain in the solar system is Olympus Mons, located on Mars. ' +
  'There are mountains under the surface of the sea! ' +
  'Mountains occur more often in oceans than on land; some islands are the peaks of mountains coming out of the water.',
  comments: [],
}, {
  id: 7,
  photo: require('../img/photo45.png'),
  type: 'fact',
  time: -5665,
  header: 'Smile and Frown',
  text: 'It takes 17 muscles to smile and 43 to frown.',
  comments: [],
}, {
  id: 8,
  photo: require('../img/photo46.png'),
  type: 'fact',
  time: -8373,
  header: 'Interesting Fact',
  text: 'Dolphins sleep with one eye open.',
  comments: [],
}, {
  id: 9,
  photo: require('../img/photo47.png'),
  type: 'fact',
  time: -565,
  header: 'Elephant',
  text: 'Elephant is one of the few mammals that can\'t jump.',
  comments: [],
}, {
  id: 10,
  photo: require('../img/photo48.png'),
  type: 'fact',
  time: -52365,
  header: 'Cold Water',
  text: 'Cold water weighs less than hot water.',
  comments: [],
}, {
  id: 11,
  photo: require('../img/photo49.png'),
  type: 'fact',
  time: -1295,
  header: 'Our Eyes',
  text: 'You blink over 10,000,000 times a year.',
  comments: [],
}, {
  id: 12,
  photo: require('../img/photo17.png'),
  type: 'post',
  time: -300,
  title: 'My Little Kitten',
  text: 'I have got a cat. Her name is Matilda. She is quite old for a cat. She is eleven years old. Matilda is very' +
  ' fluffy. Her back is black and her belly and chest are white. She also has a black muzzle with long white whiskers. ' +
  'Her legs and paws are white. Matilda has big eyes. Her eyes are light green, but they become yellow in bright sunlight. I love my cat.',
  comments: [],
}, {
  id: 13,
  photo: require('../img/photo18.png'),
  type: 'post',
  time: -1373,
  header: 'Interesting Fact',
  text: 'One chef prepared a delicious cake with apples and named it in honor of his beloved Charlotte.',
  comments: [],
}, {
  id: 14,
  photo: require('../img/photo19.png'),
  type: 'post',
  time: -2446,
  header: 'Music In Our Life',
  text: 'The scientists say that they can define your character if they know what music you like.',
  comments: [],
}, {
  id: 15,
  photo: require('../img/photo20.png'),
  type: 'post',
  time: -3519,
  header: 'Exciting Adventure',
  text: 'My trip to Spain last summer. I think that it was the most interesting trip in my life.',
  comments: [],
},
];

export default articles;
