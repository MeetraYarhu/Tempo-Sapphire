const {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChannelType,
	EmbedBuilder,
	LabelBuilder,
	MessageFlags,
	ModalBuilder,
	PermissionFlagsBits,
	StringSelectMenuBuilder,
	TextInputBuilder,
	TextInputStyle,
} = require('discord.js');
const huntsByExpansion = require('./huntVariables.json');
const idVariables = require('./idVariables.json');

const BUTTON_PREFIX = 'srank:expansion:';
const MODAL_PREFIX = 'srank:report:';
const expansions = [
	{ id: 'a_realm_reborn', name: 'A Realm Reborn', emoji: '<:2x:1255303608258269304>' },
	{ id: 'heavensward', name: 'Heavensward', emoji: '<:3x:1255303623181598810>' },
	{ id: 'stormblood', name: 'Stormblood', emoji: '<:4x:1255303637752741989>' },
	{ id: 'shadowbringers', name: 'Shadowbringers', emoji: '<:5x:1255303652252455083>' },
	{ id: 'endwalker', name: 'Endwalker', emoji: '<:6x:1255303667515396210>' },
	{ id: 'dawntrail', name: 'Dawntrail', emoji: '<:7x:1255303681654521856>' },
];

class SRankReportError extends Error {
	constructor(message) {
		super(message);
		this.name = 'SRankReportError';
	}
}

function getExpansion(id) {
	return expansions.find((expansion) => expansion.id === id);
}

function getHunts(expansion) {
	return huntsByExpansion[expansion.name];
}

function getReportContext(interaction) {
	if (!interaction.guildId || !interaction.guild) {
		throw new SRankReportError('Use the S-Rank panel inside a server.');
	}
	const config = Object.values(idVariables).find((entry) => entry.guild?.id === interaction.guildId);
	if (!config?.channels?.srankreports || !config.channels.manualreports || !config.roles?.manualreports) {
		throw new SRankReportError('S-Rank reports are not configured for this server.');
	}
	if (interaction.channelId !== config.channels.srankreports) {
		throw new SRankReportError('Use the S-Rank panel in <#' + config.channels.srankreports + '>.');
	}
	return config;
}

function buildPanelRows() {
	const buttons = [...expansions].reverse().map((expansion) => {
		const button = new ButtonBuilder()
			.setCustomId(BUTTON_PREFIX + expansion.id)
			.setLabel('Report ' + expansion.name + ' S-Rank')
			.setStyle(ButtonStyle.Primary);
		if (expansion.emoji) button.setEmoji(expansion.emoji);
		return button;
	});
	const rows = [];
	for (let index = 0; index < buttons.length; index += 2) {
		rows.push(new ActionRowBuilder().addComponents(buttons.slice(index, index + 2)));
	}
	return rows;
}

function buildReportModal(expansion) {
	const huntSelect = new StringSelectMenuBuilder()
		.setCustomId('hunt')
		.setPlaceholder('Choose an S-Rank')
		.setMinValues(1)
		.setMaxValues(1)
		.addOptions(getHunts(expansion).map((hunt) => ({
			label: hunt.name + ' | ' + hunt.location,
			value: hunt.id,
		})));
	const coordinates = new TextInputBuilder()
		.setCustomId('coordinates')
		.setStyle(TextInputStyle.Short)
		.setPlaceholder('Example: X: 12.3, Y: 24.5 or ToD: 14:30 server time')
		.setRequired(false);
	return new ModalBuilder()
		.setCustomId(MODAL_PREFIX + expansion.id)
		.setTitle(expansion.name + ' S-Rank Report')
		.addLabelComponents(
			new LabelBuilder().setLabel('S-Rank').setStringSelectMenuComponent(huntSelect),
			new LabelBuilder()
				.setLabel('Coordinate or Time of Death')
				.setDescription('Optional if you only know the zone.')
				.setTextInputComponent(coordinates),
		);
}

function buildReportEmbed(expansion, hunt, coordinates, user) {
	return new EmbedBuilder()
		.setColor('Red')
		.setTitle(expansion.name + ' S-Rank Report')
		.setDescription(hunt.name + ' | ' + hunt.location +
			'\nCoordinate or Time of Death: ' + (coordinates || 'Not provided (zone-only report)'))
		.setTimestamp()
		.setFooter({
			text: user.username,
			iconURL: user.displayAvatarURL(),
		});
}

async function resolveReportChannel(guild, channelId, mentionRoleId) {
	// fetchMe retrieves only the bot's own member, without requesting a member list.
	const [channel, botMember] = await Promise.all([
		guild.channels.fetch(channelId),
		guild.members.fetchMe(),
	]);
	if (!channel || channel.guildId !== guild.id ||
		![ChannelType.GuildText, ChannelType.GuildAnnouncement].includes(channel.type)) {
		throw new SRankReportError('The configured S-Rank channel must be a server text or announcement channel.');
	}
	const required = [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages];
	if (mentionRoleId) required.push(PermissionFlagsBits.EmbedLinks);
	const permissions = channel.permissionsFor(botMember);
	if (!permissions?.has(required)) {
		throw new SRankReportError('I need View Channel, Send Messages' +
			(mentionRoleId ? ', and Embed Links' : '') + ' in <#' + channelId + '>.');
	}
	if (mentionRoleId) {
		const role = await guild.roles.fetch(mentionRoleId);
		if (!role) {
			throw new SRankReportError('The configured S-Rank notification role could not be found.');
		}
		if (!role.mentionable && !permissions.has(PermissionFlagsBits.MentionEveryone)) {
			throw new SRankReportError('The S-Rank notification role must be mentionable, or I need Mention Everyone in the report destination.');
		}
	}
	return channel;
}

async function replyPrivately(interaction, content) {
	if (interaction.deferred) return interaction.editReply({ content });
	if (interaction.replied) return interaction.followUp({ content, flags: MessageFlags.Ephemeral });
	return interaction.reply({ content, flags: MessageFlags.Ephemeral });
}

async function handleReportError(handler, interaction, error) {
	handler.container.logger.error('[S-Rank reports] ' + error.message);
	const content = error instanceof SRankReportError ? error.message :
		'I could not complete the S-Rank request. Please check my channel and role permissions, then try again.';
	try {
		await replyPrivately(interaction, content);
	}
	catch (replyError) {
		handler.container.logger.error('[S-Rank reports] Could not send private response: ' + replyError.message);
	}
}

module.exports = {
	BUTTON_PREFIX,
	MODAL_PREFIX,
	expansions,
	SRankReportError,
	getExpansion,
	getHunts,
	getReportContext,
	buildPanelRows,
	buildReportModal,
	buildReportEmbed,
	resolveReportChannel,
	replyPrivately,
	handleReportError,
};
