const { Command } = require('eris-boiler')

module.exports = (bot) => new Command(
  bot,
  {
    name: 'stats',
    description: 'Display hero base stats)',
    options: {
      parameters: ['hero name, level optional (default level is max)'],
      deleteResponseDelay: 30000
    },
    run: async function ({ bot, msg, params }) {
      let level = isNaN(params[params.length - 1]) ? undefined : params.pop()
      const heroName = params.join(' ')
      let hero
      try {
        hero = await bot.API.getHero(heroName)
      } catch (error) {
        bot.logger.error(error)
        return `error requesting hero data for ${heroName}`
      }

      const { name, attributes, abilities } = hero

      const maxLevel = attributes.length
      if (isNaN(level) || level > maxLevel || level < 0) {
        level = maxLevel
      }
      const stats = attributes[level - 1]
      const basic = abilities[0].modifiersByLevel[level - 1]
      const inline = true
      const embed = {
        description: `:heartbeat: [**${name}**](https://github.com/alex-taxiera/ParaBot)`,
        thumbnail: { url: bot.API.getHeroImage(heroName) },
        fields: [
          { name: 'Health', value: `${stats.maxHealth}`, inline },
          { name: 'Mana', value: `${stats.maxEnergy}`, inline },
          { name: 'Health Regen', value: `${stats.healthRegenRate}`, inline },
          { name: 'Mana Regen', value: `${stats.energyRegenRate}`, inline },
          { name: 'Base Attack Time', value: `${stats.baseAttackTime}`, inline },
          { name: 'Attack Speed', value: `${stats.attackSpeedRating}`, inline },
          { name: 'Basic Attack Damage', value: `${basic.damage}`, inline },
          { name: 'Basic Attack Cooldown', value: `${basic.cooldown}`, inline },
          { name: 'Basic Penetration', value: `${stats.basicPenetrationRating}`, inline },
          { name: 'Ability Penetration', value: `${stats.abilityPenetrationRating}`, inline },
          { name: 'Basic Resistance', value: `${stats.basicResistanceRating}`, inline },
          { name: 'Ability Resistance', value: `${stats.abilityResistanceRating}`, inline }
        ]
      }
      return { embed }
    }
  }
)
