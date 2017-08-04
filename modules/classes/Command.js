module.exports = class Command {
  constructor (name, description, parameters, execute) {
    this.name = name
    this.description = description
    this.parameters = parameters
    this.execute = execute
  }
}
