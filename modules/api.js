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
  }
}
