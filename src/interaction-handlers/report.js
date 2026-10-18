const { InteractionHandler, InteractionHandlerTypes } = require('@sapphire/framework');
const { MessageFlags } = require('discord.js');
const {
	MODAL_PREFIX,
	worlds,
	SRankReportError,
	getExpansion,
	getHunts,
	getReportContext,
	buildReportEmbed,
	resolveReportChannel,
	handleReportError,
} = require('../util/sRankReports');

class ReportHandler extends InteractionHandler {
	constructor(context, options) {
		super(context, {
			...options,
			interactionHandlerType: InteractionHandlerTypes.ModalSubmit,
		});
	}

	parse(interaction) {
		if (!interaction.customId.startsWith(MODAL_PREFIX)) return this.none();
		return this.some(interaction.customId.slice(MODAL_PREFIX.length));
	}

	async run(interaction, expansionId) {
		let delivered = false;
		try {
			await interaction.deferReply({ flags: MessageFlags.Ephemeral });
			const config = getReportContext(interaction);
			const expansion = getExpansion(expansionId);
			if (!expansion) throw new SRankReportError('That S-Rank expansion is no longer available. Please use the current panel.');
			let selectedWorlds;
			try {
				selectedWorlds = interaction.fields.getStringSelectValues('world');
			}
			catch {
				throw new SRankReportError('Please reopen the S-Rank form and select a World before submitting.');
			}
			if (selectedWorlds.length !== 1 || !worlds.includes(selectedWorlds[0])) {
				throw new SRankReportError('Choose one of the listed Worlds before submitting the S-Rank report.');
			}
			const world = selectedWorlds[0];
			const selected = interaction.fields.getStringSelectValues('hunt');
			const hunt = selected.length === 1 ?
				getHunts(expansion).find((entry) => entry.id === selected[0]) : undefined;
			if (!hunt) throw new SRankReportError('That hunt is not available for this expansion. Please reopen the S-Rank form.');
			const coordinates = interaction.fields.getTextInputValue('coordinates');
			const channel = await resolveReportChannel(
				interaction.guild, config.channels.manualreports, config.roles.manualreports,
			);
			await channel.send({
				content: '<@' + interaction.user.id + '> <@&' + config.roles.manualreports + '>',
				embeds: [buildReportEmbed(hunt, world, coordinates, interaction.user)],
				allowedMentions: {
					parse: [],
					users: [interaction.user.id],
					roles: [config.roles.manualreports],
					repliedUser: false,
				},
			});
			delivered = true;
			await interaction.editReply({
				content: 'Thanks for the S-Rank report! I have relayed it to our spawners for checking.',
			});
		}
		catch (error) {
			if (delivered) {
				this.container.logger.error('[S-Rank reports] Report delivered, but confirmation failed: ' + error.message);
				return;
			}
			await handleReportError(this, interaction, error);
		}
	}
}

module.exports = { ReportHandler };
