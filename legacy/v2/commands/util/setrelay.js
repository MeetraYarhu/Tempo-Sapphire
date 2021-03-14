const {
    Command
} = require('discord.js-commando');
const {
    MessageAttachment
} = require('discord.js');
const fs = require('fs');
const path = require('path');

const relayChannel = require('@schemas/relay-channels')
const mongo = require('@root/mongo')

module.exports = class setRelayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'setrelay',
            aliases: ['relaychannel', 'setrelaychannel'],
            group: 'util',
            memberName: 'setrelay',
            description: 'Sets the channel to recieve ShB relays.',
            userPermissions: ['ADMINISTRATOR'],
            args: [{
                key: 'newChannelID',
                prompt: 'Which channel would you like to set as the relay channel?',
                type: 'string',
            }]
        });
    }
    run = async (message, {
        newChannelID
    }) => {
        //~setrelay <channel id>

        const {
            guild,
            author: relayer
        } = message

        await new relayChannel({
            guildID: guild.id,
            changedByID: staff.id,
            changedByTag: staff.tag,
            channelID: newChannelID,
        }).save()
        message.reply('Channel set!')
    }
}