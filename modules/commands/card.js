const api = require('../api.js')
const func = require('../common.js')
const Class = require('../classes/')
const req = require('request-promise')

const iconUrl = 'https://developer-paragon-cdn.epicgames.com/Images/'

let baseReq = req.defaults({
  baseUrl: 'https://developer-paragon.epicgames.com/v1/',
  headers: { 'X-Epic-ApiKey': api.key },
  json: true
})

module.exports = new Class.Command(
  'card',
  'Display card info (-outlander scout 5)',
  ['level optional (default level is 1)'],
  function (msg, card, level) {
    baseReq(`card/${card}`)
    .then((response) => {
      let maxLevel = response.levels.length
      if (isNaN(level) || level > maxLevel || level < 0) {
        level = 1
      } else {
        level--
      }

      let embed = {
        description: `:heartbeat: [**${response.name}**](https://github.com/alex-taxiera/ParaBot)`,
        thumbnail: { url: `${iconUrl}${response.iconImage}` },
        fields: [
          {name: 'Rarity', value: `${response.rarity}`, inline: true},
          {name: 'Affinity', value: `${response.affinity}`, inline: true}
        ]
      }

      let cost = ''
      if (response.intellectGemCost !== 0) {
        cost += `${response.intellectGemCost} Intellect Gems`
      }
      if (response.vitalityGemCost !== 0) {
        if (cost) {
          cost += '\n'
        }
        cost += `${response.vitalityGemCost} Vitality Gems`
      }
      if (response.dexterityGemCost !== 0) {
        if (cost) {
          cost += '\n'
        }
        cost += `${response.dexterityGemCost} Dexterity Gems`
      }
      if (response.goldCost !== 0) {
        if (cost) {
          cost += '\n'
        }
        cost += `${response.goldCost} Gold`
      }
      embed.fields.push({name: 'Cost', value: cost, inline: true})
      let info = response.levels[level]
      let stats = ''
      let abilities = ''
      for (let stat in info.BasicAttributes) {
        if (stats) {
          stats += '\n'
        }
        stats += `${stat}: ${info.BasicAttributes[stat]}`
      }
      for (let ability in info.Abilities) {
        if (abilities) {
          abilities += '\n\n'
        }
        abilities += `${ability}: ${info.Abilities[ability].description}`
        if (info.Abilities[ability].cooldown) {
          abilities += '\n' + info.Abilities[ability].cooldown
        }
        if (info.Abilities[ability].manacost) {
          abilities += '\n' + info.Abilities[ability].manacost
        }
      }
      if (stats) {
        embed.fields.push({name: 'Stats', value: stats, inline: true})
      }
      if (response.trait !== 'None') {
        embed.fields.push({name: 'Trait', value: response.trait, inline: true})
      }
      if (abilities) {
        embed.fields.push({name: 'Abilities', value: abilities})
      }
      return func.messageHandler(new Class.Response(msg, '', 300000, embed))
    })
    .catch(err => {
      func.log(`error requesting card ${card}`, 'red', err.message)
    })
  }
)
