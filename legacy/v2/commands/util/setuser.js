const {
    Command
} = require('discord.js-commando');
const {
    MessageAttachment
} = require('discord.js');
const Discord = require('discord.js');
const mongoose = require("mongoose");
const mongo = require('@root/mongo.js')
const userInfoSchema = require('@schemas/users.js');
module.exports = class autoRemoveCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'setuser',
            group: 'util',
            memberName: 'setuser',
            description: 'My testing command',
        });
    }
    run(message) {
        const {
            author
        } = message
        const connectToMongoDB = async () => {
            await mongo().then(async (mongoose) => {
                try {
                    console.log('Connected!')
                    const relayerCheck = await userInfoSchema.findOne({
                        _id: author.id
                    })
                    if (relayerCheck.relayer === true) {
                        message.say('You have relayer permissions!')
                        await userInfoSchema.findOneAndUpdate({
                            _id: author.id,
                        }, {
                            _id: author.id,
                            tag: author.tag,
                            $inc: {
                                'relayCount': 1
                            }
                        }, {
                            upsert: true,
                            new: true,
                        }).exec()
                    } else {
                        message.say('You do not have relayer permissions!')
                    }

                } finally {
                    mongoose.connection.close()
                    console.log('Connection closed!')
                }
            })
        }
        connectToMongoDB()
    }
}