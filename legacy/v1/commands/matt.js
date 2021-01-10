// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');
const { MessageAttachment } = require('discord.js');
module.exports = {
    name: 'matt',
    aliases: ['lalafel', 'greene', 'chaser', 'stupid'],
    description: 'Testing aliases and stuff using Matt.',
    guildOnly: true,
    // eslint-disable-next-line no-inline-comments
    roles: '724477995884216340', // Mod
    args: false,
    usage: '<matt>',
    execute(message) {

        const files = fs.readdirSync('./mattpictures');
        console.log(files);

        const chosenFile = files[Math.floor(Math.random() * files.length)];
        console.log(chosenFile);

        const image = fs.readFileSync(path.join('./mattpictures', chosenFile));

        const attachment = new MessageAttachment(image);

        message.channel.send('Matt Greene', attachment);


    },
};

