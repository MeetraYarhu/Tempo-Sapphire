const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');

class CheckNitroCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'checknitro',
			description: 'Check for nitro, remove nitro colors if needed.',
			requiredClientPermissions: ['ManageRoles'],
		});
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('checknitro')
				.setDescription('Check for nitro, remove nitro colors if needed.'),
		);
	}

	async chatInputRun(interaction) {

		await interaction.deferReply();

		// Roles
		const Nitro = '589366331074150405';
		const Colors = {
			train: 		'827108756893990932',
			reporter: 	'864557267265257503',
			purple: 	'823367370780966983',
			white: 		'823368359725760552',
			green: 		'823368119812096021',
			orange: 	'823366921453305876',
			pink: 		'823365226467950643',
		};

		try {
			// Length of Colors
			const ColorsLength = await (Object.keys(Colors).length);

			// Convert Colors to an array
			const colorsIDs = await Object.values(Colors);

			// Creating Embed Template
			const responseEmbed = await new EmbedBuilder()
				.setColor('Blue')
				.setTitle('What I Did:');

			// Loop through each color, creating a map each time
			for (let i = 0; i < ColorsLength; i++) {
				const tempMap = await interaction.guild.roles.cache.get(colorsIDs[i]).members.map(m => m);

				// Loop through users in each color map, checking for Nitro and removing/doing nothing
				for (let k = 0; k < tempMap.length; k++) {
					if (tempMap[k].roles.cache.some(role => role.id === Nitro)) {
						// DO NOTHING & edit response
					}
					else {
						// REMOVE ROLE & edit response
						await tempMap[k].roles.remove(colorsIDs[i]);
						await responseEmbed.addFields({
							name: ' ',
							value: `<@${tempMap[k].user.id}> does not have <@&${Nitro}>. Their <@&${colorsIDs[i]}> was removed` });
						// LATER: make it so that the response only adds the roles removed, and if none are removed, say that.
					}
				}
			}
			await interaction.editReply({ embeds: [responseEmbed] });
		}
		catch (error) {
			interaction.reply('Failed');
			console.log('Checklist Interaction Failed');
		}
	}
}

module.exports = {
	CheckNitroCommand,
};