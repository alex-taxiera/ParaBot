const Class = require('../classes/')

module.exports = new Class.Command(
  'help',
  'Displays this message, duh!',
  [],
  async function ({ msg, commands }) {
    let response = 'Available commands:'
    for (let key in commands) {
      if (!commands.hasOwnProperty(key)) {
        continue
      }
      let c = commands[key]
      response += `\n-${key}`
      for (let j = 0; j < c.parameters.length; j++) {
        response += ` <${c.parameters[j]}>`
      }
      response += `: ${c.description}`
    }

    try {
      let dm = await msg.author.getDMChannel()
      dm.createMessage(response)
      return { response: 'Command list sent!' }
    } catch (e) {
      return { response }
    }
  }
)
