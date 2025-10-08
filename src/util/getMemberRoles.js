const client = require('@root/src/index.js');

async function getMemberRoles(guildId, memberId) {
	try {
		const guild = await client.guilds.fetch(guildId);
		if (!guild) {
			throw new Error('Guild not found');
		}

		const member = await guild.members.fetch(memberId);
		if (!member) {
			throw new Error('Member not found');
		}

		const roles = member.roles.cache.map(role => ({
			id: role.id,
			name: role.name,
		}));

		return roles;
	}
	catch (error) {
		console.error('Error fetching member roles:', error);
		return null;
	}
}

module.exports = getMemberRoles;