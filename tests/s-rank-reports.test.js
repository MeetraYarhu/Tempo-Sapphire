const test = require('node:test');
const assert = require('node:assert/strict');
const { ChannelType, ComponentType, MessageFlags, PermissionFlagsBits, PermissionsBitField, SlashCommandBuilder } = require('discord.js');
const configByGuild = require('../src/util/idVariables.json');
const reports = require('../src/util/sRankReports');
const { SRankPanelCommand } = require('../src/commands/srankpanel');
const { SRankExpansionHandler } = require('../src/interaction-handlers/s-rank-expansion');
const { ReportHandler } = require('../src/interaction-handlers/report');

const user = {
	id: '123456789012345678',
	username: 'Test Reporter',
	displayAvatarURL: () => 'https://cdn.discordapp.com/embed/avatars/0.png',
};
const defaultPermissions = [
	PermissionFlagsBits.ViewChannel,
	PermissionFlagsBits.SendMessages,
	PermissionFlagsBits.EmbedLinks,
	PermissionFlagsBits.MentionEveryone,
];

function handler(Class) {
	const instance = Object.create(Class.prototype);
	const logs = [];
	Object.defineProperty(instance, 'container', { value: { logger: { error: (message) => logs.push(message) } } });
	return { instance, logs };
}

function interaction(options = {}) {
	const config = configByGuild[options.guildKey || 'tempotesting'];
	const sent = [];
	const replies = [];
	const edits = [];
	const events = [];
	const shown = [];
	const permissions = new PermissionsBitField(options.permissions || defaultPermissions);
	const guild = {
		id: config.guild.id,
		channels: {
			fetch: async (channelId) => {
				events.push('fetchChannel');
				if (options.fetchError) throw new Error('Channel unavailable');
				return {
					id: channelId,
					guildId: options.wrongDestinationGuild ? 'other-guild' : config.guild.id,
					type: options.channelType ?? ChannelType.GuildText,
					permissionsFor: () => permissions,
					send: async (payload) => {
						events.push('send');
						if (options.sendError) throw new Error('Send failed');
						sent.push({ channelId, payload });
						return { id: '987654321098765432' };
					},
				};
			},
		},
		// No member cache, member enumeration, presence, or user-message data.
		members: { fetchMe: async () => ({ id: 'bot-user' }) },
		roles: {
			fetch: async (roleId) => options.missingRole ? null : { id: roleId, mentionable: options.mentionable || false },
		},
	};
	const value = {
		guildId: config.guild.id,
		guild,
		channelId: options.channelId || config.channels.srankreports,
		memberPermissions: new PermissionsBitField(options.canPost === false ? [] : [PermissionFlagsBits.ManageMessages]),
		user,
		deferred: false,
		replied: false,
		fields: {
			getStringSelectValues: (id) => {
				if (id === 'world') {
					if (options.missingWorld) throw new Error('World field missing');
					return options.selectedWorlds ?? [options.world ?? 'Leviathan'];
				}
				assert.equal(id, 'hunt');
				return options.selected || [options.huntId || 'the_forecaster'];
			},
			getTextInputValue: (id) => {
				assert.equal(id, 'coordinates');
				return options.coordinates ?? 'Near the northern bridge / instance two';
			},
		},
		deferReply: async (payload) => {
			assert.equal(value.deferred, false);
			assert.equal(value.replied, false);
			assert.equal(payload.flags, MessageFlags.Ephemeral);
			events.push('defer');
			value.deferred = true;
		},
		reply: async (payload) => {
			assert.equal(value.deferred, false);
			assert.equal(value.replied, false);
			replies.push(payload);
			value.replied = true;
		},
		editReply: async (payload) => {
			events.push('edit');
			if (options.confirmationError && sent.length) throw new Error('Confirmation unavailable');
			edits.push(payload);
		},
		followUp: async (payload) => replies.push(payload),
		showModal: async (modal) => {
			assert.equal(value.replied, false);
			assert.equal(value.deferred, false);
			shown.push(modal.toJSON());
			value.replied = true;
		},
	};
	return { value, sent, replies, edits, events, shown, config };
}

function parsedId(instance, customId) {
	return instance.parse({ customId }).match({ some: (id) => id, none: () => null });
}

test('all 47 catalog entries produce valid labels, modals, and maximum-length reports', () => {
	let total = 0;
	const ids = new Set();
	const counts = [17, 6, 6, 6, 6, 6];
	for (const [index, expansion] of reports.expansions.entries()) {
		const hunts = reports.getHunts(expansion);
		assert.equal(hunts.length, counts[index]);
		total += hunts.length;
		const modal = reports.buildReportModal(expansion).toJSON();
		assert.equal(modal.custom_id, reports.MODAL_PREFIX + expansion.id);
		assert.ok(modal.title.includes('S-Rank'));
		const [worldLabel, huntLabel, coordinatesLabel] = modal.components;
		assert.equal(worldLabel.label, 'World');
		assert.equal(worldLabel.component.type, ComponentType.StringSelect);
		assert.equal(worldLabel.component.custom_id, 'world');
		assert.equal(worldLabel.component.required, true);
		assert.equal(worldLabel.component.min_values, 1);
		assert.equal(worldLabel.component.max_values, 1);
		assert.deepEqual(worldLabel.component.options.map((option) => option.value), [
			'Behemoth', 'Excalibur', 'Exodus', 'Famfrit', 'Hyperion', 'Lamia', 'Leviathan', 'Ultros',
		]);
		assert.equal(huntLabel.type, ComponentType.Label);
		assert.equal(huntLabel.component.type, ComponentType.StringSelect);
		assert.equal(huntLabel.component.min_values, 1);
		assert.equal(huntLabel.component.max_values, 1);
		assert.equal(coordinatesLabel.component.custom_id, 'coordinates');
		assert.equal(coordinatesLabel.label, 'Coordinates or ToD');
		assert.doesNotMatch(coordinatesLabel.component.placeholder, /server|Leviathan/i);
		assert.equal(coordinatesLabel.component.required, false);
		assert.equal(coordinatesLabel.component.max_length, undefined);
		assert.equal(huntLabel.component.options.length, hunts.length);
		for (const [huntIndex, hunt] of hunts.entries()) {
			assert.ok(hunt.id && hunt.name && hunt.location);
			assert.equal(ids.has(hunt.id), false);
			ids.add(hunt.id);
			assert.equal(huntLabel.component.options[huntIndex].label, hunt.name + ' | ' + hunt.location);
			assert.equal(huntLabel.component.options[huntIndex].value, hunt.id);
			const embed = reports.buildReportEmbed(hunt, 'Leviathan', 'x'.repeat(4000), user).toJSON();
			assert.ok(embed.description.length <= 4096);
			assert.equal(embed.footer.text, user.username);
		}
	}
	assert.equal(total, 47);
});

test('panel registers for guild use and requires Manage Messages only for posting', async () => {
	const { instance } = handler(SRankPanelCommand);
	let registered;
	instance.registerApplicationCommands({
		registerChatInputCommand: (build) => { registered = build(new SlashCommandBuilder()).toJSON(); },
	});
	assert.equal(registered.name, 's-rank-panel');
	assert.equal(registered.dm_permission, false);
	assert.equal(registered.default_member_permissions, String(PermissionFlagsBits.ManageMessages));
	const request = interaction();
	await instance.chatInputRun(request.value);
	assert.equal(request.sent.length, 1);
	assert.equal(request.sent[0].channelId, request.config.channels.srankreports);
	assert.ok(request.sent[0].payload.content.length <= 2000);
	assert.match(request.sent[0].payload.content, /PRIMAL S-Ranks only!/);
	assert.match(request.sent[0].payload.content, /Click an expansion button/);
	assert.deepEqual(request.sent[0].payload.components.map((row) => row.toJSON().components.length), [2, 2, 2]);
	const buttons = request.sent[0].payload.components.flatMap((row) => row.toJSON().components);
	assert.deepEqual(buttons.map((button) => button.label),
		[...reports.expansions].reverse().map((expansion) => 'Report ' + expansion.name + ' S-Rank'));
	assert.equal(new Set(buttons.map((button) => button.custom_id)).size, 6);
	assert.equal(buttons[0].emoji.id, '1255303681654521856');
	assert.equal(request.edits.length, 1);
});

test('users without Manage Messages cannot publish a panel', async () => {
	const { instance } = handler(SRankPanelCommand);
	const request = interaction({ canPost: false });
	await instance.chatInputRun(request.value);
	assert.equal(request.sent.length, 0);
	assert.equal(request.replies[0].flags, MessageFlags.Ephemeral);
	assert.match(request.replies[0].content, /Manage Messages/);
});

test('handlers ignore unrelated interactions', () => {
	assert.equal(parsedId(handler(SRankExpansionHandler).instance, 'unrelated:button'), null);
	assert.equal(parsedId(handler(ReportHandler).instance, 'unrelated:form'), null);
});

for (const expansion of reports.expansions) {
	test(expansion.name + ' button opens its own modal for ordinary channel users', async () => {
		const { instance } = handler(SRankExpansionHandler);
		const request = interaction({ canPost: false });
		const id = parsedId(instance, reports.BUTTON_PREFIX + expansion.id);
		await instance.run(request.value, id);
		assert.equal(request.shown.length, 1);
		assert.equal(request.shown[0].custom_id, reports.MODAL_PREFIX + expansion.id);
		assert.equal(request.replies.length, 0);
	});

	test(expansion.name + ' submission relays the selected hunt with restricted mentions', async () => {
		const { instance } = handler(ReportHandler);
		const hunt = reports.getHunts(expansion)[0];
		const coordinates = 'Any free text <@999999999999999999> @everyone (12.3, 24.5)';
		const request = interaction({ huntId: hunt.id, coordinates, canPost: false });
		await instance.run(request.value, parsedId(instance, reports.MODAL_PREFIX + expansion.id));
		assert.equal(request.events[0], 'defer');
		assert.equal(request.sent.length, 1);
		const { channelId, payload } = request.sent[0];
		assert.equal(channelId, request.config.channels.manualreports);
		assert.equal(payload.content, '<@' + user.id + '> <@&' + request.config.roles.manualreports + '>');
		const embed = payload.embeds[0].toJSON();
		assert.equal(embed.description, hunt.name + ' | ' + hunt.location + ' | Leviathan\n' + coordinates);
		assert.equal(embed.title, undefined);
		assert.deepEqual(payload.allowedMentions.parse, []);
		assert.deepEqual(payload.allowedMentions.users, [user.id]);
		assert.deepEqual(payload.allowedMentions.roles, [request.config.roles.manualreports]);
		assert.match(request.edits[0].content, /relayed/);
	});
}

test('guild configuration routes production reports to their own destination and role', async () => {
	const { instance } = handler(ReportHandler);
	const request = interaction({ guildKey: 'coeurl' });
	await instance.run(request.value, 'dawntrail');
	assert.equal(request.sent.length, 1);
	assert.equal(request.sent[0].channelId, configByGuild.coeurl.channels.manualreports);
	assert.deepEqual(request.sent[0].payload.allowedMentions.roles, [configByGuild.coeurl.roles.manualreports]);
});

test('each listed World is preserved in the relayed report', async () => {
	const { instance } = handler(ReportHandler);
	for (const world of ['Behemoth', 'Excalibur', 'Exodus', 'Famfrit', 'Hyperion', 'Lamia', 'Leviathan', 'Ultros']) {
		const request = interaction({ world, coordinates: 'ToD: 14:30' });
		await instance.run(request.value, 'dawntrail');
		assert.equal(request.sent.length, 1);
		assert.equal(request.sent[0].payload.embeds[0].toJSON().description,
			'The Forecaster | Living Memory | ' + world + '\nToD: 14:30');
	}
});

test('a time-of-death report preserves the supplied free text', async () => {
	const { instance } = handler(ReportHandler);
	const request = interaction({ coordinates: 'ToD: 14:30 server time, about five minutes ago' });
	await instance.run(request.value, 'dawntrail');
	assert.equal(request.sent.length, 1);
	assert.equal(request.sent[0].payload.embeds[0].toJSON().description,
		'The Forecaster | Living Memory | Leviathan\nToD: 14:30 server time, about five minutes ago');
});

test('zone-only reports can leave the optional text input blank', async () => {
	const { instance } = handler(ReportHandler);
	const request = interaction({ coordinates: '' });
	await instance.run(request.value, 'dawntrail');
	assert.equal(request.sent.length, 1);
	assert.match(request.sent[0].payload.embeds[0].toJSON().description, /Living Memory/);
	assert.equal(request.sent[0].payload.embeds[0].toJSON().description, 'The Forecaster | Living Memory | Leviathan');
});

for (const [name, options] of [
	['unknown World', { world: 'unlisted-world' }],
	['missing World field', { missingWorld: true }],
	['no World selected', { selectedWorlds: [] }],
	['multiple Worlds selected', { selectedWorlds: ['Leviathan', 'Ultros'] }],
	['unknown hunt', { huntId: 'does-not-exist' }],
	['hunt from another expansion', { huntId: 'tyger' }],
	['multiple selected hunts', { selected: ['the_forecaster', 'ihnuxokiy'] }],
	['wrong source channel', { channelId: 'wrong-channel' }],
	['missing destination', { fetchError: true }],
	['wrong destination guild', { wrongDestinationGuild: true }],
	['forum destination', { channelType: ChannelType.GuildForum }],
	['missing Embed Links', { permissions: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }],
	['missing role', { missingRole: true }],
	['unmentionable role', { permissions: defaultPermissions.filter((permission) => permission !== PermissionFlagsBits.MentionEveryone) }],
	['send failure', { sendError: true }],
]) {
	test(name + ' fails privately without a successful relay', async () => {
		const { instance } = handler(ReportHandler);
		const request = interaction(options);
		await instance.run(request.value, 'dawntrail');
		assert.equal(request.sent.length, 0);
		assert.equal(request.edits.length, 1);
		assert.doesNotMatch(request.edits[0].content, /have relayed/);
	});
}

test('a mentionable role works without Mention Everyone', async () => {
	const { instance } = handler(ReportHandler);
	const request = interaction({
		mentionable: true,
		permissions: defaultPermissions.filter((permission) => permission !== PermissionFlagsBits.MentionEveryone),
	});
	await instance.run(request.value, 'dawntrail');
	assert.equal(request.sent.length, 1);
});

test('unknown expansion and unconfigured guild fail privately', async () => {
	for (const unknownGuild of [false, true]) {
		const { instance } = handler(ReportHandler);
		const request = interaction();
		if (unknownGuild) request.value.guildId = 'unconfigured';
		await instance.run(request.value, unknownGuild ? 'dawntrail' : 'unknown-expansion');
		assert.equal(request.sent.length, 0);
		assert.equal(request.edits.length, 1);
	}
});

test('DM button click gives a private server-only response', async () => {
	const { instance } = handler(SRankExpansionHandler);
	const request = interaction();
	request.value.guild = null;
	request.value.guildId = null;
	await instance.run(request.value, 'dawntrail');
	assert.equal(request.shown.length, 0);
	assert.equal(request.replies[0].flags, MessageFlags.Ephemeral);
});

test('two users retain independent hunt and coordinate selections', async () => {
	const { instance } = handler(ReportHandler);
	const first = interaction({ huntId: 'the_forecaster', coordinates: 'First location' });
	const second = interaction({ huntId: 'sphatika', coordinates: 'Second location', world: 'Ultros' });
	second.value.user = { ...user, id: '234567890123456789', username: 'Second Reporter' };
	await Promise.all([instance.run(first.value, 'dawntrail'), instance.run(second.value, 'endwalker')]);
	assert.match(first.sent[0].payload.embeds[0].toJSON().description, /^The Forecaster/);
	assert.match(second.sent[0].payload.embeds[0].toJSON().description, /^Sphatika/);
	assert.match(first.sent[0].payload.embeds[0].toJSON().description, / \| Leviathan\n/);
	assert.match(second.sent[0].payload.embeds[0].toJSON().description, / \| Ultros\n/);
	assert.deepEqual(first.sent[0].payload.allowedMentions.users, [user.id]);
	assert.deepEqual(second.sent[0].payload.allowedMentions.users, [second.value.user.id]);
});

test('confirmation failure after delivery never reports a failed relay or resends', async () => {
	const { instance, logs } = handler(ReportHandler);
	const request = interaction({ confirmationError: true });
	await instance.run(request.value, 'dawntrail');
	assert.equal(request.sent.length, 1);
	assert.equal(request.events.filter((event) => event === 'edit').length, 1);
	assert.match(logs[0], /Report delivered/);
});
