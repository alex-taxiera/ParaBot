var https = require('https')

class Paragone {
  constructor () {
    this._host = 'www.paragoneapi.com'
    this._apiRoute = '/v1/'
    this._images = 'https://www.paragoneapi.com/images/'
    this._heroes = []
    this._cards = []
    this._cache = {
      'heroes': new Map(),
      'cards': new Map()
    }
    this.getRequest('heroes')
      .then((heroes) =>
        heroes.forEach((hero) => {
          this._heroes.push(hero.name.toLowerCase())
        })
      )
      .catch((error) => console.error('heroes', error))
    this.getRequest('cards')
      .then((cards) =>
        cards.forEach((card) =>
          this._cards.push(card.name.toLowerCase())
        )
      )
      .catch((error) => console.error('cards', error))
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

  getHeroName (query) {
    return this._heroes.filter((hero) => hero.startsWith(query))[0] || undefined
  }

  getCardName (query) {
    return this._cards.filter((card) => card.startsWith(query))[0] || undefined
  }

  getHeroImage (name) {
    return encodeURI(`${this._images}heroes/${this.getHeroName(name)}.png`)
  }

  getCardImage (name, level) {
    return encodeURI(`${this._images}cards/${this.getCardName(name)}/${level}.png`)
  }

  getHero (name, full) {
    return this.getItem('heroes', 'full/' + this.getHeroName(name))
  }

  getCard (name) {
    return this.getItem('cards', this.getCardName(name))
  }

  async getItem (type, name) {
    let item = this._cache[type].get(name)
    if (!item) {
      item = await this.getRequest(`${type}/${name}`)
      this._cache[type].set(name, item)
    }
    return item
  }

  getRequest (path) {
    path = encodeURI(this._apiRoute + path)
    return new Promise((resolve, reject) =>
      https.get({ host: this._host, path }, (results) => {
        const chunks = []
        results
          .on('data', (chunk) => chunks.push(chunk))
          .on('end', () => {
            const thing = JSON.parse(Buffer.concat(chunks))
            results.statusCode === 200
              ? resolve(thing)
              : reject(thing)
          })
      }).on('error', reject)
    )
  }
}

module.exports = Paragone
