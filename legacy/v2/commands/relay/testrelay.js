const {
    Command
} = require('discord.js-commando');
const {
    MessageAttachment
} = require('discord.js');
const fs = require('fs');
const path = require('path');
const locations = require('@util/locations.json');
const allWorlds = require('@util/worlds.json');
const speeds = require('@util/speeds.json');
const guildStuff = require('@util/guildstuff.json');
const Discord = require('discord.js');

module.exports = class sendMessageCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'testrelay',
            group: 'relay',
            memberName: 'testrelay',
            description: 'Send a relay to another guild',
            argsType: 'multiple',
            guildOnly: true,
            userPermissions: ['ATTACH_FILES']
        });
    }
    run(message, args) {

        const allGuildName = guildStuff.map(obj => obj.guild[0].name);
        const allGuildID = guildStuff.map(obj => obj.guild[0].guildid);
        const allChannelID = guildStuff.map(obj => obj.guild[0].channelid);
        const allTrainRoleID = guildStuff.map(obj => obj.guild[0].trainroleid)
        const guildList = this.client.guilds.cache.array()

        /* const specificChannel = '785789582419558400' // ID of command center
        const channelID = message.channel.id
        if (channelID !== specificChannel) {
            return message.reply('You can\'t use that command in this channel!')
        } */

        if (args.length !== 3) { // send appropriate error if arguments are not sufficient length
            let errorReply = `Incorrect number of inputs, ${message.author}!`;
            errorReply += '\nThe proper usage would be: `~relay <world> <aetheryte> <speed>`';
            message.channel.send(errorReply);
        } else if (args[0].length < 3 || args[1].length < 2 || args[2].length < 2) {
            let errorReply = `World must be at least 3 characters, location and speed must be at least 2, ${message.author}!`;
            errorReply += '\nThe proper usage would be: `~relay <world> <aetheryte> <speed>`';
            message.channel.send(errorReply);
        } else {

            // Defining arguments
            const worldName = args[0].toLowerCase();
            const locationName = args[1].toLowerCase();
            const trainSpeed = args[2].toLowerCase();
            // Mapping arrays to run checks against

            // Mapping objects from locations.json to local arrays
            const aetheryteNames = locations.map(obj => obj.aetheryte[0].name);
            const aetheryteAliases = locations.map(obj => obj.aetheryte[0].aliases);
            const aetheryteAllAliases = [];

            // Destination channel for relay
            const destination = message.client.channels.cache.get('785777005055442944'); // ID for relay channel

            // change this so the locations.json can just match lower case and delete these variables
            const locFirstChar = locationName.charAt(0).toUpperCase();
            const locRestChar = locationName.slice(1);
            const locTitle = locFirstChar.concat(locRestChar);

            // Mega array of all aetheryte aliases
            for (let i = 0; i < aetheryteAliases.length; i++) {
                aetheryteAllAliases.push(...aetheryteAliases[i]);
            }

            // Mapping objects from speeds.json to local arrays
            const speedTypes = speeds.map(obj => obj.speed[0].name);
            const speedDescriptions = speeds.map(obj => obj.speed[0].description);
            const speedAliases = speeds.map(obj => obj.speed[0].aliases);
            const speedRoleIDs = speeds.map(obj => obj.speed[0].roleid);
            const speedAllAliases = [];

            // Mega array of all speed aliases
            for (let i = 0; i < speedAliases.length; i++) {
                speedAllAliases.push(...speedAliases[i]);
            }

            // check new local world arrays for substring, match index and set name
            const worldInputSubstr = worldName.substr(0, 3);
            if (!aetheryteAllAliases.includes(locTitle) && !speedAllAliases.includes(trainSpeed)) {
                let errorReply = `Invalid aetheryte and speed, ${message.author}!`;
                errorReply += '\nThe proper usage would be: `~relay <world> <aetheryte> <speed>`';
                message.channel.send(errorReply);
            } else if (!aetheryteAllAliases.includes(locTitle)) {
                let errorReply = `Invalid aetheryte, ${message.author}!`;
                errorReply += '\nThe proper usage would be: `~relay <world> <aetheryte> <speed>`';
                message.channel.send(errorReply);
            } else if (!speedAllAliases.includes(trainSpeed)) {
                let errorReply = `Invalid speed, ${message.author}!`;
                errorReply += '\nThe proper usage would be: `~relay <world> <aetheryte> <speed>`';
                message.channel.send(errorReply);
            } else {

                const worldSelection = allWorlds.worlds.find(obj => obj.shorthand === worldInputSubstr)

                // Embed that will be used to confirm, then sent as the relay
                const relayEmbed = new Discord.MessageEmbed()
                    .setColor('006CFF')
                    .setTitle('ShB hunt train starting!')
                    .setAuthor(`Relayed by: ${message.author.username}`, message.author.avatarURL())
                    .addFields({
                        name: ':earth_americas: World',
                        value: worldSelection.name,
                        inline: true,
                    })
                    .setImage('')
                    .setFooter(`Relay sent from ${message.guild.name}.`);

                // Change embed color based on world
                // test
                let colorDict = {
                    beh: "af53d4", // purple
                    exc: "f5df18", // gold
                    exo: "18f5b3", // sea green
                    fam: "0037cf", // dark blue
                    hyp: "e4eef2", // silver
                    lam: "fa2d60", // red/pink
                    lev: "00C1FF", // cyan
                    ult: "2c2f33", // black
                }
                let color = colorDict[worldInputSubstr]
                relayEmbed.setColor(color)

                const aetheryteImages = fs.readdirSync('images/shbAetherytes');

                // Loop through aetherytes to find matching index
                for (let i = 0; i < aetheryteAliases.length; i++) {
                    for (let k = 0; k < aetheryteAliases[i].length; k++) {
                        if (aetheryteAliases[i][k].includes(locTitle)) {
                            const tempIndexName = aetheryteAliases[i][0];
                            const tempIndex = aetheryteNames.indexOf(tempIndexName);
                            // const tempUrl = aetheryteUrls[tempIndex];
                            const chosenFile = aetheryteImages[tempIndex];
                            const rid = 'shbAetherytes/' + chosenFile;
                            const ridof = rid.replace('shbAetherytes/', '');

                            relayEmbed.attachFiles(`images/shbAetherytes/${ridof}`);
                            relayEmbed.addFields({
                                name: 'Location',
                                value: tempIndexName,
                                inline: true,
                            });
                            relayEmbed.setImage(`attachment://${ridof}`);
                            break;
                        }
                    }
                }

                // loop through speed to find matching name, description, and roleid
                for (let i = 0; i < speedAliases.length; i++) {
                    for (let k = 0; k < speedAliases[i].length; k++) {
                        if (speedAliases[i][k].includes(trainSpeed)) {
                            const tempIndexName1 = speedAliases[i][0];
                            const tempIndex1 = speedTypes.indexOf(tempIndexName1);
                            const tempDescription1 = speedDescriptions[tempIndex1];
                            const tempSpeedRoleID = speedRoleIDs[tempIndex1];
                            relayEmbed.addFields({
                                name: 'Speed',
                                value: tempIndexName1,
                                inline: true,
                            }, {
                                name: '\u200B',
                                value: tempDescription1,
                                inline: false,
                            });
                            if (tempSpeedRoleID !== '1234') {
                                for (let i = 0; i < allGuildName.length; i++) {
                                    this.client.channels.cache.get(allChannelID[i]).send(`<@&${allTrainRoleID[i]}> ${worldSelection.roleid[i]} <@&${tempSpeedRoleID}>`, {
                                        embed: relayEmbed,
                                    });
                                }
                            }
                        } else {
                            for (let i = 0; i < allGuildName.length; i++) {
                                this.client.channels.cache.get(allChannelID[i]).send(`<@&${allTrainRoleID[i]}> ${worldSelection.roleid[i]}`, {
                                    embed: relayEmbed,
                                });
                            }
                        }
                        message.channel.send(`Your relay was sent, ${message.author}!`);
                        break;
                    }
                    break;
                }
            }
        }
    }
}