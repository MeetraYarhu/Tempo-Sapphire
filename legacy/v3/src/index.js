const { SapphireClient } = require('@sapphire/framework');
// const { maintoken } = require('../config.json');
const { testtoken } = require('../config.json');
const { Events, GatewayIntentBits } = require('discord.js');

const client = new SapphireClient ({
	defaultPrefix: '~',
	caseInsensitiveCommands: true,
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.MessageContent,
	],
	loadMessageCommandListeners: true,
});

// client.login(maintoken);
client.login(testtoken);
