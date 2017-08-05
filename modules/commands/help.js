const Class = require('../classes/')

module.exports = new Class.Command(
  'help',
  'Displays this message, duh!',
  [],
  function (msg, commands) {
    let str = 'Available commands:'
    for (let key in commands) {
      if (!commands.hasOwnProperty(key)) {
        continue
      }
      let c = commands[key]
      str += `\n-${key}`
      for (let j = 0; j < c.parameters.length; j++) {
        str += ` <${c.parameters[j]}>`
      }
      str += `: ${c.description}`
    }
    msg.member.openDM()
    .then(dm => {
      dm.sendMessage(str)
    })
    let retStr = 'Command list sent!'
    return new Class.Response(msg, retStr)
  }
)
