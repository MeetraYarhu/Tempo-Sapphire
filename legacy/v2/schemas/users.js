const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}
const reqBool = {
    type: Boolean,
    required: true,
    default: false
}
const reqNum = {
    type: Number,
    required: true,
    default: 0,
}

const userInfoSchema = mongoose.Schema({
    _id: reqString,
    tag: reqString,
    relayer: reqBool,
    relayCount: reqNum,
}, {
    timestamps: true
})

module.exports = mongoose.model('users', userInfoSchema)

//( { relayCount : -1 } )