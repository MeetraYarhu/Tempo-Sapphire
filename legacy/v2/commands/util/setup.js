const Discord = require('discord.js');
const {
    Command
} = require('discord.js-commando');
const mongoose = require("mongoose");
const mongo = require('@root/mongo.js')
const guildInfoSchema = require('@schemas/guild.js');
module.exports = class setRelayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'setup',
            aliases: ['relaychannel', 'setrelaychannel'],
            group: 'util',
            memberName: 'setup',
            ownerOnly: true,
            description: 'Sets the channel to recieve relays.',
            argsType: 'multiple',
            args: [
                {
                    key: 'commandCenterID',
                    prompt: 'Enter the ID for your command center channel',
                    type: 'string'
                },
                {
                    key: 'ewChannelID',
                    prompt: 'Enter the ID for your ew relay channel',
                    type: 'string'
                },
                {
                    key: 'shbChannelID',
                    prompt: 'Enter the ID for your shb relay channel',
                    type: 'string'
                },
                {
                    key: 'sbChannelID',
                    prompt: 'Enter the ID for your sb relay channel',
                    type: 'string'
                }
            ]
           })
    }
    run(message, { commandCenterID, ewChannelID, shbChannelID, sbChannelID }) {
        const {
            guild,
            channel,
            author
        } = message
        const guildID = guild.id
        console.log(args)
        const {
            id
        } = author

        const connectToMongoDB = async () => {
            await mongo().then(async (mongoose) => {
                try {
                    console.log('Connected!')
                    await guildInfoSchema.findOneAndUpdate({
                        _id: guildID,
                    }, {
                        _id: guildID,
                        channels: {
                            commandCenterID,
                            ewChannelID,
                            shbChannelID,
                            sbChannelID
                        }
                    }, {
                        upsert: true
                    }).exec()
                } finally {
                    mongoose.connection.close()
                    console.log('Connection closed!')
                }
            })
        }
        message.reply('Channel Set!')
        connectToMongoDB()
    }
}