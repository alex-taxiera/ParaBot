const func = require('./common.js')
const config = require('../config.json')
const req = require('request-promise')

let baseReq = req.defaults({
  baseUrl: 'https://developer-paragon.epicgames.com/v1/',
  headers: { 'X-Epic-ApiKey': config.paragonKey },
  json: true
})

let heroes = new Map()
let cards = new Map()

module.exports = {
  key: config.paragonKey,
  buildMaps: function () {
    baseReq('heroes')
    .then((response) => {
      response.forEach((hero) => {
        heroes.set(hero.name.toLowerCase(), hero.id)
      })
    })
    .catch((err) => {
      func.log('error getting heroes', 'red', err.message)
    })
    baseReq('cards')
    .then((response) => {
      response.forEach((card) => {
        cards.set(card.name.toLowerCase(), card.id)
      })
    })
    .catch((err) => {
      func.log('error getting cards', 'red', err.message)
    })
  },
  getHero: function (query) {
    let iter = heroes.keys()
    let tmp = iter.next().value
    while (tmp) {
      if (tmp.startsWith(query)) {
        return heroes.get(tmp)
      }
      tmp = iter.next().value
    }
  },
  getCard: function (query) {
    query = query.join(' ')
    let iter = cards.keys()
    let tmp = iter.next().value
    while (tmp) {
      if (tmp.startsWith(query)) {
        return cards.get(tmp)
      }
      tmp = iter.next().value
    }
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
    'attr:hpgen': '__Health Regen__',
    'attr:mpgen': '__Mana Regen__',
    'attr:mp': '__Mana__',
    'attr:hp': '__Health__',
    'attr:lfstl': '__Lifesteal__',
    'attr:physpen': '__Physical Penetration__',
    'attr:enpen': '__Energy Penetration__'
  }
}
