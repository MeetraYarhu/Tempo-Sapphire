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
            name: 'meetra',
            aliases: ['feet', 'feetra', 'toes', 'meestra', 'carbuncles', 'yahoo', 'meetrass', 'oppressor', 'dogehello'],
            group: 'misc',
            memberName: 'meetra',
            description: 'Meetra memes',
        });
    }
    run(message) {
        const files = fs.readdirSync('images/meetrapics');

        const chosenFile = files[Math.floor(Math.random() * files.length)];

        const image = fs.readFileSync(path.join('images/meetrapics', chosenFile));

        const attachment = new MessageAttachment(image);

        message.say('Feetra', attachment);
    }
}