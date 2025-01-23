require('module-alias/register');
const { SapphireClient } = require('@sapphire/framework');
// eslint-disable-next-line no-unused-vars
const { maintoken, testtoken } = require('../config.json');
const { GatewayIntentBits } = require('discord.js');


const client = new SapphireClient ({
	defaultPrefix: '~',
	caseInsensitiveCommands: true,
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildModeration,
	],
	loadMessageCommandListeners: true,
});

// client.login(maintoken);
client.login(testtoken);

module.exports = client;