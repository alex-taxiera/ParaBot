const { Event } = require('eris-boiler')

module.exports = new Event({
  name: 'messageCreate',
  run: async (bot, msg) => {
    let { prefix } = await bot.dbm.getSettings(msg.channel.guild.id)
    if (msg.member && msg.member.id !== bot.user.id && msg.content.startsWith(prefix)) {
      let level = ''
      let fullParam = msg.content.substring(prefix.length)
      const params = fullParam.split(' ')
      if (!isNaN(params[params.length - 1])) level = ' ' + params.pop()
      fullParam = params.join(' ')
      const fullHeroName = bot.API.getHeroName(fullParam)
      const fullCardName = bot.API.getCardName(fullParam)

      if (fullHeroName) {
        msg.content = `${prefix}hero ${fullHeroName}`
      } else if (fullCardName) {
        msg.content = `${prefix}card ${fullCardName}${level}`
      }
    }
    bot.ora.processMessage(bot, msg)
  }
})
