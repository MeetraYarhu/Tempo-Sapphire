const Discord = require('discord.js');
const {
    Command
} = require('discord.js-commando');
const mongoose = require("mongoose");
const mongo = require('@root/mongo.js')
const userInfoSchema = require('@schemas/users.js');
module.exports = class setRelayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'setrelay',
            aliases: ['relaychannel', 'setrelaychannel'],
            group: 'util',
            memberName: 'setrelay',
            description: 'Sets the channel to recieve ShB relays.',
        });
    }
    run(message, args) {
        const {
            author
        } = message
        const {
            id
        } = author

        const connectToMongoDB = async () => {
            await mongo().then(async (mongoose) => {
                try {
                    console.log('Connected!')
                    await userInfoSchema.findOneAndUpdate({
                        _id: author.id,
                    }, {
                        _id: author.id,
                        tag: author.tag,
                        relayer: true,
                        $inc: {
                            'sbRelayCount': 1,
                            'shbRelayCount': 0
                        }
                    }, {
                        upsert: true,
                        new: true,
                    }).exec()
                } finally {
                    mongoose.connection.close()
                    console.log('Connection closed!')
                }
            })
        }
        message.reply(`${author.id}, ${author.tag}`)
        connectToMongoDB()
    }

}