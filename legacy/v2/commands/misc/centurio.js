const {
    Command
} = require('discord.js-commando');
const {
    MessageAttachment
} = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = class CenturioCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'centurio',
            aliases: ['clout', 'prae', 'yeri', 'chunts', 'useless'],
            group: 'misc',
            memberName: 'centurio',
            description: 'Centurio memes',
            guildOnly: true,
        });
    }
    run(message) {
        const files = fs.readdirSync('images/centuriopics');

        const chosenFile = files[Math.floor(Math.random() * files.length)];

        const image = fs.readFileSync(path.join('images/centuriopics', chosenFile));

        const attachment = new MessageAttachment(image);

        message.say('OUR Clout, Comrade', attachment);
    }
}