const { Command } = require('@sapphire/framework');
const { MessageFlags, PermissionFlagsBits } = require('discord.js');
const {
	buildPanelRows,
	getReportContext,
	resolveReportChannel,
	replyPrivately,
	handleReportError,
} = require('../util/sRankReports');

const PANEL_NOTICE = [
	'This channel will allow you to post notices of **S-Ranks** without requiring access to Faloop.',
	'### PRIMAL S-Ranks only!',
	'Click an expansion button below, select the S-Rank, and enter its coordinate or time of death if known.',
	'### A-Ranks should be reported in <#649040162130755624> with the same information',
	'Your submissions here will be sent to the Reporters. Your report may not immediately show up in **<#612419137876000807>** or on Faloop. It\'s likely in the process of being verified, or being held while other spawns are currently queued.',
	'If the S-Rank dies without a proper report, please send a report with the time-of-death so we can keep the timers updated. If you don\'t know the location of a mark, and simply the zone, please feel free to still submit a report using this channel.',
	'If you\'ve encountered an S-Rank in the wild that you haven\'t spawned yourself, please check the immediate vicinity of the S-Rank to make sure the spawner isn\'t nearby and waiting to relay the S-Rank themselves before making a manual report. If you don\'t see a spawner nearby, please wait a moment or two before submitting a manual relay, as the spawner may be in the process of locating their spawn.',
	'If it is your own spawn, feel free to approach an **<@&481481786568998913>** and ask if you can gain reporting rights yourself. We\'re always interested in getting new spawners on board!',
].join('\n\n') + '\n** **';

class SRankPanelCommand extends Command {
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('s-rank-panel')
				.setDescription('Posts the S-Rank report panel')
				.setDMPermission(false)
				.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
		);
	}

	async chatInputRun(interaction) {
		let posted = false;
		try {
			const config = getReportContext(interaction);
			if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageMessages)) {
				await replyPrivately(interaction, 'You need Manage Messages to post the S-Rank panel.');
				return;
			}
			await interaction.deferReply({ flags: MessageFlags.Ephemeral });
			const channel = await resolveReportChannel(interaction.guild, config.channels.srankreports);
			await channel.send({
				content: PANEL_NOTICE,
				components: buildPanelRows(),
				allowedMentions: { parse: [] },
			});
			posted = true;
			await interaction.editReply({ content: 'The S-Rank report panel has been posted.' });
		}
		catch (error) {
			if (posted) {
				this.container.logger.error('[S-Rank panel] Panel posted, but confirmation failed: ' + error.message);
				return;
			}
			await handleReportError(this, interaction, error);
		}
	}
}

module.exports = { SRankPanelCommand };
