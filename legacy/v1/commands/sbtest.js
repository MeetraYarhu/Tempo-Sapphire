/* eslint-disable brace-style */
/* eslint-disable no-inline-comments */
const Discord = require('discord.js');
const locations = require('./sblocations.json');
const worlds = require('./worlds.json');
const fs = require('fs');
module.exports = {
    name: 'sbtest',
    description: 'Relay train',
    guildOnly: true,
    usage: '<world> <nearest aetheryte>',
    roles: '785414898125373441', // Relayer
    args: true,
    channel: '785419531815616552', // Command center channel ID
    execute(message, args) {

        if (args.length < 2) { // send appropriate error if arguments are not sufficient length
            let errorReply = `You need at least two inputs, ${message.author}!`;
            errorReply += '\nThe proper usage would be: `~sbrelay <world> <nearest aetheryte>`';
            message.channel.send(errorReply);
        } else if (args[0].length < 3) {
            let errorReply = `World must be at least 3 characters ${message.author}!`;
            errorReply += '\nThe proper usage would be: `~sbrelay <world> <nearest aetheryte>`';
            message.channel.send(errorReply);
        } else {

            // Defining arguments
            const worldName = args[0].toLowerCase();
            const locationName = (args.slice(1)).join(' ');
            // Mapping arrays to run checks against
            const validWorldNames = worlds.map(obj => obj.world[0].name);
            const validWorldShorthand = worlds.map(obj => obj.world[0].shorthand);
            const worldRoleIDs = worlds.map(obj => obj.world[0].sbroleid);
            // Mapping objects from sblocations.json to local arrays
            const aetheryteNames = locations.map(obj => obj.aetheryte[0].name);
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
            const trainRoleID = '815028860047196181';


            // check new local world arrays for substring, match index and set name
            const worldInputSubstr = worldName.substr(0, 3);
            if (!validWorldShorthand.includes(worldInputSubstr) && !aetheryteAllAliases.includes(locTitle)) {
                let errorReply = `Invalid world name and aetheryte ${message.author}!`;
                errorReply += '\nThe proper usage would be: `~relay <world> <nearest aetheryte>`';
                message.channel.send(errorReply);
            } else if (!validWorldShorthand.includes(worldInputSubstr)) {
                let errorReply = `Invalid world name, ${message.author}!`;
                errorReply += '\nThe proper usage would be: `~relay <world> <nearest aetheryte>`';
                message.channel.send(errorReply);
            } else if (!aetheryteAllAliases.includes(locTitle)) {
                let errorReply = `Invalid aetheryte and speed, ${message.author}!`;
                errorReply += '\nThe proper usage would be: `~relay <world> <nearest aetheryte>`';
                message.channel.send(errorReply);
            } else {
                const validWorldIndex = validWorldShorthand.indexOf(worldInputSubstr);
                const relayWorld = validWorldNames[validWorldIndex];
                const relayWorldID = worldRoleIDs[validWorldIndex];

                const aetheryteImages = fs.readdirSync('./sbAetherytes');

                // Embed that will be used to confirm, then sent as the relay
                const relayEmbed = new Discord.MessageEmbed()
                    .setColor('006CFF')
                    .setTitle('Stormblood hunt train starting!')
                    .setAuthor(`Relayer: ${message.member.displayName}`, message.author.avatarURL())
                    .addFields({
                        name: ':earth_americas: World',
                        value: relayWorld,
                        inline: true,
                    })
                    .setImage('')
                    .setFooter('Stormblood trains tend to move quickly!');

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

                // Loop through aetherytes to find matching index
                for (let i = 0; i < aetheryteAliases.length; i++) {
                    for (let k = 0; k < aetheryteAliases[i].length; k++) {
                        if (aetheryteAliases[i][k].includes(locTitle)) {
                            const tempIndexName = aetheryteAliases[i][0];
                            const tempIndex = aetheryteNames.indexOf(tempIndexName);
                            const ridof = aetheryteImages[tempIndex];

                            relayEmbed.attachFiles(`./sbAetherytes/${ridof}`);
                            relayEmbed.addFields({
                                name: 'Nearest Aetheryte',
                                value: tempIndexName,
                                inline: true,
                            });
                            relayEmbed.setImage(`attachment://${ridof}`);
                            destination.send(`<@&${trainRoleID}> <@&${relayWorldID}>`);
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