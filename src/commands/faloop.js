const { Command, CommandOptionsRunTypeEnum } = require('@sapphire/framework');
const { EmbedBuilder, MessageFlags } = require('discord.js');
const removeSpecificRoles = require('@util/removeSpecificRoles.js');
const addSpecificRoles = require('@util/addSpecificRoles')
const idvariables = require('../util/idVariables.json');
const { getLogger } = require('@util/logger.js');
	const log = getLogger(__filename);

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
							{ name: 'Trials', value: idvars.roles.trialsreporter },
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
		const roleTrials = idvars.roles.trialsreporter;
		const roleReporter = idvars.roles.srankreporter;
		const roleRetired = idvars.roles.retiredreporter;

		// Assign Interaction Values
		const member = await interaction.options.getMember('target');
		const user = await interaction.options.getUser('target');
		const choice = await interaction.options.getString('permissions');

		log.info({ 
			interactionId: interaction.id,
			invokedByUsername: interaction.user.username,
			invokedById: interaction.user.id,
			targetUsername: user.username,
			targetId: user.id,
			choice
		 }, 
			'Command initiated');

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
				log.warn({ 
					interactionId: interaction.id,
					guildId: interaction.guildId 
				}, 
					'Command attempted in wrong server');
				return;
			}
			// Checks if target is a bot, and returns
			if (user.bot === true) {
				await interaction.reply({ content: `<@${user.id}> is a bot!`, flags: MessageFlags.Ephemeral });
				log.warn({ 
					interactionId: interaction.id,
				}, 'Command attempted on a bot');
				return;
			}
			// Checks if user already has retired role when trying to assign it, and returns
			if ((choice === roleRetired) && (member.roles.cache.some(role => role.id === roleRetired))) {
				await interaction.reply({ content: `That user already has the <@&${roleRetired}> role.`, flags: MessageFlags.Ephemeral });
				log.warn({ 
					interactionId: interaction.id,
				}, 'Command attempted to assign retired role to a user that already has it');
				return;
			}
			// Checks if user has the trials role when adding retired, and returns
			if (choice === roleRetired && member.roles.cache.some(role => role.id === roleTrials)) {
				await interaction.reply({ content: 'Cannot add retired role to a user in trials.', flags: MessageFlags.Ephemeral });
				log.warn({ 
					interactionId: interaction.id,
				}, 'Command attempted to assign retired role to a user that is in trials');
				return;
			}

			// Blocks command if trying to assign trials to a retired user
			if (choice === roleTrials && member.roles.cache.some(role => role.id === roleRetired)) {
				await interaction.reply({ content: 'Cannot add trials role to a retired user. Please do this manually.', flags: MessageFlags.Ephemeral });
				log.warn({
					interactionId: interaction.id,
				}, 'Command attempted to assign trials role to a user that is retired');
				return;
			}

			// Automatically generate rolesToRemove using the labels and IDs
			const rolesToRemove = Object.entries(idvars.roles)
				.filter(([key]) => key.includes('reporter'))
				.map(([, id]) => id);

			// Removes any role that is not being added
			for (const roleId of rolesToRemove) {
				if (choice === roleId) continue; // Skip the role that is being added
				if (!member.roles.cache.has(roleId)) continue;

				await removeSpecificRoles(idvars.guild.id, user.id, roleId);
				replyEmbed
					.addFields({
						name: ' ',
						value: `${disable}<@&${roleId}>`,
					});
			};

			// Adds role to user
			switch (choice) {
			case roleTrials:
				await addSpecificRoles(interaction.guild.id, user.id, roleTrials);
				replyEmbed
					.addFields({
						name: ' ',
						value: `${enable}<@&${roleTrials}>`,
					});
				break;
			case roleReporter:
				await addSpecificRoles(interaction.guild.id, user.id, roleReporter);
				replyEmbed
					.setColor('Green')
					.addFields({
						name: ' ',
						value: `${enable}<@&${roleReporter}>`,
					});
				break;
			case roleRetired:
				await addSpecificRoles(interaction.guild.id, user.id, roleRetired);
				replyEmbed
					.setColor('Orange')
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
			log.error(error, 'Error executing command');
			await interaction.reply('Failed - if problem persists make note of your attempts and tell Meetra');
		}
	}
}

module.exports = {
	FaloopCommand,
};