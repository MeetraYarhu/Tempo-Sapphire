const { Command, CommandOptionsRunTypeEnum } = require('@sapphire/framework');
const { EmbedBuilder, MessageFlags } = require('discord.js');
const idvariables = require('../util/idVariables.json');

// Define each guild as it's own object
const idvars = (idvariables.coeurl);
// const idvars = (idvariables.tempotesting);

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
							{ name: 'Trials', value: idvars.roles.trials },
							{ name: 'Full', value: idvars.roles.srankreporter },
							{ name: 'Retired', value: idvars.roles.retiredreporter },
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
		const roleTrials = idvars.roles.trials;
		const roleReporter = idvars.roles.srankreporter;
		const roleRetired = idvars.roles.retiredreporter;

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

			// Checks if command is being used in correct guild, and returns
			if (interaction.guildId != idvars.guild.id) {
				await interaction.reply({ content: 'You can\'t use that command here!', flags: MessageFlags.Ephemeral });
				return;
			}
			// Checks if target is a bot, and returns
			if (user.bot === true) {
				await interaction.reply({ content: `<@${user.id}> is a bot!`, flags: MessageFlags.Ephemeral });
				return;
			}
			// Checks if user already has retired role when trying to assign it, and returns
			if ((choice === roleRetired) && (member.roles.cache.some(role => role.id === roleRetired))) {
				await interaction.reply({ content: `That user already has the <@&${roleRetired}> role.`, flags: MessageFlags.Ephemeral });
				return;
			}
			// Checks if user has the trials role when adding retired, and returns
			if ((choice === roleRetired) && (member.roles.cache.some(role => role.id === roleTrials))) {
				await interaction.reply({ content: 'Error, cannot add retired role to a user in trials.', flags: MessageFlags.Ephemeral });
				return;
			}
			// Removes any role that is not being added
			const _roleList = [roleTrials, roleReporter, roleRetired];
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
			case roleTrials:
				member.roles.add(roleTrials);
				replyEmbed
					.addFields({
						name: ' ',
						value: `${enable}<@&${roleTrials}>`,
					});
				break;
			case roleReporter:
				member.roles.add(roleReporter);
				replyEmbed
					.addFields({
						name: ' ',
						value: `${enable}<@&${roleReporter}>`,
					});
				break;
			case roleRetired:
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
			await console.log(`Faloop.js: ${interaction.user.username} edited the roles of ${user.username}, ID ${user.id}`);
		}
		catch (error) {
			console.log('Faloop.js:', error);
			interaction.reply('Failed');
		}
	}
}

module.exports = {
	FaloopCommand,
};