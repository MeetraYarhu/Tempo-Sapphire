const { Command, CommandOptionsRunTypeEnum } = require('@sapphire/framework');

class GiveListCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'excal',
			description: 'Give Excal List role',
			requiredClientPermissions: ['ManageRoles'],
			runIn: CommandOptionsRunTypeEnum.GuildAny,
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
			const waffles = '295969949678043146';
			const meetra = '127254878190829568';
			const member = await interaction.options.getMember('target');
			const user = await interaction.options.getUser('target');

			if (interaction.user.id === waffles || interaction.user.id === meetra) {
				await member.roles.add(role);
				await interaction.reply(`Added <@&${role}> to <@${user.id}>`);
			}
			else {
				interaction.reply({
					content: 'You do not have permission to use this command.',
					ephemeral: true,
				});
				console.log(`ERROR: ${interaction.user.username} attempted to use the 'excal' command in guild: ${interaction.guild.name}.`);
			}
		}
		catch (error) {
			interaction.reply('Failed');
		}
	}
}

module.exports = {
	GiveListCommand,
};