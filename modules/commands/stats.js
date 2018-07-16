const api = require('../api.js')
const Class = require('../classes/')
const req = require('request-promise')
const images = 'https://www.paragoneapi.com/images/heroes/'

let baseReq = req.defaults({
  baseUrl: 'https://www.paragoneapi.com/v1/',
  // headers: { 'X-Epic-ApiKey': api.key },
  json: true
})

module.exports = new Class.Command(
  'stats',
  'Display hero base stats',
  ['hero name, level optional (default level is max)'],
  async function ({ fullParam, level }) {
    let heroName = api.getHero(fullParam)
    if (heroName) {
      try {
        let { name, attributes, abilities } = await baseReq(`heroes/full/${heroName}`)

        let maxLevel = attributes.length
        if (isNaN(level) || level > maxLevel || level < 0) {
          level = maxLevel
        }
        let stats = attributes[level - 1]
        let basic = abilities[0].modifiersByLevel[level - 1]
        let embed = {
          description: `:heartbeat: [**${name}**](https://github.com/alex-taxiera/ParaBot)`,
          thumbnail: { url: encodeURI(`${images}${heroName}.png`) },
          fields: [
            { name: 'Health', value: `${stats.maxHealth}`, inline: true },
            { name: 'Mana', value: `${stats.maxEnergy}`, inline: true },
            { name: 'Health Regen', value: `${stats.healthRegenRate}`, inline: true },
            { name: 'Mana Regen', value: `${stats.energyRegenRate}`, inline: true },
            { name: 'Base Attack Time', value: `${stats.baseAttackTime}`, inline: true },
            { name: 'Attack Speed', value: `${stats.attackSpeedRating}`, inline: true },
            { name: 'Basic Attack Damage', value: `${basic.damage}`, inline: true },
            { name: 'Basic Attack Cooldown', value: `${basic.cooldown}`, inline: true },
            { name: 'Basic Penetration', value: `${stats.basicPenetrationRating}`, inline: true },
            { name: 'Ability Penetration', value: `${stats.abilityPenetrationRating}`, inline: true },
            { name: 'Basic Resistance', value: `${stats.basicResistanceRating}`, inline: true },
            { name: 'Ability Resistance', value: `${stats.abilityResistanceRating}`, inline: true }
          ]
        }
        return { response: { embed }, delay: 300000 }
      } catch (e) {
        console.error(e)
        return { response: 'error requesting hero data' }
      }
    } else {
      return { response: `no hero named ${fullParam}!` }
    }
  }
)
