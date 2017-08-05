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
  'skills',
  'Display a hero\'s ability info',
  ['hero name'],
  function (msg, params) {
    let str = ''
    let fullParam = params.join(' ')
    let hero = api.getHero(fullParam)
    if (hero) {
      baseReq(`hero/${hero}`)
      .then((response) => {
        let embed = {
          description: `:heartbeat: [**${response.name}**](https://github.com/alex-taxiera/ParaBot)`,
          thumbnail: { url: `https:${response.images.icon}` },
          fields: []
        }
        response.abilities.forEach((ability, i) => {
          if (i > 0) {
            let skill = ''
            let stats = {}
            let desc = `${ability.shortDescription}`

            ability.modifiersByLevel.forEach((level, j, array) => {
              for (let p in level) {
                if (j === 0) {
                  stats[p] = ''
                }
                stats[p] += `${level[p]}`
                if (j !== (array.length - 1)) {
                  stats[p] += '/'
                }
              }
            })
            skill += desc.replace(/\{([^}]+)\}/g, (match, p) => {
              if (stats[p]) {
                return `${stats[p]}`
              } else {
                switch (p) {
                  case 'attr:physdmg':
                    return '__Physical Damage__'
                  case 'attr:endmg':
                    return '__Energy Damage__'
                  case 'attr:physar':
                    return '__Physical Armor__'
                  case 'attr:enar':
                    return '__Energy Armor__'
                  case 'attr:shld':
                    return '__Shield__'
                  case 'attr:spd':
                    return '__Speed__'
                  case 'attr:hpgen':
                    return '__Health Regen__'
                  case 'attr:mpgen':
                    return '__Mana Regen__'
                  case 'attr:mp':
                    return '__Mana__'
                  case 'attr:hp':
                    return '__Health__'
                  case 'attr:lfstl':
                    return '__Lifesteal__'
                  case 'attr:physpen':
                    return '__Physical Penetration__'
                  case 'attr:enpen':
                    return '__Energy Penetration__'
                  default:
                    func.log(`no attribute ${p}`, 'red')
                    return p
                }
              }
            })
            if (stats.cooldown) {
              skill += `\r\n• **Cooldown:**\n\t${stats.cooldown}`
            }
            if (stats.energycost) {
              skill += `\r\n• **Mana Cost:**\n\t${stats.energycost}`
            }
            embed.fields.push({name: `${ability.name} (${ability.type})`, value: skill})
          }
        })
        func.messageHandler(new Class.Response(msg, '', 300000, embed))
      })
      .catch((err) => {
        func.log('error requesting hero data', 'red', err.message)
      })
    } else {
      str = `No hero named ${fullParam}!`
      return new Class.Response(msg, str)
    }
  }
)
