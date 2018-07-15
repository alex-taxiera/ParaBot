const config = require('../config.json')
const req = require('request-promise')
// const fs = require('fs')
// const request = require('request')

let baseReq = req.defaults({
  baseUrl: 'https://paragoneapi.com/v1/',
  // headers: { 'X-Epic-ApiKey': config.paragonKey },
  json: true
})

const heroes = []
const cards = []
/* IMAGE DOWNLOADER */
// let imageDownload = function (uri, filename, callback) {
//   request.head(uri, function (err, res, body) {
//     if (err) console.log(err)
//     console.log('content-type:', res.headers['content-type'])
//     console.log('content-length:', res.headers['content-length'])
//
//     request(uri).pipe(fs.createWriteStream(filename)).on('close', callback)
//   })
// }

module.exports = {
  key: config.paragonKey,
  buildMaps: function () {
    baseReq('heroes')
    .then((response) => {
      response.forEach((hero) => {
        heroes.push(hero.name)
      })
    }).catch(console.error)
    /* GEM DOWNLOADER */
    // baseReq('gem/complete')
    // .then((response) => {
    //   response.forEach((gem) => {
    //     fs.mkdir(`./data/gem_images/${gem.name.toLowerCase()}`, () => {
    //       for (let i = 0; i < gem.levelInfo.length; i++) {
    //         imageDownload(`https:${gem.levelInfo[i].fullGemImages.large}`, `./data/gem_images/${gem.name.toLowerCase()}/${i + 1}.png`, function () {
    //           console.log('done')
    //         })
    //       }
    //     })
    //   })
    // }).catch(console.error)
    baseReq('cards')
    .then((response) => {
      response.forEach((card) => {
        cards.push(card.name)
      })
    }).catch(console.error)
  },
  getHero: function (query) {
    const hero = heroes.filter((hero) => hero.startsWith(query))
    if (hero.length > 0) return hero[0]
    // let iter = heroes.keys()
    // let tmp = iter.next().value
    // while (tmp) {
    //   if (tmp.startsWith(query)) {
    //     return heroes.get(tmp)
    //   }
    //   tmp = iter.next().value
    // }
  },
  getCard: function (query) {
    const card = cards.filter((hero) => hero.startsWith(query))
    if (card.length > 0) return card[0]
    // let iter = cards.keys()
    // let tmp = iter.next().value
    // while (tmp) {
    //   if (tmp.startsWith(query)) {
    //     return cards.get(tmp)
    //   }
    //   tmp = iter.next().value
    // }
  },
  stringReplace: {
    'status:stun': '__Stun__',
    'status:root': '__Root__',
    'status:slow': '__Slow__',
    'status:bleed': '__Bleed__',
    'attr:physdmg': '__Physical Damage__',
    'attr:endmg': '__Energy Damage__',
    'attr:physar': '__Physical Armor__',
    'attr:enar': '__Energy Armor__',
    'attr:shld': '__Shield__',
    'attr:spd': '__Speed__',
    'attr:hpreg': '__Health Regen__',
    'attr:mpreg': '__Mana Regen__',
    'attr:mp': '__Mana__',
    'attr:hp': '__Health__',
    'attr:lfstl': '__Lifesteal__',
    'attr:physpen': '__Physical Penetration__',
    'attr:enpen': '__Energy Penetration__',
    'attr:cdr': '__Cooldown Reduction__'
  }
}
