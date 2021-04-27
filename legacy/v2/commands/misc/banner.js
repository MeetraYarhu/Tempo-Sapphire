const {
    Command
} = require('discord.js-commando');
const {
    MessageAttachment
} = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = class BannerCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'banner',
            aliases: ['banners'],
            group: 'misc',
            memberName: 'banner',
            description: 'Posts a random train banner.',
            guildOnly: true,
        });
    }
    run(message) {
        const files = fs.readdirSync('images/banners');

        const chosenFile = files[Math.floor(Math.random() * files.length)];

        const image = fs.readFileSync(path.join('images/banners', chosenFile));

        const attachment = new MessageAttachment(image);

        message.say('Very cool train banner!', attachment);
    }
}