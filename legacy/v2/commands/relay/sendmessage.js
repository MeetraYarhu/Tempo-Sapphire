const {
    Command
} = require('discord.js-commando');
const {
    MessageAttachment
} = require('discord.js');
const fs = require('fs');
const path = require('path');
const locations = require('@util/locations.json');
const worlds = require('@util/worlds.json');
const speeds = require('@util/speeds.json');
const guildStuff = require('@util/guildstuff.json');
const Discord = require('discord.js');

module.exports = class sendMessageCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'sendmessage',
            group: 'relay',
            memberName: 'sendmessage',
            description: 'send a message to another guild',
            argsType: 'multiple',
            guildOnly: true,
            userPermissions: ['ATTACH_FILES']
        });
    }
    run(message, args) {
        // ~sendmessage <message>
        // destination = message.client.channels.cache.get('785777005055442944')
        // get a list of all guild id's, and their channels by importing the json
        // loop through each guild, sending the message to each channel

        const allGuildName = guildStuff.map(obj => obj.guild[0].name);
        const allGuildID = guildStuff.map(obj => obj.guild[0].guildid);
        const allChannelID = guildStuff.map(obj => obj.guild[0].channelid);

        const guildList = this.client.guilds.cache.array()

        for (let i = 0; i < allGuildName.length; i++) {
            this.client.channels.cache.get(allChannelID[i]).send(`${args[0]}\nThis message was sent from ${message.guild.name} \nby ${message.author.tag} (${message.author.username}).`);
        }
    }
}