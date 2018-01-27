const commands = require('./commands/')
const api = require('./api.js')

module.exports.handleCommand = async function (msg, { prefix }, bot) {
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

function response (msg, { response, delay = 10000 }) {
  if (!response.embed) { response = `${msg.author.mention} ${response}` }
  msg.channel.createMessage(response)
  .then((m) => { setTimeout(() => { m.delete() }, delay) })
  .catch(console.error)
}
