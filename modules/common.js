const moment = require('moment')
const colors = require('colors')

module.exports = {
  log: function (str, color, err) {
    if (typeof str !== 'string') {
      str = str.toString()
    }

    console.log(colors.gray(`${moment().format('MM/DD HH:mm:ss')}`) + ' | ' +
    colors[color](`BZZT ${str.toUpperCase()} BZZT`))
    if (err) {
      console.log(colors.red(err))
    }
  },
  messageHandler: function (response) {
    if (!response || !response.message) { return }
    if (!response.embed) {
      response.message.reply(response.content)
      .then((m) => {
        setTimeout(() => { m.delete() }, response.delay)
      })
      .catch(() => {
        // error
      })
    } else {
      response.message.channel.sendMessage(response.content, false, response.embed)
      .then((m) => {
        setTimeout(() => { m.delete() }, response.delay)
      })
      .catch(() => {
        // error
      })
    }
  },
  can: function (needs, context) {
    if (!context) {
      return false
    }

    return needs.every((need) => {
      let permission = require('../ParaBot.js').User.permissionsFor(context)
      if (context.isGuildText) {
        return permission.Text[need]
      } else if (context.isGuildVoice) {
        return permission.Voice[need]
      }
    })
  }
}
