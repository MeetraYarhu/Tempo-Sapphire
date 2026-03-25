require('module-alias/register');
require('@sapphire/plugin-logger/register');
const { SapphireClient } = require('@sapphire/framework');
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

client.login(maintoken);
// client.login(testtoken);

module.exports = client;