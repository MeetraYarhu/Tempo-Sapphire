const client = require('@root/src/index.js');

const guildCache = {};
const memberCache = {};

async function cacheGuildAndMember(guildId, memberId) {
	try {
		let guild = guildCache[guildId];
		if (!guild) {
			guild = await client.guilds.fetch(guildId);
			guildCache[guildId] = guild;
		}

		let member = memberCache[memberId];
		if (!member) {
			member = await guild.members.fetch(memberId);
			memberCache[memberId] = member;
		}
		return { guild, member };
	}
	catch (error) {
		console.error('Error caching guild or member:', error);
		throw error;
	}
}

module.exports = { cacheGuildAndMember };