// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');
const {
    MessageAttachment,
} = require('discord.js');
module.exports = {
    name: 'melon',
    aliases: ['watermelon'],
    description: 'Melons.',
    guildOnly: true,
    // eslint-disable-next-line no-inline-comments
    roles: '724477995884216340', // Mod
    args: false,
    usage: '<melon>',
    execute(message) {
        const files = fs.readdirSync('./melonpics');
        console.log(files);

        const chosenFile = files[Math.floor(Math.random() * files.length)];
        console.log(chosenFile);

        const image = fs.readFileSync(path.join('./melonpics', chosenFile));

        const attachment = new MessageAttachment(image);

        message.channel.send(attachment);
    },
};