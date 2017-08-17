const Discordie = require('discordie')
const seedrandom = require('seedrandom')

// project modules
const mods = require('./modules/')
const config = require('./config.json')

var bot = new Discordie({ autoReconnect: true })
module.exports = bot

// connect bot
start()

// randomly select a game every 12 hours
setInterval(function () { setGame() }, 43200000) // 43200000

// events
bot.Dispatcher.on('PRESENCE_UPDATE', e => {
  let member = e.member
  if (member.previousGameName === 'Paragon') {
    mods.func.log(`${member.username} has stopped playing Paragon`, 'cyan')
  } else if (member.gameName === 'Paragon') {
    mods.func.log(`${member.username} has started playing Paragon`, 'cyan')
  }
})

bot.Dispatcher.on('DISCONNECTED', e => {
  mods.func.log('disconnected', 'red', `${e.error}\nRECONNECT DELAY: ${e.delay}`)
})

bot.Dispatcher.on('GUILD_CREATE', e => {
  mods.func.log(`joined ${e.guild.name} guild`, 'green')
})

bot.Dispatcher.on('GUILD_DELETE', e => {
  mods.func.log(`left ${e.guild.name} guild`, 'yellow')
})

bot.Dispatcher.on('GATEWAY_READY', () => {
  mods.func.log('online', 'green')
  setGame()
  mods.api.buildMaps()
})

bot.Dispatcher.on('MESSAGE_CREATE', e => {
  var msg = e.message
  var text = msg.content.toLowerCase()
  if (msg.member && msg.member.id !== bot.User.id && text[0] === '-') {
    mods.cmd.handleCommand(msg, text.substring(1), false)
  }
})

// helpers
function start () {
  const tok = config.token
  if (tok !== '') {
    bot.connect({token: tok})
  } else {
    mods.func.log('no token', 'red')
  }
}

function setGame () {
  let rng = seedrandom()
  let games = config.games
  let game = {
    type: 0,
    name: bot.User.gameName
  }
  while (game.name === bot.User.gameName) {
    game.name = games[Math.floor(rng() * games.length)]
  }
  mods.func.log(`playing ${game.name}`, 'cyan')
  bot.User.setGame(game)
}
