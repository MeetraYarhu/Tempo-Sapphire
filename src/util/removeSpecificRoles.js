const client = require('@root/src/index.js');

async function removeSpecificRoles(guildId, memberId, rolesToRemove) {
	if (!Array.isArray(rolesToRemove)) {
		throw new Error('rolesToRemove must be an array');
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

		for (const role of rolesToRemove) {
			const roleId = role.id;
			const roleName = role.name;

			if (member.roles.cache.has(roleId)) {
				await member.roles.remove(roleId);
				console.log(`Removed role ${roleName} (ID: ${roleId}) from member ${memberName} (ID: ${memberId})`);
			}
		}
	}
	catch (error) {
		console.error('Error managing member roles:', error);
	}
}

module.exports = removeSpecificRoles;