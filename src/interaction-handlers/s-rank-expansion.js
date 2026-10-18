const { InteractionHandler, InteractionHandlerTypes } = require('@sapphire/framework');
const {
	BUTTON_PREFIX,
	SRankReportError,
	getExpansion,
	getReportContext,
	buildReportModal,
	handleReportError,
} = require('../util/sRankReports');

class SRankExpansionHandler extends InteractionHandler {
	constructor(context, options) {
		super(context, {
			...options,
			interactionHandlerType: InteractionHandlerTypes.Button,
		});
	}

	parse(interaction) {
		if (!interaction.customId.startsWith(BUTTON_PREFIX)) return this.none();
		return this.some(interaction.customId.slice(BUTTON_PREFIX.length));
	}

	async run(interaction, expansionId) {
		try {
			getReportContext(interaction);
			const expansion = getExpansion(expansionId);
			if (!expansion) throw new SRankReportError('That S-Rank expansion is no longer available. Please use the current panel.');
			await interaction.showModal(buildReportModal(expansion));
		}
		catch (error) {
			await handleReportError(this, interaction, error);
		}
	}
}

module.exports = { SRankExpansionHandler };