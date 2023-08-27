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
		// coeurl 1101248423249846372
		if ((message.channelId === '1101248423249846372') && (message.author.bot === false)) {
			// console.log(message.author);
			try {
				const reportsChannel = await message.guild.channels.cache.get('1101248388483272834');
				const mainChannel = await message.guild.channels.cache.get('1101248423249846372');
				const mentionRole = '1121306416389554266';
				// coeurl 1101248388483272834

				// Create Relay Embed
				const relayEmbed = await new EmbedBuilder()
					.setColor('Red')
					.setDescription(message.content)
					.setTimestamp()
					.setFooter({
						text: message.author.username,
						iconURL: message.author.avatarURL(),
					});

				// Send report embed
				await reportsChannel.send({
					content: `<@${message.author.id}> <@&${mentionRole}>`,
					embeds: [relayEmbed],
					allowedMentions: {
						roles: [mentionRole],
					},
				});

				// Define sleep function to allow a delete delay
				const sleep = await function sleep(ms) {
					return new Promise((resolve) => {
						setTimeout(resolve, ms);
					});
				};

				// Respond to the user in the original channel
				const responseEmbed = await new EmbedBuilder()
					.setColor('Green')
					.setDescription(`Thanks for the report <@${message.author.id}>! I've relayed it to our spawners for checking.`);

				await mainChannel.send({
					embeds: [responseEmbed],
				})
					.then(msg => {
						setTimeout(() => msg.delete(), 7500);
					});

				// Delete original message + Response to user
				await sleep(7500);
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