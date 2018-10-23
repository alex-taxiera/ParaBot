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

      const { name, attributesByLevel, abilities } = hero
      const maxLevel = attributesByLevel.length
      if (isNaN(level) || level > maxLevel || level < 0) {
        level = maxLevel
      }
      const stats = attributesByLevel[level - 1]
      const basic = abilities[0].modifiersByLevel[level - 1]
      const inline = true
      const embed = {
        description: `:heartbeat: [**${name}**](https://github.com/alex-taxiera/ParaBot)`,
        thumbnail: { url: hero.icon },
        fields: [
          { name: 'Health', value: `${stats.MaxHealth}`, inline },
          { name: 'Mana', value: `${stats.MaxEnergy}`, inline },
          { name: 'Health Regen', value: `${stats.HealthRegenRate}`, inline },
          { name: 'Mana Regen', value: `${stats.EnergyRegenRate}`, inline },
          { name: 'Base Attack Time', value: `${stats.BaseAttackTime}`, inline },
          { name: 'Attack Speed', value: `${stats.AttackSpeedRating}`, inline },
          { name: 'Basic Attack Damage', value: `${basic.damage}`, inline },
          { name: 'Basic Attack Cooldown', value: `${basic.cooldown}`, inline },
          { name: 'Basic Penetration', value: `${stats.BasicPenetrationRating}`, inline },
          { name: 'Ability Penetration', value: `${stats.AbilityPenetrationRating}`, inline },
          { name: 'Basic Resistance', value: `${stats.BasicResistanceRating}`, inline },
          { name: 'Ability Resistance', value: `${stats.AbilityResistanceRating}`, inline }
        ]
      }
      return { embed }
    }
  }
)
