const Discord = require('discord.js');
const allLocations = require('@util/sblocations.json');
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
            description: 'Relay an SB train to all connected Discord servers',
            argsType: 'multiple',
            guildOnly: true,
            userPermissions: ['ATTACH_FILES'],
            examples: ['`~sbrelay exo dawn`']
        });
    }
    run(message, args) {
        const {
            author
        } = message
        // Set relayer info to data base,tracking relay count and other info
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
            const locationName = args[1].toLowerCase();

            // Locate location configuration from alias input
            const locationSelection = allLocations.aetherytes.find(obj => obj.aliases.includes(locationName.toLowerCase()));

            // Locate world configuration from alias input
            const worldInputSubstr = worldName.substr(0, 3);
            const worldSelection = allWorlds.worlds.find(obj => obj.shorthand === worldInputSubstr)

            if (!worldSelection) {
                let errorReply = `Invalid world, ${message.author}!`;
                errorReply += '\nThe proper usage would be: `~relay <world> <nearest aetheryte>`';
                message.channel.send(errorReply);
            } else {
                // Embed that will be used to confirm, then sent as the relay
                const relayEmbed = new Discord.MessageEmbed()
                    .setColor('006CFF')
                    .setTitle('<:hunt:830145867599446087> Stormblood hunt train starting!')
                    .setDescription(`Relay sent from the ${message.guild.name} discord.`)
                    .addFields({
                        name: `:earth_americas: **${worldSelection.name}**`,
                        value: `<:aetheryte:829954982866190337> **${locationSelection.name}**`,
                        inline: true,
                    }, {
                        name: `<:discord:830133926566559824> ${message.guild.name}`,
                        value: `📣 **${message.member.displayName}**`,
                        inline: true,
                    }, )
                    .attachFiles(`images/sbAetherytes/${locationSelection.filename}`)
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

                for (let i = 0; i < guildStuff.guilds.length; i++) {
                    this.client.channels.cache.get(guildStuff.guilds[i].sbchannelid).send(`${worldSelection.name} SB train starting at ${locationSelection.name}\n<@&${guildStuff.guilds[i].sbtrainroleid}> ${worldSelection.roleid[i]}`, {
                        embed: relayEmbed,
                    });
                    this.client.channels.cache.get(guildStuff.guilds[i].commandcenter).send(`An SB train on ${worldSelection.name} was relayed by ${message.member.displayName} from the ${message.guild.name} Discord.`);
                }
            }
        }
        connectToMongoDB()
    }
};