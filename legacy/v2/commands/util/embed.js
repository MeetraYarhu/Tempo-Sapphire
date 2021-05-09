const {
    Command
} = require('discord.js-commando');
const {
    MessageAttachment
} = require('discord.js');
const Discord = require('discord.js');

module.exports = class EmbedCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'embed',
            aliases: ['embeds'],
            group: 'util',
            memberName: 'embed',
            description: 'Embed testing',
        });
    }
    run(message) {
        const relayEmbed = new Discord.MessageEmbed()
        .setColor('006CFF')
        .setTitle('<:hunt:830145867599446087> Shadowbringers Hunt Train Starting!')
        //.setAuthor(`Relayed by: ${message.member.displayName} from ${message.guild.name}`, message.author.avatarURL())
        //.setDescription(`:earth_americas: **Behemoth**\n<:aetheryte:829954982866190337> **Tomra**`)
        .addFields({
            name: `:earth_americas: **Behemoth**`,
            value: '<:aetheryte:829954982866190337> **Tomra**\n🚗 **Bullet**',
            inline: true,
        }, {
            name: `<:discord:830133926566559824> ${message.guild.name}`,
            value: `📣 **${message.member.displayName}**`,
            inline: true,
        }, )
        .attachFiles('images/testing/tomra.png')
        .setImage(`attachment://tomra.png`)
        .setTimestamp()
        .setFooter('Tempo Bot Discord: discord.gg/zusBKtp');
        message.channel.send(relayEmbed);
    }
}