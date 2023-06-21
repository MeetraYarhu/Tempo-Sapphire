const { Command } = require('@sapphire/framework');

class RanksCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'ranks',
			description: 'Faloop Roles',
			requiredClientPermissions: ['ManageRoles'],
		});
	}
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('rank')
				.setDescription('gives rank'),
		);
	}

	async chatInputRun(interaction) {

		try {
			// do code
		}
		catch (error) {
			interaction.reply('Failed');
			console.log(error);
		}

	}
}

module.exports = {
	RanksCommand,
};