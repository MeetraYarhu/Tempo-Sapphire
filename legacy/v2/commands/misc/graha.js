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
            name: 'graha',
            aliases: ['exarch', 'bestboi', 'bestcat', 'goodcat', 'sexycat', 'g\'raha', 'tia'],
            group: 'misc',
            memberName: 'graha',
            description: 'Graha memes',
            guildOnly: true,
        });
    }
    run(message) {
        const files = fs.readdirSync('images/graha');

        const chosenFile = files[Math.floor(Math.random() * files.length)];

        const image = fs.readFileSync(path.join('images/graha', chosenFile));

        const attachment = new MessageAttachment(image);

        message.say('Good Cat', attachment);
    }
}