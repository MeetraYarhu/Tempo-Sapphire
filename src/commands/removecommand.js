const { Command, CommandOptionsRunTypeEnum } = require('@sapphire/framework');
const { REST, Routes } = require('discord.js');
const { testtoken } = require('@config');

class removeCommandCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'removecommand',
			description: 'Removes a registered command',
			runIn: CommandOptionsRunTypeEnum.GuildAny,
			preconditions: ['OwnerOnly'],
		});
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('removecommand')
				.setDescription('Removes a registered command')
				.addStringOption(option =>
					option.setName('commandid')
						.setRequired(true)
						.setDescription('commandID'),
				),
		);
	}
	async chatInputRun(interaction) {

		const choice = await interaction.options.getString('commandid');

		const rest = new REST().setToken(testtoken);

		// tempo id 797717037614628945
		const clientId = '797717037614628945';

		try {
			const globalcommand = await rest.get(Routes.applicationCommand(clientId, choice));

			rest.delete(Routes.applicationCommand(clientId, choice))
				.then(() => console.log('Successful Deletion of Command:', globalcommand))
				.catch(console.error);
		}
		catch (error) {
			console.error('Error fetching command:', error);
		}
		await interaction.reply('done');
	}
}

module.exports = {
	removeCommandCommand,
};