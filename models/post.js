const { Schema, model } = require('mongoose')

const schema = new Schema({
  id: {type: Number, required: true},
  title: {type: String, required: true},
  imgurl: {type: String, required: true}
})

module.exports = model('Post', schema)
