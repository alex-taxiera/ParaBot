const { DataClient } = require('eris-boiler')
const Paragone = require('./Paragone.js')

class ParaBot extends DataClient {
  constructor (data) {
    super(data)
    this.API = new Paragone()
  }
}

module.exports = ParaBot
