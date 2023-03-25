const { SapphireClient } = require('@sapphire/framework');
const { maintoken } = require('../config.json');
// const { testtoken } = require('../config.json');
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

client.once(Events.ClientReady, c => {
	console.log(`Ready! ${c.user.tag}`);
});

client.login(maintoken);
