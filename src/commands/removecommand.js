const { Command, CommandOptionsRunTypeEnum } = require('@sapphire/framework');
const { REST, Routes } = require('discord.js');
// eslint-disable-next-line no-unused-vars
const { testtoken, maintoken } = require('@config');
const idvariables = require('../util/idVariables.json');

// Define bot information
// const botinfo = (idvariables.botinfo.tempotesting);
const botinfo = (idvariables.botinfo.tempobot);

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

		const clientId = botinfo.id;

		try {
			const globalcommand = await rest.get(Routes.applicationCommand(clientId, choice));

			rest.delete(Routes.applicationCommand(clientId, choice))
				.then(() => console.log('Successful Deletion of Command:', globalcommand))
				.catch(console.error);
		}
		catch (error) {
			console.error('Removecommand.js: Error fetching command:', error);
		}
		await interaction.reply('done');
	}
}

module.exports = {
	removeCommandCommand,
};