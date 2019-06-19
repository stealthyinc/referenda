export const LEANING =  {
  left:'#d8ecf3',           // 90% light blue: https://www.w3schools.com/colors/colors_picker.asp?colorhex=ADD8E6
  right:'#ffe6ea',          // 95% light pink: https://www.w3schools.com/colors/colors_picker.asp?colorhex=FFC0CB
  neutral:'#f2f2f2',        // 95% light gray: https://www.w3schools.com/colors/colors_picker.asp?colorhex=D3D3D3
  unknown:'#ffffe6'         // 95% light yellow: https://www.w3schools.com/colors/colors_picker.asp?colorhex=FFFF00
}


// TODO: use the voters.js in raw data after regenerating it with leaning data and
//       same house permutations
export const demoVoters = [
  {
    name: 'Jane Sock',
    street: '412 Clinton Ave. Apt. 3',
    city: 'Alameda',
    zip: '94501',
    leaning: LEANING.unknown
  },
  {
    name: 'Zhougamesh Farfoot',
    street: '952 San Jose Ave.',
    city: 'Alameda',
    zip: '94501',
    leaning: LEANING.left
  },
  {
    name: 'Prabu Mama',
    street: '2045 Clinton Ave. Apt. 34',
    city: 'Alameda',
    zip: '94501',
    leaning: LEANING.unknown
  },
  {
    name: 'Stacey Sox',
    street: '851 Encinal Ave. Apt. 7',
    city: 'Alameda',
    zip: '94501',
    leaning: LEANING.neutral
  },
  {
    name: 'Jin Girinker',
    street: '60 Bay Farm Court',
    city: 'Alameda',
    zip: '94501',
    leaning: LEANING.neutral
  },
  {
    name: 'Beer Swiller',
    street: '62 Bay Farm Court',
    city: 'Alameda',
    zip: '94501',
    leaning: LEANING.right
  },
  {
    name: 'Hector Garcia',
    street: '900 Park St. Apt 22',
    city: 'Alameda',
    zip: '94501',
    leaning: LEANING.left
  },
  {
    name: 'Genie Garcia',
    street: '900 Park St. Apt 22',
    city: 'Alameda',
    zip: '94501',
    leaning: LEANING.left
  },
  {
    name: 'Loretta Garcia',
    street: '900 Park St. Apt 22',
    city: 'Alameda',
    zip: '94501',
    leaning: LEANING.left
  },
]


export const QUESTION_TYPE = {
  RANGE: 0,
  CHOICE: 1,
  TEXT: 2,
  VALUE: 3
}


let qid = 0
function getUniqueQuestionId() {
  return qid++
}


export const questionaire = [
  {
    type: QUESTION_TYPE.RANGE,
    id: getUniqueQuestionId(),
    question: 'Which political party best represents your interests and ideas presently?',
    min: {
      label: 'Democrat',
      color: 'blue'
    },
    middle: {             // optional
      label: 'Neither',
      color: 'gray'
    },
    max: {
      label: 'Republican',
      color: 'red'
    },
    steps: 10,
    response: ''
  },
  {
    type: QUESTION_TYPE.RANGE,
    id: getUniqueQuestionId(),
    question: 'Which political party best are you a member of?',
    min: {
      label: 'Democrat',
      color: 'blue'
    },
    middle: {             // optional
      label: 'Green',
      color: 'green'
    },
    max: {
      label: 'Republican',
      color: 'red'
    },
    steps: 3,
    response: ''
  },
  {
    type: QUESTION_TYPE.RANGE,
    id: getUniqueQuestionId(),
    question: 'How concerned are you about climate change?',
    min: {
      label: 'Unconcerned',
      color: 'white'
    },
    max: {
      label: 'Concerned',
      color: 'red'
    },
    steps: 5,
    response: ''
  },
  {
    type: QUESTION_TYPE.RANGE,
    id: getUniqueQuestionId(),
    question: 'How many people are in your household?',
    steps: 10,
    response: ''
  },
  {
    type: QUESTION_TYPE.CHOICE,
    id: getUniqueQuestionId(),
    question: 'Have you heard of <candidate> prior to this conversation?',
    choices: [
      {
        value: 'Yes',
        color: 'green',
      },
      {
        value: 'No',
        color: 'red'
      }
    ],
    response: ''
  },
  {
    type: QUESTION_TYPE.CHOICE,
    id: getUniqueQuestionId(),
    question: 'Do you plan to vote this election?',
    choices: [
      {
        value: 'Yes'
      },
      {
        value: 'No'
      }
    ],
    response: ''
  },
  {
    type: QUESTION_TYPE.CHOICE,
    id: getUniqueQuestionId(),
    question: 'Are you happy with the current congressional representative for this district?',
    choices: [
      {
        value: 'Yes',
        color: 'green',
      },
      {
        value: 'Undecided',
        color: 'grey',
      },
      {
        value: 'No',
        color: 'red'
      }
    ],
    response: ''
  },
  {
    type: QUESTION_TYPE.CHOICE,
    id: getUniqueQuestionId(),
    question: 'Are you happy with the current congressional representative for this district?',
    choices: [
      {
        value: 'Yes',
        color: 'lightblue',
      },
      {
        value: 'Undecided?',
        color: 'gray',
      },
      {
        value: 'No',
        color: 'lightblue'
      }
    ],
    response: ''
  },
  {
    type: QUESTION_TYPE.CHOICE,
    id: getUniqueQuestionId(),
    question: 'What is your favorite type of cheese?',
    choices: [
      { value: 'cheddar' },
      { value: 'mozarella' },
      { value: 'provolone' },
      { value: 'moterey jack' },
      { value: 'pepper jack' },
      { value: 'muenster' },
      { value: 'I hate cheese' }
    ],
    response: ''
  },
  {
    type: QUESTION_TYPE.TEXT,
    id: getUniqueQuestionId(),
    question: 'Do you have anything you would like to ask <candidate>?',
    response: ''
  },
  {
    type: QUESTION_TYPE.VALUE,
    id: getUniqueQuestionId(),
    question: 'How much student debt do you have?',
    response: ''
  }
]

export const contributionQuestion = {
  type: QUESTION_TYPE.CHOICE,
  id: getUniqueQuestionId(),
  question: 'How will you contribute to the campaign?',
  multipleResponses: true,
  choices: [
    { value: 'Follow the Campaign'},      // --> Modal w/ hard coded twilio text (add qr image pointing to campacampaign.id.blockstack)
    { value: 'Answer a Questionaire' },     // --> Campaign Questionaire
    { value: 'Make a Donation' },           // Nav to donation screen
    { value: 'Get a Sticker' },
    { value: 'Placing a Yard Sign' },
    { value: 'Tell Your Friends' },       // --> Share a link to Referenda Social Campaigning App via email / SMS
    { value: 'Calling People' },
    { value: 'Door to Door Canvassing' },
    { value: 'Purchase Merchandise' },

  ],
  response: ''
}
