const Eris = require('eris')
const rng = require('seedrandom')()
const colors = require('colors')
const moment = require('moment')

// project modules
const config = require('./config.json')
const { handleCommand } = require('./modules/commands.js')
const api = require('./modules/api.js')

// connect bot
const tok = config.token
if (tok !== '') {
  var bot = new Eris(tok)
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

bot.on('messageCreate', async (msg) => {
  handleCommand(msg, config, bot)
})

// helpers
function setGame () {
  let games = config.games
  let name = games[Math.floor(rng() * games.length)]
  log(`playing ${name}`, 'cyan')
  bot.editStatus('online', { name })
  setTimeout(setGame.bind(), 43200000) // 43200000
}

function log (str, color, err) {
  if (typeof str !== 'string') {
    str = str.toString()
  }
  console.log(
    colors.gray(`${moment().format('MM/DD HH:mm:ss')}`) + ' | ' + colors[color](
      `BZZT ${str.toUpperCase()} BZZT`
    )
  )
}
