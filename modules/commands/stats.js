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
  'stats',
  'Display hero base stats',
  ['hero name, level optional (default level is max)'],
  function (msg, params, level) {
    let fullParam = params.join(' ')
    let hero = api.getHero(fullParam)
    if (hero) {
      baseReq(`hero/${hero}`)
      .then((response) => {
        let maxLevel = response.attributesByLevel.length
        if (isNaN(level) || level > maxLevel || level < 0) {
          level = maxLevel - 1
        } else {
          level--
        }
        let stats = response.attributesByLevel[level]
        let basic = response.abilities[0].modifiersByLevel[level]
        let embed = {
          description: `:heartbeat: [**${response.name}**](https://github.com/alex-taxiera/ParaBot)`,
          thumbnail: { url: `https:${response.images.icon}` },
          fields: [
            {name: 'Health', value: `${stats.MaxHealth}`, inline: true},
            {name: 'Mana', value: `${stats.MaxEnergy}`, inline: true},
            {name: 'Health Regen', value: `${stats.HealthRegenRate}`, inline: true},
            {name: 'Mana Regen', value: `${stats.EnergyRegenRate}`, inline: true},
            {name: 'Base Attack Time', value: `${stats.BaseAttackTime}`, inline: true},
            {name: 'Attack Speed', value: `${stats.AttackSpeedRating}`, inline: true},
            {name: 'Basic Attack Damage', value: `${basic.damage}`, inline: true},
            {name: 'Basic Attack Cooldown', value: `${basic.cooldown}`, inline: true},
            {name: 'Basic Penetration', value: `${stats.BasicPenetrationRating}`, inline: true},
            {name: 'Ability Penetration', value: `${stats.AbilityPenetrationRating}`, inline: true},
            {name: 'Basic Resistance', value: `${stats.BasicResistanceRating}`, inline: true},
            {name: 'Ability Resistance', value: `${stats.AbilityResistanceRating}`, inline: true}
          ]
        }
        func.messageHandler(new Class.Response(msg, '', 300000, embed))
      })
      .catch((err) => {
        func.log('error requesting hero data', 'red', err.message)
      })
    } else {
      let str = `No hero named ${fullParam}!`
      return new Class.Response(msg, str)
    }
  }
)
