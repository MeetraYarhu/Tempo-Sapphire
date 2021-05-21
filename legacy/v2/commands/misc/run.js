const {
    Command
} = require('discord.js-commando');
const {
    MessageAttachment
} = require('discord.js');
const mongoose = require("mongoose");
const mongo = require('@root/mongo.js')
const relayerSchema = require('@schemas/relayers.js');
module.exports = class RunCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'run',
            group: 'misc',
            memberName: 'run',
            description: 'Test command',
            guildOnly: true,
            argsType: 'single',
        });
    }
    run(message, args) {
        const author = message.member
        console.log(args);
        console.log(`userid ${message.member.user.id}`)
        console.log(author)
        const connectToMongoDB = async () => {
            await mongo().then(async (mongoose) => {
                try {
                    console.log('Connected to mongodb!')
                    const result = await relayerSchema.exists({
                        userid: author.id
                    })
                    console.log(result)
                    if (result === true) {
                        message.say('command returned true')
                        message.reply(args)
                    } else {
                        message.say('command returned false')
                        message.reply(args)
                    }
                } finally {
                    mongoose.connection.close()
                }
            })
        }
        connectToMongoDB()
    }
};