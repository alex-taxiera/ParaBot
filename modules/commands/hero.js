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
  'heroBasic',
  'Display basic hero info (-murdock)',
  [],
  function (msg, hero) {
    baseReq(`hero/${hero}`)
    .then((response) => {
      let embed = {
        description: `:heartbeat: [**${response.name}**](https://github.com/alex-taxiera/ParaBot)`,
        thumbnail: { url: `https:${response.images.icon}` },
        fields: [
          {name: 'Type', value: `${response.attack}`, inline: true},
          {name: 'Affinities', value: `${response.affinities.join(', ')}`, inline: true},
          {name: 'Traits', value: `${response.traits.join(', ')}`},
          {name: 'Basic Attack', value: `${response.stats.BasicAttack}`, inline: true},
          {name: 'Ability Attack', value: `${response.stats.AbilityAttack}`, inline: true},
          {name: 'Mobility', value: `${response.stats.Mobility}`, inline: true},
          {name: 'Durability', value: `${response.stats.Durability}`, inline: true}
        ]
      }
      func.messageHandler(new Class.Response(msg, '', 300000, embed))
    })
    .catch((err) => {
      func.log('error requesting hero data', 'red', err.message)
    })
  }
)
