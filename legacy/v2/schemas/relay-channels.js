const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true
}

const relayChannelSchema = mongoose.Schema ({
    guildID: reqString,
    changedByID: reqString,
    changedByTag: reqString,
    channelID: reqString,
})

module.exports = mongoose.model('relay-channel', relayChannelSchema)