const { Listener, CommandOptionsRunTypeEnum } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');
const idvariables = require('../util/idVariables.json');

// Define each guild as it's own object
const idvars = (idvariables.coeurl);
// const idvars = (idvariables.tempotesting);

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

		// Check that a report was sent in the proper channel, by a non-bot
		if ((message.channelId === idvars.channels.srankreports) && (message.author.bot === false)) {

			try {

				// Delete message and prevent errors for blank msgs/sticker
				if (message.content === '') {
					message.delete().catch(console.error);
					console.log('ERROR: Blank Message or Sticker, successfully deleted');
					return;
				}
				// Resolve the channel IDs to a variable
				const manualReports = await message.guild.channels.cache.get(idvars.channels.manualreports);
				const sRankReports = await message.guild.channels.cache.get(idvars.channels.srankreports);
				const mentionRole = idvars.roles.manualreports;

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
				await manualReports.send({
					content: `<@${message.author.id}> <@&${mentionRole}>`,
					embeds: [relayEmbed],
					allowedMentions: {
						roles: [mentionRole],
						users: [message.author.id],
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
				await sRankReports.send({
					embeds: [responseEmbed],
				})
					.then(msg => {
						setTimeout(() => msg.delete(), 7500);
					});

				// Wait
				await sleep(7500);

				// Delete original message + error logs
				await sRankReports.messages
					.fetch(message.id)
					.then((fetchedMessage) => {
						console.log('s-rank-reports: Message exists');
						fetchedMessage.delete()
							.then(() => console.log('s-rank-reports: Message deleted successfully'))
							.catch((err) => console.log('s-rank-reports: Could not delete message ----', err));
					}).catch((err) => {
						if (err.status === 404) {
							console.log('ERROR: s-rank-reports: Message already deleted ----\n', err);
						}
						else if (err.code === '10008') {
							console.log('ERROR: s-rank-reports: Message already deleted ----\n', err);
						}
						else {
							console.log('ERROR: s-rank-reports: Unknown error ----\n', err);
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