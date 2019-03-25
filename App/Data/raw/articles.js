const articles = [
{
  id: 1,
  video: require('./../../Assets/videos/guaido.mp4'),
  type: 'article',
  time: -982,
  header: 'Operación Libertad Venezuela',
  text: `Cuando la duda nos debilite, recordemos que la ESPERANZA nació en Venezuela para lograr la libertad, para no morir más nunca. En todos estos años no doblegamos nuestro espíritu y fortalecimos nuestro amor por la patria.`,
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
},
{
  id: 2,
  survey: true,
  photo: require('../img/maduro_vs_guaido.jpg'),
  type: 'article',
  time: -1173,
  header: 'Maduro o Guaidó - tu voto?',
  text: `¿A quién eliges, Maduro o Guaidó?`,
  comments: [],
},
{
  id: 3,
  photo: require('../img/guaido1.jpg'),
  type: 'article',
  time: -1373,
  header: 'Venezuelans Majority',
  text: `Comenzamos hablando de un país posible porque sabíamos que estaba en la mayoría de los que habitamos esta tierra. \n\nY aunque hubo quien dudó que lo haríamos, miles de venezolanos se juramentaron con nosotros.`,
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
},
// {
//   id: 1,
//   photo: require('../img/warren1.jpg'),
//   type: 'article',
//   time: -1373,
//   header: '2020 Presidential Campaign',
//   text: `Elizabeth Warren, a senator from Massachusetts, is running for the Democratic nomination for president. She made her announcement in February 2019 in Lawrence, Massachusetts, a former mill town that ties into her longtime message about fighting for the working class.
//   \nWarren’s platform will focus on many of the same issues she’s worked on since she was a Harvard Law School professor who helped President Barack Obama create the Consumer Financial Protection Bureau after the 2008 recession: cracking down on big banks, making corporations more accountable to workers, and expanding health care and housing for the middle class and low-income Americans.`,
//   comments: [{
//     id: 1,
//     text: 'Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis. Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem.',
//     time: 0,
//   }, {
//     id: 2,
//     text: 'Quisque ut erat. Curabitur gravida nisi at nibh.',
//     time: -311,
//   }, {
//     id: 3,
//     text: 'Etiam pretium iaculis justo. In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus. Nulla ut erat id mauris vulputate elementum.',
//     time: -622,
//   }, {
//     id: 4,
//     text: 'In est risus, auctor sed, tristique in, tempus sit amet, sem.',
//     time: -933,
//   }, {
//     id: 5,
//     text: 'In hac habitasse platea dictumst.',
//     time: -1244,
//   }, {
//     id: 6,
//     text: 'In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.',
//     time: -1555,
//   }, {
//     id: 7,
//     text: 'Vivamus vel nulla eget eros elementum pellentesque. Quisque porta volutpat erat.',
//     time: -1866,
//   }, {
//     id: 8,
//     text: 'Duis mattis egestas metus. Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.',
//     time: -2177,
//   }],
// },
// {
//   id: 2,
//   photo: require('../img/warren2.jpg'),
//   type: 'article',
//   time: -3373,
//   header: 'New Plan for Debt-free College',
//   text: `Sen. Elizabeth Warren used to be known for arguing that the government shouldn’t make money on student loans. Now she’s arguing that students shouldn’t have to take out loans in the first place.
//   \n“While not every college needs to graduate every student debt-free, every kid needs a debt-free option—a strong public university where it’s possible to get a great education without taking on loads of debt,” she said today in a speech at the Shanker Institute. Debt-free college is more progressive than simply making tuition free, as Sen. Bernie Sanders has proposed.
//   \nThat’s because for the poorest students, tuition is often covered by grants, but they still have to pay living expenses. The debt-free idea is spreading: Hillary Clinton’s campaign has hinted a few times that it has a debt-free higher education plan of its own.`,
//   comments: [{
//     id: 1,
//     text: 'Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis. Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem.',
//     time: 0,
//   }, {
//     id: 2,
//     text: 'Quisque ut erat. Curabitur gravida nisi at nibh.',
//     time: -311,
//   }, {
//     id: 3,
//     text: 'Etiam pretium iaculis justo. In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus. Nulla ut erat id mauris vulputate elementum.',
//     time: -622,
//   }, {
//     id: 4,
//     text: 'In est risus, auctor sed, tristique in, tempus sit amet, sem.',
//     time: -933,
//   }, {
//     id: 5,
//     text: 'In hac habitasse platea dictumst.',
//     time: -1244,
//   }, {
//     id: 6,
//     text: 'In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.',
//     time: -1555,
//   }, {
//     id: 7,
//     text: 'Vivamus vel nulla eget eros elementum pellentesque. Quisque porta volutpat erat.',
//     time: -1866,
//   }, {
//     id: 8,
//     text: 'Duis mattis egestas metus. Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.',
//     time: -2177,
//   }],
// },
//   {
//     id: 0,
//     video: require('./../../Assets/videos/candidateVid1.mp4'),
//     type: 'article',
//     time: -100,
//     header: 'In-car Footage',
//     text: `As a Brazilian immigrant who is lucky enough to have American citizenship, I've always felt
//     the importance of using my voice to stand hand in hand with, and advocate for, those 11 million who are being kept
//     voiceless by our government’s inability to pass legislation despite overwhelming support by the American public.`,
//     comments: [],
//   },
//   {id: 1,
//   photo: require('./../../Assets/avatars/agatha1.png'),
//   type: 'article',
//   time: -300,
//   header: 'The wisdom of immigrants',
//   text: `From talking with farm workers in the Central Valley of California, to canvassing in Nevada with undocumented and asylum-seeking organizers, \
//   to visiting the classrooms of DACAmented teachers, to marching and demonstrating with Dreamers, to doing intake meetings with detained immigrants in \
//   five different detention centers, I know that each immigrant has an incredible story, contributes to and represents American values, and I have found \
//   typically knows way more about policy and how our government works than most American citizens do!`,
//   comments: [{
//     id: 1,
//     text: 'Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis. Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem.',
//     time: 0,
//   }, {
//     id: 2,
//     text: 'Quisque ut erat. Curabitur gravida nisi at nibh.',
//     time: -311,
//   }, {
//     id: 3,
//     text: 'Etiam pretium iaculis justo. In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus. Nulla ut erat id mauris vulputate elementum.',
//     time: -622,
//   }, {
//     id: 4,
//     text: 'In est risus, auctor sed, tristique in, tempus sit amet, sem.',
//     time: -933,
//   }, {
//     id: 5,
//     text: 'In hac habitasse platea dictumst.',
//     time: -1244,
//   }, {
//     id: 6,
//     text: 'In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.',
//     time: -1555,
//   }, {
//     id: 7,
//     text: 'Vivamus vel nulla eget eros elementum pellentesque. Quisque porta volutpat erat.',
//     time: -1866,
//   }, {
//     id: 8,
//     text: 'Duis mattis egestas metus. Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.',
//     time: -2177,
//   }],
// }, {
//   id: 2,
//   photo: require('./../../Assets/avatars/agatha3.png'),
//   type: 'article',
//   time: -1373,
//   header: 'My immigrant journey',
//   text: `I was born in Brasil, and immigrated to the US as an infant with my mother, who is one of the glass-ceiling shattering professional women of her \
//   generation - and she did it in not one but two countries! America is a nation of immigrants, so being an immigrant and an American citizen makes me, \
//   in many ways, a very typical American.  \n\nGrowing up, I did all the things American girls love to do like ballet and jump rope, and dreaming of attending \
//   college at Stanford University.   \n\nMy immigrant heritage even brought me some advantages other girls didn't get, for example, I grew up speaking Portuguese \
//   o my Brasilian side of the family and English on my American side of the family, and Spanish to all my immigrant classmates at my international high school. \
//   \n\nI've called the Bay Area my home since I arrived on the Stanford campus as an engineering student.`,
//   comments: [],
// }, {
//   id: 3,
//   video: require('./../../Assets/videos/candidateVid.mp4'),
//   type: 'article',
//   time: -100,
//   header: 'In-car Footage',
//   text: `Bilingual Hamilton Mixtape rap in support of Immigrants: We Get the Job Done Coalition http://bit.ly/2s6mWAt  #Ham4All #BrazilianAmerican 🎤`,
//   comments: [],
// }, {
// //   id: 3,
// //   photo: require('../img/democracy2.jpg'),
// //   type: 'article',
// //   time: -2446,
// //   header: 'The power of a word',
// //   text: `As a Brazilian immigrant who is lucky enough to have American citizenship, I've always felt the importance of using my voice to stand hand in hand
// //   with, and advocate for, those 11 million who are being kept voiceless by our government’s inability to pass legislation despite overwhelming support by
// //   the American public.`,
// //   comments: [],
// // }, {
//   id: 4,
//   photo: require('./../../Assets/avatars/agatha4.png'),
//   type: 'article',
//   time: -4592,
//   header: 'Meet a Dreamer: Paola',
//   text: `Paola and her family were the first undocumented people I ever met. She was my childhood neighbor and Brazilian like me. We both came to the U.S. \
//   as kids, played the same games together, and both attended local public schools in Miami.  didn’t know Paola was undocumented until she told me after we \
//   graduated from college. It was difficult to begin thinking of her as an undocumented person, because she was my neighbor, my classmate, and walked \
//   alongside me in everything I did. \n\nPaola did nothing wrong nor did I do anything special to merit our differences in citizenship status. But those \
//   differences have shaped who we are and created real hardships for Paola. With the privilege of an American passport, I was able visit the Brasilian \
//   side of my family as a child.  \n\nBut Paola has not left the US since the age of six - not even when her dad was deported to Brazil and unable to re-enter \
//   the U.S. Not being able to visit  with your own father is a painful separation I could not imagine bearing. Today, Paola works for a women’s health \
//   clinic in Colorado, assisting women in need - exactly the kind of friend and neighbor we all want to claim as fellow citizen.`,
//   comments: [],
// }, {
//   id: 5,
//   photo: require('./../../Assets/avatars/agatha3.png'),
//   type: 'article',
//   time: -5665,
//   header: 'My immigrant journey',
//   text: `I was born in Brasil, and immigrated to the US as an infant with my mother, who is one of the glass-ceiling shattering professional women of her \
//   generation - and she did it in not one but two countries! America is a nation of immigrants, so being an immigrant and an American citizen makes me, \
//   in many ways, a very typical American.  Growing up, I did all the things American girls love to do like ballet and jump rope, and dreaming of attending \
//   college at Stanford University.   \n\nMy immigrant heritage even brought me some advantages other girls didn't get, for example, I grew up speaking Portuguese \
//   o my Brasilian side of the family and English on my American side of the family, and Spanish to all my immigrant classmates at my international high school. \
//   \n\nI've called the Bay Area my home since I arrived on the Stanford campus as an engineering student.`,
//   comments: [],
// },
{
  id: 23,
  photo: require('../img/guadido1.jpg'),
  type: 'article1',
  time: -2446,
  header: 'Parlamento Andino',
  text: `Este jueves, el Parlamento Andino acordó reconocer a Juan Guaidó como Presidente encargado de Venezuela. `+
  `\nLa decisión fue tomada en la sesión plenaria realizada este 21 de febrero en Bogotá, Colombia, en la que participaron ` +
  `parlamentarios de Perú, Ecuador, Bolivia, Colombia y Chile, país que estuvo representado por el senador de la UDI Alejandro ` +
  `García Huidobro tras decisión de la Cámara Alta.`,
  comments: [],
},
{
  id: 24,
  photo: require('../img/kamala1.jpg'),
  type: 'article1',
  time: -2446,
  header: 'The Senator I Am Today',
  text: `When I was a young girl, I once spent an afternoon making lemon bars. I found a recipe in one of my mother’s cookbooks and set about beating the eggs, mixing ` +
  `the ingredients, and greasing the pan. \nThe lemon bars turned out beautifully, and I was excited to show them off. So I put them on a plate, covered them with Saran ` +
  `Wrap, and walked two doors down to our neighbor, Mrs. Shelton, who was drinking tea and laughing with her sister and my mother. I proudly showed off my creation, ` +
  `and Mrs. Shelton took a big bite.`,
  comments: [],
},
{
  id: 25,
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
  id: 26,
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
