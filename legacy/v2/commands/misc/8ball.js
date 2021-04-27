const {
    Command
} = require('discord.js-commando');
const {
    MessageAttachment
} = require('discord.js');
const fs = require('fs');
const path = require('path');
const responses = require('@util/8ballresponses.json');

module.exports = class Magic8ballCommand extends Command {
    constructor(client) {
        super(client, {
            name: '8ball',
            aliases: ['8-ball', 'praeeightball', 'pr8ball', 'pr8-ball', 'prae-ball', 'praeball'],
            group: 'misc',
            memberName: '8ball',
            description: 'Gives a random 8-ball response.',
            guildOnly: true,
        });
    }
    run(message) {

        const responseArray = responses.responses
        const selection = responseArray[Math.floor(Math.random() * responseArray.length)]
        message.reply(selection);
    }
}