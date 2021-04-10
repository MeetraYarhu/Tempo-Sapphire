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
    channels: { // Channels to relay to/from
        commandCenterID: optString,
        ewChannelID: optString,
        shbChannelID: optString,
        sbChannelID: optString
    },
    roles: { // Role IDs to ping specific train expansions
        allTrainRoleID: optString,
        ewTrainRoleID: optString,
        shbTrainRoleID: optString,
        sbTrainRoleID: optString,
        worldRoles: { // Role IDs to ping specific worlds
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
}, {
    timestamps: true
})

module.exports = mongoose.model('guilds', guildInfoSchema)