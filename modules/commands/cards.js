const api = require('../api.js')
const func = require('../common.js')
const Class = require('../classes/')
const req = require('request-promise')

let baseReq = req.defaults({
  baseUrl: 'https://developer-paragon.epicgames.com/v1/',
  headers: { 'X-Epic-ApiKey': api.key },
  json: true
})

module.exports = new Class.Command(
  'cards',
  'Display all card names (only available until v42 patch)',
  [],
  function (msg) {
    baseReq('cards/complete')
    .then((response) => {
      let cards = {}
      response.forEach((card) => {
        if (!cards[card.affinity]) {
          cards[card.affinity] = []
        }
        cards[card.affinity].push(card.name)
      })
      let str = ''
      for (let list in cards) {
        if (str) {
          str += '\n\n'
        }
        str += `**${list}:**`
        cards[list].forEach((card) => {
          str += `\n${card}`
        })
      }

      msg.member.openDM()
      .then(dm => {
        dm.sendMessage(str)
      })
    })
    .catch((err) => {
      func.log('error getting cards', 'red', err.message)
    })
  }
)
