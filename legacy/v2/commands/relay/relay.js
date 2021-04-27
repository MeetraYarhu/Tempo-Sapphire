const {
    Command
} = require('discord.js-commando');
const {
    MessageAttachment
} = require('discord.js');
const allLocations = require('@util/locations.json');
const allWorlds = require('@util/worlds.json');
const allSpeeds = require('@util/speeds.json');
const guildStuff = require('@util/guildstuff.json');
const Discord = require('discord.js');
const mongoose = require("mongoose");
const mongo = require('@root/mongo.js')
const userInfoSchema = require('@schemas/users.js');
module.exports = class relayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'relay',
            group: 'relay',
            memberName: 'relay',
            description: 'Relay an ShB train to all connected Discord servers.',
            argsType: 'multiple',
            guildOnly: true,
            userPermissions: ['ATTACH_FILES'],
            clientPermissions: ['ATTACH_FILES', 'EMBED_LINKS', 'SEND_MESSAGES', 'ADD_REACTIONS'],
            details: 'Sends a relay to every server connected via Tempo Bot. Will also send a message to any connected \'command centers\', to avoid overlapping relays.',
            format: '<world> <aetheryte> <speed>',
            examples: ['`~relay levi ostall bullet`']
        });
    }
    run(message, args) {
        // Set relayer info to data base,tracking relay count and other info
        const {
            author
        } = message
        // grab user id, look for matching document
        // IF no match, create new one with relay false, and return
        // if match exists, check relayer value
        // if relayer false, return, if true, continue
        const connectToMongoDB = async () => {
            await mongo().then(async (mongoose) => {
                try {
                    console.log('Connected!')
                    await userInfoSchema.findOneAndUpdate({
                        _id: author.id,
                    }, {
                        _id: author.id,
                        tag: author.tag,
                        relayer: true,
                        $inc: {
                            'relayCount': 1
                        }
                    }, {
                        upsert: true,
                        new: true,
                    }).exec()
                } finally {
                    mongoose.connection.close()
                    console.log('Connection closed!')
                }
            })
        }
        const guildList = this.client.guilds.cache.array()

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

            // Locate location configuration from alias input
            const locationSelection = allLocations.aetherytes.find(obj => obj.aliases.includes(locationName));

            // Locate speed configuration from alias input
            const speedSelection = allSpeeds.speeds.find(obj => obj.aliases.includes(trainSpeed));

            // Locate world configuration from alias input
            const worldInputSubstr = worldName.substr(0, 3);
            const worldSelection = allWorlds.worlds.find(obj => obj.shorthand === worldInputSubstr)

            if (!speedSelection) {
                let errorReply = `Invalid speed, ${message.author}!`;
                errorReply += '\nThe proper usage would be: `~relay <world> <aetheryte> <speed>`';
                message.channel.send(errorReply);
            } else {
                // Embed that will be used to confirm, then sent as the relay
                const relayEmbed = new Discord.MessageEmbed()
                    .setColor('006CFF')
                    .setTitle('<:hunt:830145867599446087> Shadowbringers Hunt Train Starting!')
                    .addFields({
                        name: `:earth_americas: **${worldSelection.name}**`,
                        value: `<:aetheryte:829954982866190337> **${locationSelection.name}**\n🚗 **${speedSelection.name}**`,
                        inline: true,
                    }, {
                        name: `<:discord:830133926566559824> ${message.guild.name}`,
                        value: `📣 **${message.member.displayName}**`,
                        inline: true,
                    }, )
                    .attachFiles(`images/shbAetherytes/${locationSelection.filename}`)
                    .setImage(`attachment://${locationSelection.filename}`)
                    .setTimestamp()
                    .setFooter('Tempo Bot Discord: discord.gg/zusBKtp');

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

                for (let i = 0; i < guildList.length; i++) {
                    this.client.channels.cache.get(guildStuff.guilds[i].channelid).send(`<@&${guildStuff.guilds[i].trainroleid}> ${worldSelection.roleid[i]}`, {
                        embed: relayEmbed,
                    });
                    this.client.channels.cache.get(guildStuff.guilds[i].commandcenter).send(`An ShB train on ${worldSelection.name} was relayed by ${message.member.displayName} from the ${message.guild.name} Discord.`);
                }
            }
        }
        connectToMongoDB()
    }
}