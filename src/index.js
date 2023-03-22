const { SapphireClient } = require('@sapphire/framework');
const { token } = require('../config.json');
const { Events, GatewayIntentBits } = require('discord.js');

const client = new SapphireClient ({
	defaultPrefix: '?',
	caseInsensitiveCommands: true,
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.MessageContent,
	],
	loadMessageCommandListeners: true,
});

client.once(Events.ClientReady, c => {
	console.log(`Ready! ${c.user.tag}`);
});

client.login(token);
