const func = require('./common.js')
const commands = require('./commands/')
const api = require('./api.js')
const Response = require('./classes/Response.js')

module.exports = {
  handleCommand: function (msg, text, meme) {
    let params = text.split(' ')
    let level
    if (!isNaN(params[params.length - 1])) {
      level = params.pop()
    }
    let heroId = api.getHero(text)
    let cardId = api.getCard(params)

    if (heroId) {
      func.messageHandler(commands['hero'].execute(msg, heroId))
    } else if (cardId) {
      func.messageHandler(commands['card'].execute(msg, cardId, level))
    } else {
      let command = commands[params[0]]

      if (command) {
        if (params.length - 1 < command.parameters.length) {
          return new Response(msg, 'Insufficient parameters', 10000)
        } else {
          params.splice(0, 1)
          if (command.name === 'help') {
            params = commands
          }
          func.messageHandler(command.execute(msg, params, level))
        }
      } else {
        return
      }
    }

    if (func.can(['MANAGE_MESSAGES'], msg.channel)) {
      msg.delete()
    }
  }
}
