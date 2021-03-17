const Discord = require('discord.js');
const locations = require('@util/sblocations.json');
const allWorlds = require('@util/worlds.json');
const guildStuff = require('@util/guildstuff.json');
const fs = require('fs');
const {
    Command
} = require('discord.js-commando');
const {
    MessageAttachment
} = require('discord.js');
module.exports = class sbrelayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'sbrelay',
            group: 'relay',
            memberName: 'sbrelay',
            description: 'Relay an SB train.',
            argsType: 'multiple',
            guildOnly: true,
            userPermissions: ['ATTACH_FILES'],
            examples: ['`~sbrelay exo dawn`']
        });
    }
    run(message, args) {

        const allGuildName = guildStuff.map(obj => obj.guild[0].name);
        const allGuildID = guildStuff.map(obj => obj.guild[0].guildid);
        const allChannelID = guildStuff.map(obj => obj.guild[0].channelid);
        const allSbChannelID = guildStuff.map(obj => obj.guild[0].sbchannelid);
        const allTrainRoleID = guildStuff.map(obj => obj.guild[0].sbtrainroleid)
        const commandCenterID = guildStuff.map(obj => obj.guild[0].commandcenter)
        const guildList = this.client.guilds.cache.array()

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

            // Mapping objects from sblocations.json to local arrays
            const aetheryteNames = locations.map(obj => obj.aetheryte[0].name);
            const aetheryteAliases = locations.map(obj => obj.aetheryte[0].aliases);
            const aetheryteAllAliases = [];

            // change this so the locations.json can just match lower case and delete these variables
            const locFirstChar = locationName.charAt(0).toUpperCase();
            const locRestChar = locationName.slice(1);
            const locTitle = locFirstChar.concat(locRestChar);

            // Mega array of all aetheryte aliases
            for (let i = 0; i < aetheryteAliases.length; i++) {
                aetheryteAllAliases.push(...aetheryteAliases[i]);
            }


            // check new local world arrays for substring, match index and set name
            const worldInputSubstr = worldName.substr(0, 3);
            if (!aetheryteAllAliases.includes(locTitle)) {
                let errorReply = `Invalid aetheryte, ${message.author}!`;
                errorReply += '\nThe proper usage would be: `~relay <world> <nearest aetheryte>`';
                message.channel.send(errorReply);
            } else {


                const worldSelection = allWorlds.worlds.find(obj => obj.shorthand === worldInputSubstr)

                // Embed that will be used to confirm, then sent as the relay
                const relayEmbed = new Discord.MessageEmbed()
                    .setColor('006CFF')
                    .setTitle('Stormblood hunt train starting!')
                    .setAuthor(`Relayer: ${message.member.displayName}`, message.author.avatarURL())
                    .addFields({
                        name: ':earth_americas: World',
                        value: worldSelection.name,
                        inline: true,
                    })
                    .setImage('')
                    .setFooter(`Relay sent from ${message.guild.name}.`);

                // Change embed color based on world
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

                const aetheryteImages = fs.readdirSync('images/sbAetherytes');

                // Loop through aetherytes to find matching index
                for (let i = 0; i < aetheryteAliases.length; i++) {
                    for (let k = 0; k < aetheryteAliases[i].length; k++) {
                        if (aetheryteAliases[i][k].includes(locTitle)) {
                            const tempIndexName = aetheryteAliases[i][0];
                            const tempIndex = aetheryteNames.indexOf(tempIndexName);
                            const ridof = aetheryteImages[tempIndex];

                            relayEmbed.attachFiles(`images/sbAetherytes/${ridof}`);
                            relayEmbed.addFields({
                                name: 'Nearest Aetheryte',
                                value: tempIndexName,
                                inline: true,
                            });
                            relayEmbed.setImage(`attachment://${ridof}`);
                            for (let i = 0; i < allGuildName.length; i++) {
                                this.client.channels.cache.get(allSbChannelID[i]).send(`<@&${allTrainRoleID[i]}> ${worldSelection.roleid[i]}`, {
                                    embed: relayEmbed,
                                });
                                this.client.channels.cache.get(commandCenterID[i]).send(`An SB train on ${worldSelection.name} was relayed by ${message.member.displayName} from the ${message.guild.name} Discord.`);
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
};