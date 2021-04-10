const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}
const optString = {
    type: String,
    required: false
}
const reqBool = {
    type: Boolean,
    required: true
}
const reqNum = {
    type: Number,
    required: true,
    default: 0,
}

const guildInfoSchema = mongoose.Schema({
    _id: reqString, // Guild ID
    name: reqString, // Guild Name
    channels: {
        commandCenterID: optString,
        ewChannelID: optString,
        shbChannelID: optString,
        sbChannelID: optString
    },
    roles: {
        allTrainRoleID: reqString,
        ewTrainRoleID: optString,
        shbTrainRoleID: optString,
        sbTrainRoleID: optString,
        worldRoles: {
            Behemoth: optString,
            Excalibur: optString,
            Exodus: optString,
            Famfrit: optString,
            Hyperion: optString,
            Lamia: optString,
            Leviathan: optString,
            Ultros: optString
        }
    }
})

module.exports = mongoose.model('guilds', guildInfoSchema)