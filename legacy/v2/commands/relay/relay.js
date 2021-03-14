const {
    Command
} = require('discord.js-commando');
const {
    MessageAttachment
} = require('discord.js');
const fs = require('fs');
const path = require('path');
const locations = require('@util/locations.json');
const worlds = require('@util/worlds.json');
const speeds = require('@util/speeds.json');
const Discord = require('discord.js');

module.exports = class relayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'relay',
            aliases: ['shbrelay'],
            group: 'relay',
            memberName: 'relay',
            description: 'Relay an ShB train.',
            argsType: 'multiple',
            guildOnly: true,
            userPermissions: ['ATTACH_FILES'],
            examples: ['`~relay levi jobb na`']
        });
    }
    run(message, args) {
        const specificChannel = '785789582419558400' // ID of command center
        const channelID = message.channel.id
        if (channelID !== specificChannel) {
            return message.reply('You can\'t use that command in this channel!')
        }

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
            const aetheryteNames = locations.map(obj => obj.aetheryte[0].name);
            // const aetheryteUrls = locations.map(obj => obj.aetheryte[0].url);
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
                    .setTitle('ShB hunt train starting!')
                    .setAuthor(`Relayer: ${message.member.displayName}`, message.author.avatarURL())
                    .addFields({
                        name: ':earth_americas: World',
                        value: relayWorld,
                        inline: true,
                    })
                    .setImage('')
                    .setFooter('Train speed may change due to congestion or attendance.');

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
                                destination.send(`<@&${trainRoleID}> <@&${relayWorldID}> <@&${tempSpeedRoleID}>`, {
                                    embed: relayEmbed,
                                });
                            } else {
                                destination.send(`<@&${trainRoleID}> <@&${relayWorldID}>`, {
                                    embed: relayEmbed,
                                });
                            }
                            message.channel.send(`Your relay was sent, ${message.author}!`);
                            break;
                        }
                    }
                }
            }
        }
    }
}