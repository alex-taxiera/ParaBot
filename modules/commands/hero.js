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
  'hero',
  'Display basic hero info (-murdock)',
  [],
  async function (heroName) {
    try {
      let hero = await baseReq(`heroes/summary/${heroName}`)
      let embed = {
        description: `:heartbeat: [**${hero.name}**](https://github.com/alex-taxiera/ParaBot)`,
        thumbnail: { url: encodeURI(`${images}${heroName}.png`) },
        fields: [
          {name: 'Type', value: `${hero.attack}`, inline: true},
          {name: 'Affinities', value: `${hero.affinities.join(', ')}`, inline: true},
          {name: 'Traits', value: `${hero.traits.join(', ')}`},
          {name: 'Basic Attack', value: `${hero.stats.BasicAttack}`, inline: true},
          {name: 'Ability Attack', value: `${hero.stats.AbilityAttack}`, inline: true},
          {name: 'Mobility', value: `${hero.stats.Mobility}`, inline: true},
          {name: 'Durability', value: `${hero.stats.Durability}`, inline: true}
        ]
      }
      return { response: { embed }, delay: 300000 }
    } catch (e) {
      console.error(e)
      return { response: `error requesting hero data for ${heroName}` }
    }
  }
)
