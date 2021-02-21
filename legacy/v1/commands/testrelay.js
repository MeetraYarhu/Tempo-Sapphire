/* eslint-disable brace-style */
/* eslint-disable no-inline-comments */
const Discord = require('discord.js');
const locations = require('./locations.json');
const worlds = require('./worlds.json');
const speeds = require('./speeds.json');
const fs = require('fs');
const path = require('path');
module.exports = {
    name: 'testrelay',
    description: 'Relay train',
    guildOnly: true,
    usage: '<world> <aetheryte> <speed>',
    roles: '785414898125373441', // Relayer
    args: true,
    channel: '785419531815616552', // Command center channel ID
    execute(message, args) {

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
            const validWorldNames = worlds.map(obj => obj.world[0].name);
            const validWorldShorthand = worlds.map(obj => obj.world[0].shorthand);
            const worldRoleIDs = worlds.map(obj => obj.world[0].roleid);
            // Mapping objects from locations.json to local arrays
            // const aetheryteNames = locations.map(obj => obj.aetheryte[0].name);
            // const aetheryteUrls = locations.map(obj => obj.aetheryte[0].url);
            const aetheryteAliases = locations.map(obj => obj.aetheryte[0].aliases);
            const aetheryteAllAliases = [];

            // Destination channel for relay
            const destination = message.client.channels.cache.get('785419736791253013'); // ID for relay channel

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
            const trainRoleID = '783950640412885013';
            const speedAllAliases = [];

            // Mega array of all speed aliases
            for (let i = 0; i < speedAliases.length; i++) {
                speedAllAliases.push(...speedAliases[i]);
            }

            // check new local world arrays for substring, match index and set name
            const worldInputSubstr = worldName.substr(0, 3);
            if (!validWorldShorthand.includes(worldInputSubstr) && !aetheryteAllAliases.includes(locTitle) && !speedAllAliases.includes(trainSpeed)) {
                let errorReply = `Invalid world name, aetheryte, and speed, ${message.author}!`;
                errorReply += '\nThe proper usage would be: `~relay <world> <aetheryte> <speed>`';
                message.channel.send(errorReply);
            } else if (!validWorldShorthand.includes(worldInputSubstr) && !aetheryteAllAliases.includes(locTitle)) {
                let errorReply = `Invalid world name and aetheryte, ${message.author}!`;
                errorReply += '\nThe proper usage would be: `~relay <world> <aetheryte> <speed>`';
                message.channel.send(errorReply);
            } else if (!validWorldShorthand.includes(worldInputSubstr) && !speedAllAliases.includes(trainSpeed)) {
                let errorReply = `Invalid world name and speed, ${message.author}!`;
                errorReply += '\nThe proper usage would be: `~relay <world> <aetheryte> <speed>`';
                message.channel.send(errorReply);
            } else if (!aetheryteAllAliases.includes(locTitle) && !speedAllAliases.includes(trainSpeed)) {
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
            } else if (!validWorldShorthand.includes(worldInputSubstr)) {
                let errorReply = `Invalid world, ${message.author}!`;
                errorReply += '\nThe proper usage would be: `~relay <world> <aetheryte> <speed>`';
                message.channel.send(errorReply);
            } else {
                const validWorldIndex = validWorldShorthand.indexOf(worldInputSubstr);
                const relayWorld = validWorldNames[validWorldIndex];
                const relayWorldID = worldRoleIDs[validWorldIndex];

                // Embed that will be used to confirm, then sent as the relay
                const relayEmbed = new Discord.MessageEmbed()
                    .setColor('006CFF')
                    .setTitle('Hunt train starting!')
                    .setAuthor(`Relayer: ${message.member.displayName}`, message.author.avatarURL())
                    .addFields({
                        name: ':earth_americas: World',
                        value: relayWorld,
                        inline: true,
                    })
                    .setImage('')
                    .setFooter('Train speed may change due to congestion or attendance.');

                // Change embed color based on world
                if (worldInputSubstr === 'beh') { // red
                    relayEmbed.setColor('FF0000');
                } else if (worldInputSubstr === 'exc') { // gold/yellow
                    relayEmbed.setColor('CDFF00');
                } else if (worldInputSubstr === 'exo') { // dark green
                    relayEmbed.setColor('179905');
                } else if (worldInputSubstr === 'fam') { // dark blue
                    relayEmbed.setColor('0037cf');
                } else if (worldInputSubstr === 'hyp') { // pink
                    relayEmbed.setColor('FF82CC');
                } else if (worldInputSubstr === 'lam') { // light green
                    relayEmbed.setColor('00FF93');
                } else if (worldInputSubstr === 'lev') { // light blue/cyan
                    relayEmbed.setColor('00C1FF');
                } else if (worldInputSubstr === 'ult') { // magenta
                    relayEmbed.setColor('B300F1');
                }
                const aetheryteImages = fs.readdirSync('./shbAetherytes');
                console.log(aetheryteImages);

                // Loop through aetherytes to find matching index
                for (let i = 0; i < aetheryteAliases.length; i++) {
                    for (let k = 0; k < aetheryteAliases[i].length; k++) {
                        if (aetheryteAliases[i][k].includes(locTitle)) {
                            const tempIndexName = aetheryteAliases[i][0];
                            // const tempIndex = aetheryteNames.indexOf(tempIndexName);
                            // const tempUrl = aetheryteUrls[tempIndex];
                            console.log(tempIndexName);
                            const tempImage = fs.readFileSync(path.join('./melonpics', tempIndexName));
                            relayEmbed.addFields({
                                name: 'Location',
                                value: tempIndexName,
                                inline: true,
                            });
                            relayEmbed.setImage(tempImage);
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
                                destination.send(`<@&${trainRoleID}> <@&${relayWorldID}> <@&${tempSpeedRoleID}>`);
                            } else {
                                destination.send(`<@&${trainRoleID}> <@&${relayWorldID}>`);
                            }
                            destination.send(relayEmbed);
                            message.channel.send(`Your relay was sent, ${message.author}!`);
                            break;
                        }
                    }
                }
            }
        }
    },
};