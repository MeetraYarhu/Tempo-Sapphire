const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');
const beheNames = require('../util/behenames.json');

class RepostCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'repost',
			description: 'repost',
			requiredClientPermissions: ['SendMessages', 'AddReactions'],
		});
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('repost')
				.setDescription('repost'),
		);
	}

	async chatInputRun(interaction) {

		await interaction.deferReply();
		await interaction.deleteReply();

		// Declaring Names to Array From behenames.json
		const namesArray = beheNames.beheNames;

		// Declaring Input Variable
		// const userInput = await interaction.options.getString('input');

		try {
			// Initial Embed
			const responseEmbed = await new EmbedBuilder()
				.setColor('Blue')
				.setTitle('Placeholder');

			// Final Embed
			const finalEmbed1 = await new EmbedBuilder()
				.setColor('DarkBlue')
				.setTitle('Message Links');

			const finalEmbed2 = await new EmbedBuilder()
				.setColor('DarkBlue')
				.setTitle('Message Links');

			const finalArray1 = [];
			const finalArray2 = [];

			for (let i = 0; i < namesArray.length; i++) {

				// Loop to create Embed, then post
				await responseEmbed.setTitle(namesArray[i]);

				const newMessage = await interaction.channel.send({ content: '** **', embeds: [responseEmbed], fetchReply: true });
				await newMessage.react('👍');
				await newMessage.react('👎');
				await newMessage.react('❔');
				await newMessage.react('💬');

				if (i > 32) {
					// add to second array
					await finalArray2.push(`[${namesArray[i]}](${newMessage.url})`);
				}
				else {
					// add to first array
					await finalArray1.push(`[${namesArray[i]}](${newMessage.url})`);
				}
			}

			// await interaction.channel.send({ embeds: [finalEmbed] });
			// console.log(finalArray1);
			await finalEmbed1.setDescription(`${finalArray1.join('\n')}`);
			await finalEmbed2.setDescription(`${finalArray2.join('\n')}`);
			/* await finalEmbed.addFields(
				{
					name: '\u200b',
					value: `${finalArray1.join('\n')}`,
					inline: true,
				},
				{
					name: '\u200b',
					value: `${finalArray2.join('\n')}`,
					inline: true,
				},
			); */
			await interaction.channel.send({ embeds: [finalEmbed1] });
			await interaction.channel.send({ embeds: [finalEmbed2] });
		}
		catch (error) {
			interaction.channel.send('Failed');
			console.log(error);
		}
	}

}

module.exports = {
	RepostCommand,
};