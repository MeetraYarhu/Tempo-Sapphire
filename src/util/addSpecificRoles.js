const client = require('@root/src/index.js');
// const { cacheGuildAndMember } = require('./cacheUtils.js');

async function addSpecificRoles(guildId, memberId, rolesToAdd) {
	if (!Array.isArray(rolesToAdd)) {
		throw new Error('rolesToAdd must be an array');
	}

	try {
		const guild = await client.guilds.fetch(guildId);
		if (!guild) {
			throw new Error('Guild not found');
		}

		const member = await guild.members.fetch(memberId);
		if (!member) {
			throw new Error('Member not found');
		}

		const memberName = member.user.tag;

		for (const role of rolesToAdd) {
			const roleId = role.id;
			const roleName = role.name;

			if (!member.roles.cache.has(roleId)) {
				await member.roles.add(roleId);
				console.log(`Added role ${roleName} (ID: ${roleId}) from member ${memberName} (ID: ${memberId})`);
			}
			else {
				console.log(`Member ${memberName} (ID: ${memberId}) already has role ${roleName} (ID: ${roleId})`);
			}
		}
	}
	catch (error) {
		console.error('Error managing member roles:', error);
	}
}

module.exports = addSpecificRoles;