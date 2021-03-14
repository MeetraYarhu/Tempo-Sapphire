const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reqString = {
    type: String,
    required: true
}

const worldSchema = new Schema ({
    _id: reqString,
    name: reqString,
    shorthand: reqString
})

const World = mongoose.model('World', worldSchema)
module.exports = World;