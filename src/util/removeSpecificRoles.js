const client = require('@root/src/index.js');
const getCallerModule = require('@util/getCallerModule.js');

async function removeSpecificRoles(guildId, memberId, rolesToRemove) {
	const callerModule = getCallerModule();

	if (!Array.isArray(rolesToRemove)) {
		console.log(`${callerModule}: rolesToRemove must be an array`);
		throw new Error('rolesToRemove must be an array');
	}

	try {
		const guild = await client.guilds.fetch(guildId);
		if (!guild) {
			console.log(`${callerModule}: Guild not found`);
			throw new Error('Guild not found');
		}

		const member = await guild.members.fetch(memberId);
		if (!member) {
			console.log(`${callerModule}: Member not found`);
			throw new Error('Member not found');
		}

		const memberName = member.user.tag;

		for (const role of rolesToRemove) {
			const roleId = role.id;
			const roleName = role.name;

			if (member.roles.cache.has(roleId)) {
				await member.roles.remove(roleId);
				console.log(`${callerModule}: Removed role ${roleName} (ID: ${roleId}) from member ${memberName} (ID: ${memberId})`);
			}
		}
	}
	catch (error) {
		console.error('Error managing member roles:', error);
	}
}

module.exports = removeSpecificRoles;