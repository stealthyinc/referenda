const candidates = [
  {
    name: 'Example Campaign',
    id: undefined,
    district: 'NWR-0',
    districtType: 'Congress',
    campaign: {
      title: 'You for Congress 🇺🇸',
      link: 'https://www.app.referenda.io/?wv=1',
    },
    loginPage: {                                        // IntroductionScreen.js
      title: 'You for Congress 🇺🇸',
      description: 'Referenda makes your voice heard by your political leaders for actionable change.',
      photoUrl: '../Assets/images/launch1-your-voice.jpg',
      photo: require('../Assets/images/launch1-your-voice.jpg'),
    },
    fundraising: {
      title: 'You for Congress 🇺🇸',                     // CampaignerMenuScreen.js
      photoUrl: '../Assets/avatars/you.jpg',         // CampaignerMenuScreen.js
      photo: require('../Assets/avatars/you.jpg'),
      label: 'Your - 2020 Campaign',                    // DonationBar.js, SocialBar
      campaignMessage: 'Donation to Your Campaign',     // DonationSagas.js
      receiptMessageWeb: 'Thank you for your donation to this campaign. Here\'s a helpful link for you to donate. We will notify you when the Referenda App is ready!',
      receiptMessage: 'Thank you for your donation to this campaign. We will notify you when the Referenda App is ready!',
      bitcoinUrl: 'https://checkout.opennode.co/p/55769f7d-ebcd-4543-8bbc-bedbe8c9dbe0',
    },
  },
  {
    name: 'Ammar Campa-Najjar',
    id: undefined,
    district: 'CA-50',
    districtType: 'Congress',
    campaign: {
      title: 'Ammar Campa-Najjar for Congress 🇺🇸',
      link: 'https://www.app.referenda.io/campacampa.id.blockstack/?wv=1',
    },
    loginPage: {                                            // IntroductionScreen.js
      title: 'Ammar Campa-Najjar for Congress 🇺🇸',
      description: 'Referenda makes your voice heard by your political leaders for actionable change.',
      photoUrl: '../Assets/images/launch2-candidate.jpg',
      photo: require('../Assets/images/launch2-candidate.jpg'),
    },
    fundraising: {
      title: 'Ammar for Congress 🇺🇸',                       // CampaignerMenuScreen.js
      photoUrl: '../Assets/avatars/campa.jpg',             // CampaignerMenuScreen.js
      photo: require('../Assets/avatars/campa.jpg'),
      label: 'Ammar Campa-Najjar - 2020 Campaign',          // DonationBar.js, SocialBar
      campaignMessage: 'Donation to Ammar Campa-Najjar\'s Campaign',    // DonationSagas.js
      receiptMessageWeb: 'Thank you for your donation to Ammar Campa-Najjar\'s Campaign. Here\'s a helpful link for you to donate. We will notify you when the Referenda App is ready!',
      receiptMessage: 'Thank you for your donation to Ammar\'s Campaign. We will notify you when the Referenda App is ready!',
      bitcoinUrl: 'https://checkout.opennode.co/p/55769f7d-ebcd-4543-8bbc-bedbe8c9dbe0',
    },
  },
  {
    name: 'Nabilah Islam',
    id: undefined,
    district: 'GA-07',
    districtType: 'Congress',
    campaign: {
      title: 'Nabilah Islam for Congress 🇺🇸',
      link: 'https://www.app.referenda.io/nabilahislam.id.blockstack/?wv=1',
    },
    loginPage: {                                            // IntroductionScreen.js
      title: 'Nabilah Islam for Congress 🇺🇸',
      description: 'Referenda makes your voice heard by your political leaders for actionable change.',
      photoUrl: '../Assets/images/launch4-candidate.jpg',
      photo: require('../Assets/images/launch4-candidate.png'),
    },
    fundraising: {
      title: 'Nabilah for Congress 🇺🇸',                        // CampaignerMenuScreen.js
      photoUrl: '../Assets/avatars/nabilah0.jpg',             // CampaignerMenuScreen.js
      photo: require('../Assets/avatars/nabilah0.jpg'),
      label: 'Nabilah Islam - 2020 Campaign',             // DonationBar.js, SocialBar
      campaignMessage: 'Donation to Nabilah Islam\'s Campaign',    // DonationSagas.js
      receiptMessageWeb: 'Thank you for your donation to Nabilah Islam\'s Campaign. Here\'s a helpful link for you to donate. We will notify you when the Referenda App is ready!',
      receiptMessage: 'Thank you for your donation to Nabilah\'s Campaign. We will notify you when the Referenda App is ready!',
      bitcoinUrl: 'https://checkout.opennode.co/p/55769f7d-ebcd-4543-8bbc-bedbe8c9dbe0',
    },
  },
  {
    name: 'Russell Cirincione',
    id: undefined,
    district: 'NJ-06',
    districtType: 'Congress',
    campaign: {
      title: 'Russell Cirincione for Congress 🇺🇸',
      link: 'https://www.app.referenda.io/russcirincione.id.blockstack/?wv=1',
    },
    loginPage: {                                            // IntroductionScreen.js
      title: 'Russell Cirincione for Congress 🇺🇸',
      description: 'Referenda makes your voice heard by your political leaders for actionable change.',
      photoUrl: './CandidateImgs/Russel_Cirincione.jpg',
      photo: require('./CandidateImgs/Russel_Cirincione.jpg'),
    },
    fundraising: {
      title: 'Russell for Congress 🇺🇸',                     // CampaignerMenuScreen.js
      photoUrl: './CandidateImgs/Russel_Cirincione_Avatar.jpg',    // CampaignerMenuScreen.js
      photo: require('./CandidateImgs/Russel_Cirincione_Avatar.jpg',),
      label: 'Russ Cirincione - 2020 Campaign',             // DonationBar.js, SocialBar
      campaignMessage: 'Donation to Russ Cirincione\'s Campaign',    // DonationSagas.js
      receiptMessageWeb: 'Thank you for your donation to Russell Cirincione\'s Campaign. Here\'s a helpful link for you to donate. We will notify you when the Referenda App is ready!',
      receiptMessage: 'Thank you for your donation to Russell\'s Campaign. We will notify you when the Referenda App is ready!',
      bitcoinUrl: 'https://checkout.opennode.co/p/55769f7d-ebcd-4543-8bbc-bedbe8c9dbe0',
    },
  },
  {
    name: 'Agatha Bacelar',
    id: undefined,
    district: 'CA-12',
    districtType: 'Congress',
    campaign: {
      title: 'Agatha Bacelar for Congress 🇺🇸',
      link: 'https://www.app.referenda.io/agatha/?wv=1',
    },
    loginPage: {                                            // IntroductionScreen.js
      title: 'Agatha Bacelar for Congress 🇺🇸',
      description: 'Referenda makes your voice heard by your political leaders for actionable change.',
      photoUrl: '../Assets/images/launch0-candidate.jpg',
      photo: require('../Assets/images/launch0-candidate.jpg'),
    },
    fundraising: {
      title: 'Agatha for Congress 🇺🇸',                      // CampaignerMenuScreen.js
      photoUrl: '../Assets/avatars/agatha2.png',             // CampaignerMenuScreen.js
      photo: require('../Assets/avatars/agatha2.png'),
      label: 'Agatha Bacelar - 2020 Campaign',              // DonationBar.js, SocialBar
      campaignMessage: 'Donation to Agatha Bacelar\'s Campaign',    // DonationSagas.js
      receiptMessageWeb: 'Thank you for your donation to Agatha Bacelar\'s Campaign. Here\'s a helpful link for you to donate. We will notify you when the Referenda App is ready!',
      receiptMessage: 'Thank you for your donation to Agatha\'s Campaign. We will notify you when the Referenda App is ready!',
      bitcoinUrl: 'https://checkout.opennode.co/p/55769f7d-ebcd-4543-8bbc-bedbe8c9dbe0',
    },
  },
  {
    name: 'Jon Hoadley',
    id: undefined,
    district: 'MI-06',
    districtType: 'Congress',
    campaign: {
      title: 'Jon Hoadley for Congress 🇺🇸',
      link: 'https://www.app.referenda.io/relay.stealthy.id/?wv=1',
    },
    loginPage: {                                            // IntroductionScreen.js
      title: 'Jon Hoadley for Congress 🇺🇸',
      description: 'Referenda makes your voice heard by your political leaders for actionable change.',
      photoUrl: '../Assets/images/launch5-candidate.png',
      photo: require('../Assets/images/launch5-candidate.png'),
    },
    fundraising: {
      title: 'Jon Hoadley for Congress 🇺🇸',                      // CampaignerMenuScreen.js
      photoUrl: '../Assets/avatars/hoadley.png',             // CampaignerMenuScreen.js
      photo: require('../Assets/avatars/hoadley.png'),
      label: 'Jon Hoadley - 2020 Campaign',              // DonationBar.js, SocialBar
      campaignMessage: 'Donation to Jon Hoadley\'s Campaign',    // DonationSagas.js
      receiptMessageWeb: 'Thank you for your donation to Jon Hoadley\'s Campaign. Here\'s a helpful link for you to donate. We will notify you when the Referenda App is ready!',
      receiptMessage: 'Thank you for your donation to Jon Hoadley\'s Campaign. We will notify you when the Referenda App is ready!',
      bitcoinUrl: 'https://checkout.opennode.co/p/55769f7d-ebcd-4543-8bbc-bedbe8c9dbe0',
    },
  },
]


class Candidate {
  constructor(anIndex=0) {
    this.setCandidateIndex(anIndex)
  }

  getIndexCandidateMap() {
    const indexCandidateMap = []
    let index = 0
    for (const candidate of candidates) {
      indexCandidateMap.push({
        index: index,
        candidate: `${candidate.name} (${candidate.district} ${candidate.districtType})`
      })
      index++
    }

    return indexCandidateMap
  }

  setCandidateIndex(anIndex=0) {
    this.index = anIndex
    this.data = candidates[this.index]
  }

  getName() {
    return this.data.name
  }

  getDistrict() {
    return this.data.district
  }

  getCampaignTitle() {
    return this.data.campaign.title
  }

  getCampaignLink() {
    return this.data.campaign.link
  }

  getLoginTitle() {
    return this.data.loginPage.title
  }

  getLoginDescription() {
    return this.data.loginPage.description
  }

  getLoginPhotoUrl() {
    return this.data.loginPage.photoUrl
  }

  getLoginPhoto() {
    return this.data.loginPage.photo
  }

  getFundraisingTitle() {
    return this.data.fundraising.title
  }

  getFundraisingPhotoUrl() {
    return this.data.fundraising.photoUrl
  }

  getFundraisingPhoto() {
    return this.data.fundraising.photo
  }

  getFundraisingLabel() {
    return this.data.fundraising.label
  }

  getFundraisingCampaignMessage() {
    return this.data.fundraising.campaignMessage
  }

  getFundraisingReceiptMessageWeb() {
    return this.data.fundraising.receiptMessageWeb
  }

  getFundraisingReceiptMessage() {
    return this.data.fundraising.receiptMessage
  }

  getFundraisingBitcoinUrl() {
    return this.data.fundraising.bitcoinUrl
  }
}

export var candidateData = new Candidate(0)
