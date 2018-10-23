var https = require('https')

class Paragone {
  constructor () {
    this._host = 'paragoneapi.com'
    this._apiRoute = '/v1/'
    this._store = {
      heroes: {},
      cards: {}
    }
    this._cache = {
      heroes: new Map(),
      cards: new Map()
    }

    Object.keys(this._store).forEach((key) =>
      this._getRequest(key)
        .then((items) =>
          items.forEach((item) => {
            this._store[key][item.name.toLowerCase()] = item.id
          })
        )
        .catch((error) => console.error(key, error)))
    
    this.stringReplace = {
      'status:stun': '__Stun__',
      'status:root': '__Root__',
      'status:slow': '__Slow__',
      'status:bleed': '__Bleed__',
      'attr:physdmg': '__Physical Damage__',
      'attr:endmg': '__Energy Damage__',
      'attr:physar': '__Physical Armor__',
      'attr:enar': '__Energy Armor__',
      'attr:shld': '__Shield__',
      'attr:spd': '__Speed__',
      'attr:hpreg': '__Health Regen__',
      'attr:mpreg': '__Mana Regen__',
      'attr:mp': '__Mana__',
      'attr:hp': '__Health__',
      'attr:lfstl': '__Lifesteal__',
      'attr:physpen': '__Physical Penetration__',
      'attr:enpen': '__Energy Penetration__',
      'attr:cdr': '__Cooldown Reduction__'
    }
  }

  getHero (query) {
    return this._getItem('heroes', query.toLowerCase())
  }

  getHeroName (query) {
    return this._getItemName('heroes', query.toLowerCase())
  }

  getCard (query) {
    return this._getItem('cards', query.toLowerCase())
  }

  getCardName (query) {
    return this._getItemName('cards', query.toLowerCase())
  }

  async _getItem (type, query) {
    const store = this._store[type]
    const id = store[this._getItemName(type, query)]
    let item = this._cache[type].get(id)
    if (!item) {
      item = await this._getRequest(`${type}/${id}`)
      this._cache[type].set(item.id, item)
    }
    return item
  }

  _getItemName (type, query) {
    return Object.keys(this._store[type]).find((key) => key.startsWith(query))
  }

  _getRequest (path) {
    path = encodeURI(this._apiRoute + path)
    return new Promise((resolve, reject) =>
      https.get({ host: this._host, path }, (results) => {
        const chunks = []
        results
          .on('data', (chunk) => chunks.push(chunk))
          .on('end', () => {
            const json = JSON.parse(Buffer.concat(chunks))
            results.statusCode === 200
              ? resolve(json)
              : reject(json)
          })
      }).on('error', reject)
    )
  }
}

module.exports = Paragone
