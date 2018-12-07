let mongoose = require('mongoose')

mongoose.connect(`mongodb://mongo:27017/w2v`)

let PostTopListSchema = new mongoose.Schema({
    body: Object
})

module.exports = mongoose.model('PostTopList', PostTopListSchema)