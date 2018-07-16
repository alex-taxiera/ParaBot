const api = require('../api.js')
const Class = require('../classes/')
const req = require('request-promise')
const images = 'https://www.paragoneapi.com/images/cards/'

let baseReq = req.defaults({
  baseUrl: 'https://www.paragoneapi.com/v1/',
  // headers: { 'X-Epic-ApiKey': api.key },
  json: true
})

module.exports = new Class.Command(
  'card',
  'Display card info (-outlander scout 5)',
  ['level optional (default level is 1)'],
  async function (cardName, level) {
    try {
      let card = await baseReq(`cards/${cardName}`)
      let maxLevel = card.levels.length
      if (isNaN(level) || level > maxLevel || level < 1) {
        level = 1
      }

      let embed = {
        description: `:heartbeat: [**${card.name}**](https://github.com/alex-taxiera/ParaBot)`,
        thumbnail: { url: encodeURI(`${images}${cardName}/${level}.png`) },
        fields: [
          {name: 'Rarity', value: `${card.rarity}`, inline: true},
          {name: 'Affinity', value: `${card.affinity}`, inline: true}
        ]
      }

      let cost = []
      if (card.intellectGemCost !== 0) {
        cost.push(`${card.intellectGemCost} Intellect`)
      }
      if (card.vitalityGemCost !== 0) {
        cost.push(`${card.vitalityGemCost} Vitality`)
      }
      if (card.dexterityGemCost !== 0) {
        cost.push(`${card.dexterityGemCost} Agility`)
      }
      if (card.goldCost !== 0) {
        cost.push(`${card.goldCost} Gold`)
      }
      embed.fields.push({ name: 'Cost', value: cost.join('\n'), inline: true })

      let info = card.levels[level - 1] // move this back down once iconImages has pictures again
      let stats = []
      let abilities = []
      if (info.basicAttributes) {
        info.basicAttributes.forEach((attribute) => {
          stats.push(`${attribute.name}: ${attribute.value}`)
        })
      }
      if (info.abilities) {
        info.abilities.forEach((ability) => {
          let skill = `**${ability.name}:** ${ability.description}`
          if (ability.cooldown) {
            skill += `\n**Cooldown:** ${ability.cooldown.match(/> (.+)$/)[1]}`
          }
          if (ability.manacost) {
            skill += `\n**Mana Cost:** ${ability.manacost.match(/> (.+)$/)[1]}`
          }
          abilities.push(skill)
        })
      }
      if (stats) {
        embed.fields.push({ name: 'Stats', value: stats.join('\n'), inline: true })
      }
      if (card.trait !== 'None') {
        embed.fields.push({ name: 'Trait', value: card.trait, inline: true })
      }
      if (abilities) {
        embed.fields.push({ name: 'Abilities', value: abilities.join('\n\n') })
      }
      return { response: { embed }, delay: 300000 }
    } catch (e) {
      console.error(e)
      return { response: `error requesting card data for ${cardName}` }
    }
  }
)
