/* eslint-disable brace-style */
/* eslint-disable no-inline-comments */
const Discord = require('discord.js');
const locations = require('./locations.json');
const worlds = require('./worlds.json');
const speeds = require('./speeds.json');
module.exports = {
        name: 'conduct',
        description: 'Conduct train',
        guildOnly: true,
        roles: '785414898125373441', // Relayer
        args: false,
        execute(message) {
                // add matt greene debugging/easter eggs
                const questions = ['World?', 'Location?', 'Speed?'];

                // Destination channel for relay
                const destination = message.client.channels.cache.get('785419736791253013'); // ID for test-relay channel

                let counter = 0;

                const filter = m => {
                        return m.author.id === message.author.id;
                };

                const collector = new Discord.MessageCollector(message.channel, filter, {
                        max: 3,
                        time: 1000 * 30, // 30s
                        error: ['time'],
                });

                message.channel.send(questions[counter++]);
                collector.on('collect', m => {

                        if (m.content.toLowerCase() == 'stop' && (message.author.id === m.author.id)) {
                                message.reply('Cancelled successfully.');
                                collector.stop();
                        } else if (counter < questions.length) {
                                m.channel.send(questions[counter++]);
                        }
                });

                collector.on('end', collected => {

                        const tempArray = collected.array();

                        // collected constants set to lower case and assigned a variable
                        const worldName = (tempArray[0]).toString().toLowerCase();
                        const locationName = (tempArray[1]).toString().toLowerCase();
                        const trainSpeed = (tempArray[2]).toString().toLowerCase();

                        if (collected.size < questions.length) {
                                message.reply('ran out of time');
                        } else if (worldName.length < 3) {
                                message.reply('world name error');
                        } else if (locationName.length < 2) {
                                message.reply('location name error');
                        } else if (trainSpeed.length < 2) {
                                message.reply('train speed error');
                        } else { // maps objects from worlds.json to local arrays
                                const validWorldNames = worlds.map(obj => obj.world[0].name);
                                const validWorldShorthand = worlds.map(obj => obj.world[0].shorthand);
                                const worldRoleIDs = worlds.map(obj => obj.world[0].roleid);

                                // check new local world arrays for substring, match index and set name
                                const worldInputSubstr = worldName.substr(0, 3);
                                const validWorldIndex = validWorldShorthand.indexOf(worldInputSubstr);
                                const relayWorld = validWorldNames[validWorldIndex];
                                const relayWorldID = worldRoleIDs[validWorldIndex];

                                // change this so the locations.json can just match lower case and delete these variables
                                const locFirstChar = locationName.charAt(0).toUpperCase();
                                const locRestChar = locationName.slice(1);
                                const locTitle = locFirstChar.concat(locRestChar);

                                const trainRoleID = '783950640412885013';

                                // embed that will be used to confirm, then sent as the relay
                                const relayEmbed = new Discord.MessageEmbed()
                                        .setColor('006CFF')
                                        .setTitle('Hunt train starting!')
                                        .setImage('placeholder')
                                        .setAuthor(`Relayer: ${message.member.displayName}`, message.author.avatarURL())
                                        .addFields({
                                                name: ':earth_americas: World',
                                                value: relayWorld,
                                                inline: true,
                                        })
                                        .setFooter('Train speed may change due to congestion or attendance.');

                                // change embed color based on world
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

                                // mapping objects from locations.json to local arrays
                                const aetheryteNames = locations.map(obj => obj.aetheryte[0].name);
                                const aetheryteUrls = locations.map(obj => obj.aetheryte[0].url);
                                const aetheryteAliases = locations.map(obj => obj.aetheryte[0].aliases);
                                // loop through aetherytes to find matching
                                for (let i = 0; i < aetheryteAliases.length; i++) {
                                        for (let k = 0; k < aetheryteAliases[i].length; k++) {
                                                if (aetheryteAliases[i][k].includes(locTitle)) {
                                                        const tempIndexName = aetheryteAliases[i][0];
                                                        const tempIndex = aetheryteNames.indexOf(tempIndexName);
                                                        const tempUrl = aetheryteUrls[tempIndex];
                                                        relayEmbed.addFields({
                                                                name: 'Location',
                                                                value: tempIndexName,
                                                                inline: true,
                                                        });
                                                        relayEmbed.setImage(tempUrl);
                                                        break;
                                                }
                                        }
                                }

                                // mapping objects from speeds.json to local arrays
                                const speedTypes = speeds.map(obj => obj.speed[0].name);
                                const speedDescriptions = speeds.map(obj => obj.speed[0].description);
                                const speedAliases = speeds.map(obj => obj.speed[0].aliases);
                                const speedRoleIDs = speeds.map(obj => obj.speed[0].roleid);
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
                                                        break;
                                                }
                                        }
                                }
                        }

                });

        },
};