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

		// Coeurl #s-rank-reports ID: 1101248423249846372
		// bot testing #s-rank-reports ID: 1101248697280495637
		if ((message.channelId === '1101248423249846372') && (message.author.bot === false)) {
			// console.log(message.author);
			// console.log(message);

			try {

				// Delete message and prevent errors for blank msgs/sticker
				if (message.content === '') {
					message.delete().catch(console.error);
					console.log('ERROR: Blank Message or Sticker, successfully deleted');
					return;
				}

				const reportsChannel = await message.guild.channels.cache.get('1101248388483272834');
				const mainChannel = await message.guild.channels.cache.get('1101248423249846372');
				const mentionRole = '1121306416389554266';
				// Coeurl #manual-reports ID: 1101248388483272834
				// bot testing #manual-reports ID: 1101248716305862656

				// Create relay embed
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
				// Set response delete time
				await mainChannel.send({
					embeds: [responseEmbed],
				})
					.then(msg => {
						setTimeout(() => msg.delete(), 7500);
					});

				// Wait
				await sleep(7500);

				// Delete original message + error logs
				await mainChannel.messages
					.fetch(message.id)
					.then((fetchedMessage) => {
						console.log('Message exists');
						fetchedMessage.delete()
							.then(() => console.log('Message deleted successfully'))
							.catch((err) => console.log('Could not delete message ----', err));
					}).catch((err) => {
						if (err.status === 404) {
							console.log('ERROR: Message already deleted ----\n', err);
						}
						else if (err.code === '10008') {
							console.log('ERROR: Message already deleted ----\n', err);
						}
						else {
							console.log('ERROR: Unknown error ----\n', err);
						}
					});
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