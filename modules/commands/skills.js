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
  'skills',
  'Display a hero\'s ability info',
  ['hero name'],
  async function ({ fullParam }) {
    let heroName = api.getHero(fullParam)
    if (heroName) {
      try {
        let { name, abilities } = await baseReq(`heroes/full/${heroName}`)
        let embed = {
          description: `:heartbeat: [**${name}**](https://github.com/alex-taxiera/ParaBot)`,
          thumbnail: { url: encodeURI(`${images}${heroName}.png`) },
          fields: []
        }
        for (let i in abilities) {
          let { name, type, shortDescription, modifiersByLevel } = abilities[i]
          let mods = {}
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
            } else if (api.stringReplace[mod]) {
              return api.stringReplace[mod]
            } else {
              console.error(`no attribute ${mod}`, 'red')
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
        return { response: { embed }, delay: 300000 }
      } catch (e) {
        console.error(e)
      }
    } else {
      return { response: `No hero named ${fullParam}!` }
    }
  }
)
