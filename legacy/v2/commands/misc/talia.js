const {
    Command
} = require('discord.js-commando');
const {
    MessageAttachment
} = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = class MeetraCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'talia',
            aliases: ['nevar', 'lial', 'paimon', 'umeshu', 'tiger'],
            group: 'misc',
            memberName: 'talia',
            description: 'Talia and Paimon Gang memes',
            guildOnly: true,
        });
    }
    run(message) {
        if (message.channel.id === '849883391071223808') {
            const files = fs.readdirSync('images/talia');

            const chosenFile = files[Math.floor(Math.random() * files.length)];

            const image = fs.readFileSync(path.join('images/talia', chosenFile));

            const attachment = new MessageAttachment(image);

            message.say(attachment);
        } else {
            message.say("Can't be used in this channel")
        }
    }
}