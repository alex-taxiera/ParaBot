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
  'card',
  'Display card info (-outlander scout 5)',
  ['level optional (default level is 1)'],
  function (msg, card, level) {
    baseReq(`card/${card}`)
    .then((response) => {
      let maxLevel = response.levels.length
      if (isNaN(level) || level > maxLevel || level < 0) {
        level = 0
      } else {
        level--
      }
      let info = response.levels[level] // move this back down once iconImages has pictures again

      let embed = {
        description: `:heartbeat: [**${response.name}**](https://github.com/alex-taxiera/ParaBot)`,
        thumbnail: { url: `https:${info.images.large}` },
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

      let stats = ''
      let abilities = ''
      info.basicAttributes.forEach((attribute) => {
        if (stats) {
          stats += '\n'
        }
        stats += `${attribute.name}: ${attribute.value}`
      })
      info.abilities.forEach((ability) => {
        if (abilities) {
          abilities += '\n\n'
        }
        abilities += `**${ability.name}:** ${ability.description}`
        if (ability.cooldown) {
          abilities += `\n**Cooldown:** ${ability.cooldown.match(/> (.+)$/)[1]}`
        }
        if (ability.manacost) {
          abilities += `\n**Mana Cost:** ${ability.manacost.match(/> (.+)$/)[1]}`
        }
      })
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
