const { Command } = require('eris-boiler')

module.exports = (bot) => new Command(
  bot,
  {
    name: 'card',
    description: 'Display card info (outlander scout 5)',
    options: {
      deleteResponseDelay: 30000
    },
    run: async function ({ bot, msg, params }) {
      let level = 1
      if (!isNaN(params[params.length - 1])) level = params.pop()
      const cardName = params.join(' ')
      const card = await bot.API.getCard(cardName)
      const maxLevel = card.levels.length
      if (isNaN(level) || level > maxLevel || level < 1) {
        level = 1
      }
      const inline = true
      const embed = {
        description: `:heartbeat: [**${card.name}**](https://github.com/alex-taxiera/ParaBot)`,
        thumbnail: { url: card.images[level - 1] },
        fields: [
          { name: 'Rarity', value: `${card.rarity}`, inline },
          { name: 'Affinity', value: `${card.affinity}`, inline }
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
      embed.fields.push({ name: 'Cost', value: cost.join('\n'), inline })

      let info = card.levels[level - 1]
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
        embed.fields.push({ name: 'Stats', value: stats.join('\n'), inline })
      }
      if (card.trait !== 'None') {
        embed.fields.push({ name: 'Trait', value: card.trait, inline })
      }
      if (abilities) {
        embed.fields.push({ name: 'Abilities', value: abilities.join('\n\n') })
      }
      return { embed }
    }
  }
)
