const {
    Command
} = require('discord.js-commando');
const {
    MessageAttachment
} = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = class MelonCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'melon',
            aliases: ['melons'],
            group: 'misc',
            memberName: 'melon',
            description: 'Posts a random picture of someone holding a melon.',
        });
    }
    run(message) {
        const files = fs.readdirSync('images/melonpics');

        const chosenFile = files[Math.floor(Math.random() * files.length)];

        const image = fs.readFileSync(path.join('images/melonpics', chosenFile));

        const attachment = new MessageAttachment(image);

        message.say(attachment);
    }
}