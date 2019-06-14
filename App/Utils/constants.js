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
