const { Listener, CommandOptionsRunTypeEnum } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');

class ReportsListener extends Listener {
	constructor(context, options) {
		super(context, {
			...options,
			once: false,
			runIn: CommandOptionsRunTypeEnum.GuildText,
			requiredClientPermissions: ['ReadMessageHistory', 'ManageMessages'],
			event: 'messageCreate',
		});
	}

	async run(message) {

		if ((message.channelId === '1101248423249846372') && (message.author.bot === false)) {

			try {
				const reportsChannel = await message.guild.channels.cache.get('1101248388483272834');
				// const mentionRole = '1022944281574518846';
				// Create Relay Embed
				const relayEmbed = await new EmbedBuilder()
					.setColor('Red')
					.setAuthor({
						name: message.author.username,
						iconURL: message.author.avatarURL(),
					})
					.addFields({
						name: `Sent a relay from <#${message.channel.id}>:`,
						value: message.content,
					})
					.setTimestamp()
					.setFooter({
						text: `ID: ${message.author.id}`,
					});

				// Send final embed
				await reportsChannel.send({
					// content: `<@&${mentionRole}>`,
					embeds: [relayEmbed],
					/* allowedMentions: {
						roles: [mentionRole],
					}, */
				});

				// Delete original message
				await message.delete().catch(console.error);
			}
			catch (error) {
				console.log(error);
			}
		}
		else {
			// Do Nothing
		}
	}
}

module.exports = {
	ReportsListener,
};