const mocks = {
  default: {
    text: 'Sali Tzäaaaaaame !'
  },
  baum: {
    text: 'I am a tree...'
  }
}
module.exports = class TextModel {
  constructor () {
    this.model = 'default'
  }

  use () {
    return mocks[this.model]
  }
}
