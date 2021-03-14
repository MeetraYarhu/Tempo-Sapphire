const {
    Command
} = require('discord.js-commando');
const {
    MessageAttachment
} = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = class MattCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'matt',
            aliases: ['idiot', 'chaser'],
            group: 'misc',
            memberName: 'matt',
            description: 'Posts a random picture of Matt.',
        });
    }
    run(message) {
        const files = fs.readdirSync('images/mattpictures');

        const chosenFile = files[Math.floor(Math.random() * files.length)];

        const image = fs.readFileSync(path.join('images/mattpictures', chosenFile));

        const attachment = new MessageAttachment(image);

        message.say('Matt-Greene', attachment);
    }
}