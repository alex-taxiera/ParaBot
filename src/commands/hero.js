const { Command } = require('eris-boiler')

module.exports = (bot) => new Command(
  bot,
  {
    name: 'hero',
    description: 'Display basic hero info (murdock)',
    options: {
      deleteResponseDelay: 30000
    },
    run: async function ({ bot, msg, params }) {
      const heroName = params.join(' ')
      let hero
      try {
        hero = await bot.API.getHero(heroName)
      } catch (error) {
        bot.logger.error(error)
        return `error requesting hero data for ${heroName}`
      }
      const inline = true
      const embed = {
        description: `:heartbeat: [**${hero.name}**](https://github.com/alex-taxiera/ParaBot)`,
        thumbnail: { url: bot.API.getHeroImage(heroName) },
        fields: [
          { name: 'Type', value: `${hero.attack}`, inline },
          { name: 'Affinities', value: `${hero.affinities.join(', ')}`, inline },
          { name: 'Traits', value: `${hero.traits.join(', ')}` },
          { name: 'Basic Attack', value: `${hero.stats.BasicAttack}`, inline },
          { name: 'Ability Attack', value: `${hero.stats.AbilityAttack}`, inline },
          { name: 'Mobility', value: `${hero.stats.Mobility}`, inline },
          { name: 'Durability', value: `${hero.stats.Durability}`, inline }
        ]
      }
      return { embed }
    }
  }
)
