let mongoose = require('mongoose')

mongoose.connect(`mongodb://mongo:27017/w2v`)

let PostSchema = new mongoose.Schema({
  title: String,
  ups: { type: Number, default: 0 },
  // downvote: { type: Number, default: 0 },
  timestamp : { type: Number, required: true, default: new Date().getTime() },
  score: { type: Number, index: true , default: 0  },
  last_score_update : {type: Date , index: true, default: new Date() }
})


module.exports = mongoose.model('Post', PostSchema)

