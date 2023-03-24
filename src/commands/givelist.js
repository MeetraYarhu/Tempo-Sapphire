const { Command } = require('@sapphire/framework');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

class GiveListCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
		});
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('givelist')
				.setDescription('Give role to user')
				.addUserOption(option =>
					option
						.setName('target')
						.setDescription('user to give role to')
						.setRequired(true))
				.addRoleOption(option =>
					option
						.setName('role')
						.setDescription('role to give')
						.setRequired(true)),
		);
	}

	chatInputRun(interaction) {

		const member = interaction.options.getMember('target');
		const role = interaction.options.getRole('role');
		member.roles.add(role);

		const user = interaction.options.getUser('target');

		interaction.reply(`Added <@&${role.id}> to <@${user.id}>`);
	}
}

module.exports = {
	GiveListCommand,
};