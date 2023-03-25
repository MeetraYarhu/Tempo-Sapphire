const { Command } = require('@sapphire/framework');

class GiveListCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'excal',
			description: 'Give Excal List role',
			requiredClientPermissions: ['ManageRoles'],
		});
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('excal')
				.setDescription('Give role to user')
				.addUserOption(option =>
					option
						.setName('target')
						.setDescription('user to give role to')
						.setRequired(true)),
		);
	}

	async chatInputRun(interaction) {

		try {
			const role = '785242661392482405';
			const member = await interaction.options.getMember('target');
			const user = await interaction.options.getUser('target');

			await member.roles.add(role);
			await interaction.reply(`Added <@&${role}> to <@${user.id}>`);
		}
		catch (error) {
			interaction.reply('Failed');
		}
	}
}

module.exports = {
	GiveListCommand,
};