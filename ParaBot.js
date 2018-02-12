const Eris = require('eris')
const rng = require('seedrandom')()
const colors = require('colors')
const moment = require('moment')

// project modules
const { token, games, prefix } = require('./config.json')
const commands = require('./modules/commands')
const api = require('./modules/api.js')

// connect bot
if (token !== '') {
  var bot = new Eris(token)
  bot.connect()
} else {
  log('no token', 'red')
}

// events
bot.on('disconnect', () => {
  log('disconnected', 'red')
})

bot.on('error', console.error)

bot.on('ready', () => {
  log('online', 'green')
  setGame()
  api.buildMaps()
})

bot.on('messageCreate', handleCommand)

// helpers
function setGame () {
  let name = games[Math.floor(rng() * games.length)]
  log(`playing ${name}`, 'cyan')
  bot.editStatus('online', { name })
  setTimeout(setGame.bind(), 43200000) // 43200000
}

function log (str, color) {
  if (typeof str !== 'string') {
    str = str.toString()
  }
  console.log(
    colors.gray(`${moment().format('MM/DD HH:mm:ss')}`) + ' | ' + colors[color](
      `BZZT ${str.toUpperCase()} BZZT`
    )
  )
}

async function handleCommand (msg) {
  if (msg.member && msg.member.id !== bot.user.id && msg.content.startsWith(prefix)) {
    msg.delete().catch(console.error) // delete invoking message if you can

    let fullParam = msg.content.substring(prefix.length)
    let params = fullParam.split(' ')
    if (!isNaN(params[params.length - 1])) { var level = params.pop() }
    let heroId = api.getHero(fullParam)
    let cardId = api.getCard(fullParam)

    if (heroId) {
      response(msg, await commands['hero'].execute(heroId))
    } else if (cardId) {
      response(msg, await commands['card'].execute(cardId, level))
    }

    // else
    let command = commands[params.splice(0, 1)[0]]
    fullParam = params.join(' ')

    if (command) {
      if (command.name === 'hero' || command.name === 'card') {
        response(msg, { response: `usage: '${prefix + fullParam}'` })
      } else if (params.length < command.parameters.length) {
        response(msg, { response: msg.author.mention + ' insufficient parameters' })
      } else {
        response(msg, await command.execute({ msg, params, fullParam, level, commands }))
      }
    }
  }
}

async function response(msg, { response, delay = 10000 }) {
  if (!response.embed) { response = `${msg.author.mention} ${response}` }
  msg.channel.createMessage(response)
    .then((m) => { setTimeout(() => { m.delete() }, delay) })
    .catch(console.error)
}