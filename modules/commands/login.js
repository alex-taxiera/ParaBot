const api = require('../api.js')

module.exports = {
  command: 'login',
  description: 'Authorize account access for deck and card data',
  parameters: [],
  execute: function (msg) {
    api.login(msg)
  }
}
