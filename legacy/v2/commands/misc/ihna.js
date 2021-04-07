const {
    Command
} = require('discord.js-commando');
const {
    MessageAttachment
} = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = class IhnaCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ihna',
            aliases: ['zapiekanki', 'shrimp', 'pringles'],
            group: 'misc',
            memberName: 'ihna',
            description: 's h r i m p',
        });
    }
    run(message) {
        const files = fs.readdirSync('images/ihnapics');

        const chosenFile = files[Math.floor(Math.random() * files.length)];

        const image = fs.readFileSync(path.join('images/ihnapics', chosenFile));

        const attachment = new MessageAttachment(image);

        message.say('hehe :<', attachment);
    }
}