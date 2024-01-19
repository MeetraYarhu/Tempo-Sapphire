const { Command, CommandOptionsRunTypeEnum } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');

class FaloopCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'faloop',
			description: 'Give relevant Discord roles',
			requiredClientPermissions: ['ManageRoles'],
			requiredUserPermissions: ['ManageRoles'],
			runIn: CommandOptionsRunTypeEnum.GuildAny,
		});
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('faloop')
				.setDescription('Give appropriate roles to the user')
				.addStringOption(option =>
					option.setName('permissions')
						.setRequired(true)
						.setDescription('Type of Permissions')
						.addChoices(
							{ name: 'Trials', value: '828812675831562291' },
							{ name: 'Full', value: '612417945812992097' },
							{ name: 'Retired', value: '829187433182265366' },
						))
				.addUserOption(option =>
					option
						.setName('target')
						.setDescription('Select User')
						.setRequired(true)),
		);
	}

	async chatInputRun(interaction) {

		// Assign RoleID Variables
		const roleTrials = '828812675831562291';
		const roleReporter = '612417945812992097';
		const roleRetired = '829187433182265366';

		const perm = {
			trials: '828812675831562291',
			full: '612417945812992097',
			retired: '829187433182265366',
		};


		// Assign Interaction Values
		const member = await interaction.options.getMember('target');
		const user = await interaction.options.getUser('target');
		const choice = await interaction.options.getString('permissions');

		// Assign Text Shortcuts
		const enable = '<:plus:1145196907623370802>᲼';
		// '🔴᲼᲼➡️᲼᲼🟢᲼᲼';
		const disable = '<:minus:1145197539080032316>᲼';
		// '🟢᲼᲼➡️᲼᲼🔴᲼᲼';

		// Create Base Reply
		const replyEmbed = await new EmbedBuilder()
			.setColor('Blue')
			.setDescription(`### ${user.username} (<@${user.id}>) `)
			.setTimestamp()
			.setThumbnail(user.avatarURL())
			.setFooter({
				text: interaction.user.username,
				iconURL: interaction.user.avatarURL(),
			});

		try {

			// Checks if command is being used in Coeurl (481478007932846100), and returns
			if (interaction.guildId != '481478007932846100') {
				await interaction.reply({ content: 'You can\'t use that command here!', ephemeral:true });
				return;
			}
			// Checks if target is a bot, and returns
			if (user.bot === true) {
				await interaction.reply({ content: `<@${user.id}> is a bot!`, ephemeral: true });
				return;
			}
			// Checks if user already has retired role when trying to assign it, and returns
			if ((choice === perm.retired) && (member.roles.cache.some(role => role.id === perm.retired))) {
				await interaction.reply({ content: `That user already has the <@&${roleRetired}> role.`, ephemeral: true });
				return;
			}
			// Checks if user has the trials role when adding retired, and returns
			if ((choice === perm.retired) && (member.roles.cache.some(role => role.id === perm.trials))) {
				await interaction.reply({ content: 'Error, cannot add retired role to a user in trials.', ephemeral: true });
				return;
			}
			// Object.values(perm)
			// Removes any role that is not being added
			const _roleList = ['828812675831562291', '612417945812992097', '829187433182265366'];
			_roleList.forEach(element => {
				if (choice != element) {
					if (member.roles.cache.some(role => role.id === element)) {
						member.roles.remove(element);
						replyEmbed
							.addFields({
								name: ' ',
								value: `${disable}<@&${element}>`,
							});
					}
				}
			});

			// Adds role to user
			switch (choice) {
			case perm.trials:
				member.roles.add(roleTrials);
				replyEmbed
					.addFields({
						name: ' ',
						value: `${enable}<@&${roleTrials}>`,
					});
				break;
			case perm.full:
				member.roles.add(roleReporter);
				replyEmbed
					.addFields({
						name: ' ',
						value: `${enable}<@&${roleReporter}>`,
					});
				break;
			case perm.retired:
				member.roles.add(roleRetired);
				replyEmbed
					.addFields({
						name: ' ',
						value: `${enable}<@&${roleRetired}>`,
					});
				break;
			default:
				break;
			}
			// Reply
			await interaction.reply({
				embeds: [replyEmbed],
			});
		}
		catch (error) {
			console.log(error);
			interaction.reply('Failed');
		}
	}
}

module.exports = {
	FaloopCommand,
};