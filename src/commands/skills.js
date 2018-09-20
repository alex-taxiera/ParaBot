const { Command } = require('eris-boiler')

module.exports = (bot) => new Command(
  bot,
  {
    name: 'skills',
    description: 'Display a hero\'s ability info',
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
      const { name, abilities } = hero
      const embed = {
        description: `:heartbeat: [**${name}**](https://github.com/alex-taxiera/ParaBot)`,
        thumbnail: { url: bot.API.getHeroImage(heroName) },
        fields: []
      }
      for (const i in abilities) {
        const {
          name,
          type,
          shortDescription,
          modifiersByLevel
        } = abilities[i]
        const mods = {}
        for (const level of modifiersByLevel) {
          for (const mod in level) {
            if (!mods[mod]) {
              mods[mod] = []
            }
            mods[mod].push(`${level[mod]}`)
          }
        }
        for (const mod in mods) {
          if (mods[mod].length !== modifiersByLevel.length) {
            mods[mod].push('/0')
          }
          mods[mod] = mods[mod].join('/')
        }
        let skill = shortDescription.replace(/\{(.+?)}/g, (match, mod) => {
          if (mods[mod]) {
            return `${mods[mod]}`
          } else if (bot.API.stringReplace[mod]) {
            return bot.API.stringReplace[mod]
          } else {
            bot.logger.warn(`no attribute ${mod}`)
            return mod
          }
        })
        if (mods.cooldown) {
          skill += `\r\n• **Cooldown:**\n\t${mods.cooldown}`
        }
        if (mods.energycost) {
          skill += `\r\n• **Mana Cost:**\n\t${mods.energycost}`
        }
        embed.fields.push({ name: `${name} (${type})`, value: skill })
      }
      return { embed }
    }
  }
)
